import { Router } from "express";
import { isValid } from "../../middleware/validation.js";
import { changPassVal, forgetPasswordVal, loginVal, signUpVal } from "./auth.validation.js";
import { asyncHandler } from "../../middleware/asyncHandler.js";
import { changePassword,  forgetPassword, login, signUp, updateUser, verifyAccount } from "./auth.controller.js";
import { isAuthentication } from "../../middleware/authentication.js";
import { isAuthorized } from "../../middleware/authorization.js";
import { roles } from "../../utils/constant/enums.js";

const userRouter=Router()
//sign up
userRouter.post('/signup',isValid(signUpVal),asyncHandler(signUp))
userRouter.get('/verify/:token',asyncHandler(verifyAccount))
//login
userRouter.post('/login',isValid(loginVal),asyncHandler(login))
// forget password 
userRouter.post('/forget-password',isValid(forgetPasswordVal),asyncHandler(forgetPassword))
//change password 
userRouter.put('/change-Password-verify',isValid(changPassVal),asyncHandler(changePassword))
//update user
userRouter.put('/update-profile',isAuthentication(),isAuthorized(Object.values(roles)),asyncHandler(updateUser))



// import passport from "passport";



// Google login route
// userRouter.get(
//   "/auth/google",
//   passport.authenticate("google", { scope: ["profile", "email"] })
// );

// // Google callback route
// userRouter.get(
//   "/auth/google/callback",
//   passport.authenticate("google", {
//     successRedirect: "/api/v1/auth/protected", // Redirect after success
//     failureRedirect: "/login", // Redirect after failure
//   })
// );

// // Protected route (accessible only after login)
// userRouter.get("/auth/protected", (req, res) => {
//   if (!req.isAuthenticated()) {
//     return res.status(401).json({ message: "Unauthorized" });
//   }
//   const { name, email } = req.user;
//   res.status(200).json({ message: `Hello, ${name} (${email})!` });
// });

// // Logout route
// userRouter.get("/auth/logout", (req, res) => {
//   req.logout((err) => {
//     if (err) {
//       return res.status(500).json({ message: "Error logging out" });
//     }
//     res.status(200).json({ message: "Logged out successfully" });
//   });
// });




export default userRouter