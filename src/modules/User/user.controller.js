import { User } from "../../../Database/index.js";
import { AppError } from "../../utils/appError.js";
import { messages } from "../../utils/constant/messages.js";
import { comparePassword, hashPassword } from "../../utils/hash-compare.js";

export const resetPassword = async (req, res, next) => {
  //get data from req
  const { oldPassword, password } = req.body;
  let userId = req.authUser._id;
  //check user password
  let match = comparePassword({
    password: oldPassword,
    hashPassword: req.authUser.password,
  });
  if (!match) {
    return next(new AppError(messages.user.invalidCredential, 401));
  }
  //hash new password
  let hashedPassword = hashPassword({ password });
  //update user
   const updateUserPassword= await User.updateOne(
    { _id: userId },
    { password: hashedPassword },
  );
  if(!updateUserPassword){
    return next(new AppError(messages.user.failToUpdate,500))
  }
  //send response
  return res.status(200).json({message:messages.user.changePassword,success:true})
};
