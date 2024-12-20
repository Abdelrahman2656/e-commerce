import bcrypt from "bcrypt";
import { Cart, User } from "../../../Database/index.js";
import { AppError } from "../../utils/appError.js";
import { messages } from "../../utils/constant/messages.js";
import { generateToken, verifyToken } from "../../utils/token.js";
import { emailHtml } from "../../utils/email/emailHtml.js";
import { statues } from "../../utils/constant/enums.js";
import { sendEmail } from "../../utils/email/email.js";
import {
  deleteVerificationData,
  getVerificationData,
  saveVerificationData,
} from "../../utils/email/emailVerification.js";
import { generateOTP } from "../../utils/OTP.js";
import { forgetPasswordHtml } from "../../utils/email/forget-password.js";
import { hashPassword } from "../../utils/hash-compare.js";

export const signUp = async (req, res, next) => {
  let { name, email, password, phone } = req.body;

  // Check if user already exists
  const userExistence = await User.findOne({ email });

  if (userExistence) {
    if (userExistence.status === statues.PENDING) {
      // Generate JWT token for the user (for use in verification link)
      const token = generateToken({
        payload: { email, _id: userExistence._id },
      });

      const expirationDuration = 5 * 60 * 1000; // 5 minutes (in milliseconds)
      const expirationTime = Date.now() + expirationDuration; // Expiration timestamp
      const verificationCode = Math.floor(100000 + Math.random() * 900000);

      await saveVerificationData({ email, verificationCode, expirationTime });

      const verificationLink = `${req.protocol}://${req.headers.host}/api/v1/verify/${token}`;
      const emailContent = emailHtml(
        verificationLink,
        verificationCode,
        userExistence.name,
        `${expirationDuration / 1000 / 60} minutes`
      );

      await sendEmail({
        to: email,
        subject: "Verify Your Account",
        html: emailContent,
      });

      return res.status(200).json({
        message:
          "Verification email has been re-sent. Please check your inbox.",
        success: true,
        userData: userExistence,
      });
    }

    // If the user is already verified, return an appropriate message
    if (userExistence.status === statues.VERIFIED) {
      return next(new AppError("Your account is already verified.", 400));
    }
  }

  // If no user is found or it's a new user, proceed with the regular sign-up process
  password = bcrypt.hashSync(password, 8);
  const user = new User({
    name,
    email,
    password,
    phone,
    status: statues.PENDING, // Set status to PENDING initially
  });

  const createdUser = await user.save();
  if (!createdUser) {
    return next(new AppError(messages.user.failToCreate, 500));
  }

  // Generate JWT token for the user (for use in verification link)
  const token = generateToken({ payload: { email, _id: createdUser._id } });

  // Generate verification details
  const expirationDuration = 5 * 60 * 1000; // 5 minutes (in milliseconds)
  const expirationTime = Date.now() + expirationDuration; // Expiration timestamp
  const verificationCode = Math.floor(100000 + Math.random() * 900000);

  // Save verification data
  await saveVerificationData({ email, verificationCode, expirationTime });

  // Create the verification link and email content
  const verificationLink = `${req.protocol}://${req.headers.host}api/v1/verify/${token}`;
  const emailContent = emailHtml(
    verificationLink,
    verificationCode,
    name,
    `${expirationDuration / 1000 / 60} minutes`
  );

  // Send the email
  await sendEmail({
    to: email,
    subject: "Verify Your Account",
    html: emailContent,
  });

  // Schedule cleanup for expired verification data
  setTimeout(async () => {
    const storedData = await getVerificationData(email);

    // Check if the user has already verified their account
    const user = await User.findOne({ email });
    if (storedData && user.status === statues.PENDING) {
      await deleteVerificationData(email); // Delete expired verification data
      console.log(`Expired verification data for ${email} has been removed.`);
    }
  }, expirationDuration);

  // Send response
  return res.status(201).json({
    message: messages.user.createdSuccessfully,
    success: true,
    userData: createdUser,
  });
};

export const verifyAccount = async (req, res, next) => {
  const { token } = req.params;

  // Ensure the token is provided
  if (!token) {
    return next(new AppError("Verification token is missing", 400));
  }

  let payload;

  try {
    // Attempt to verify the token
    payload = verifyToken({ token }); // Assuming this is the function that verifies the token
  } catch (error) {
    return next(new AppError("Invalid token", 400));
  }

  const { email } = payload;

  // Fetch verification data from the database or temporary store
  const storedData = await getVerificationData(email);

  // Check if the verification data exists
  if (!storedData) {
    return next(
      new AppError("No verification data found. Please request a new one.", 400)
    );
  }

  const { verificationCode, expirationTime } = storedData;

  // Check if the code has expired
  if (Date.now() > expirationTime) {
    // Allow the user to request a new verification code after expiration
    await deleteVerificationData(email); // Clean up expired verification data
    return next(
      new AppError(
        "Verification code has expired. Please request a new one.",
        400
      )
    );
  }

  // Verify the user's account
  const user = await User.findOne({ email });

  if (!user) {
    return next(new AppError("User not found.", 404));
  }

  // Update user status to VERIFIED if not already verified
  if (user.status !== statues.VERIFIED) {
    user.status = statues.VERIFIED;
    await user.save();
    await Cart.create({ user: payload._id, products: [] });
    await deleteVerificationData(email); // Clean up verification data after successful verification
  }

  // Send success response
  return res
    .status(200)
    .json({ message: messages.user.verified, success: true });
};

export const resendVerificationCode = async (req, res, next) => {
  const { email } = req.body;

  // Check if a user exists with this email
  const user = await User.findOne({ email });

  if (!user) {
    return next(new AppError("User not found.", 404));
  }

  // If the user is already verified, no need to resend a code
  if (user.status === statues.VERIFIED) {
    return next(new AppError("Your account is already verified.", 400));
  }

  // If the user is not verified (status is PENDING), allow re-verification or signup
  if (user.status === statues.PENDING) {
    // Generate a new JWT token for the user (for use in verification link)
    const token = generateToken({ payload: { email, _id: user._id } });

    // Check if the verification code is expired
    const storedData = await getVerificationData(email);

    // If the previous verification code has expired or doesn't exist
    if (!storedData || Date.now() > storedData.expirationTime) {
      // Generate a new verification code
      const newVerificationCode = Math.floor(100000 + Math.random() * 900000);
      const newExpirationTime = Date.now() + 5 * 60 * 1000; // 5 minutes expiration

      // Save the new verification data
      await saveVerificationData({
        email,
        verificationCode: newVerificationCode,
        expirationTime: newExpirationTime,
      });

      // Create the verification link and email content
      const verificationLink = `${req.protocol}://${req.headers.host}api/v1/verify/${token}`;
      const emailContent = emailHtml(
        verificationLink,
        newVerificationCode,
        user.name,
        "5 minutes"
      );

      // Send the email with the new verification code
      await sendEmail({
        to: email,
        subject: "New Verification Code",
        html: emailContent,
      });

      return res.status(200).json({
        message: "New verification code sent. Please check your email.",
        success: true,
      });
    }

    // If the verification code is still valid, inform the user to verify
    return next(
      new AppError(
        "Verification code is still valid. Please try verifying now.",
        400
      )
    );
  }

  // If the user does not exist in the database or has other status, handle accordingly
  return next(
    new AppError("Invalid user status. Please check your account.", 400)
  );
};

//login
export const login = async (req, res, next) => {
  //get data
  let { phone, email, password } = req.body;

  const userExistence = await User.findOne({
    $or: [{ email }, { phone }],
    status: statues.VERIFIED,
  });

  if (!userExistence) {
    return next(new AppError(messages.user.notFound, 404));
  }
  //check password
  let match = bcrypt.compareSync(password, userExistence.password);
  if (!match) {
    return next(new AppError(messages.user.failToCreate, 400));
  }
  // generate token
  let token = generateToken({ payload: { _id: userExistence._id, email } });
  //send response
  return res.status(200).json({ success: true, token });
};

//forget password
export const forgetPassword = async (req, res, next) => {
  //get data from req
  let { email, phone } = req.body;
  //check email exist
  const userExist = await User.findOne({ $or: [{ email }, { phone }] }); //{} ,null
  if (!userExist) {
    return next(new AppError(messages.user.notFound, 404));
  }
  //if has already otp
  if (userExist.otp && userExist.expiredDateOtp > Date.now()) {
    return next(new AppError(messages.user.AlreadyHasOtp, 400));
  }
  //generate otp
  let otp = generateOTP();
  //update user
  userExist.otp = otp;
  userExist.expiredDateOtp = Date.now() + 5 * 60 * 1000;
  setTimeout(async () => {
    await User.updateOne(
      { _id: userExist._id, expiredDateOtp: { $lte: Date.now() } },
      { $unset: { otp: "", expiredDateOtp: "" } }
    );
  }, 5 * 60 * 1000);
  //save data
  await userExist.save();
  //send email
  await sendEmail({
    to: email,
    subject: "Forget-Password",
    html: forgetPasswordHtml(otp, userExist.name),
  });
  //send response
  return res
    .status(200)
    .json({ message: messages.user.checkEmail, success: true });
};
// change password
export const changePassword = async (req, res, next) => {
  //get data from req
  let { password, otp, email, phone } = req.body;
  // let userId = req.authUser._id;
  //check email
  const userExist = await User.findOne({ $or: [{ email }, { phone }] });
  if (!userExist) {
    return next(new AppError(messages.user.notFound, 404));
  }
  //check otp
  if (userExist.otp != otp) {
    return next(new AppError(messages.user.invalidOTP, 401));
  }
  // resend otp
  if (userExist.expiredDateOtp < Date.now()) {
    let secondOTP = generateOTP();
    userExist.secondOTP = secondOTP;
    userExist.expiredDateOtp = Date.now() + 5 * 60 * 1000;
    //save to db
    await userExist.save();
    //send email
    await sendEmail({
      to: email,
      subject: "Reset-OTP",
      html: forgetPasswordHtml(otp, userExist.name),
    });
    //send to response
    return res
      .status(200)
      .json({ message: messages.user.checkEmail, success: true });
  }
  //hash password
  let hashedPassword = hashPassword({ password });
  //update password
  await User.updateOne(
    {
      $or: [{ email: email }, { phone: phone }],
    },
    { password: hashedPassword, $unset: { otp: "", expiredDateOtp: "" } }
  );
  //send password
  return res
    .status(200)
    .json({ message: messages.user.updateSuccessfully, success: false });
};
//update user
export const updateUser = async (req, res, next) => {
  const { name, email, phone, password } = req.body;
  const userId = req.authUser._id; // Ensure user is authenticated

  try {
    // Find the user
    const user = await User.findById(userId);
    if (!user) {
      return next(new AppError("User not found.", 404));
    }

    // Check if the user is verified
    if (user.status !== statues.VERIFIED) {
      return next(new AppError("Your account must be verified to update details.", 403));
    }

    // Update fields if provided
    if (name) user.name = name;
    if (email) {
      // Check if the new email is already taken
      const emailExists = await User.findOne({ email, _id: { $ne: userId } });
      if (emailExists) {
        return next(new AppError(messages.user.alreadyExist, 400));
      }
      user.email = email;
       
      
    }
    if (phone) {
      const phoneExists = await User.findOne({ phone, _id: { $ne: userId } });
      if (phoneExists) {
        return next(new AppError("Phone number is already in use.", 400));
      }
      user.phone = phone;
    }
    if (password) {
      user.password = bcrypt.hashSync(password, 8);
    }

    // Save updated user
    await user.save();

    return res.status(200).json({
      message: messages.user.updateSuccessfully,
      success: true,
      userData: user,
    });
  } catch (error) {
    return next(new AppError("Failed to update user.", 500));
  }
};



