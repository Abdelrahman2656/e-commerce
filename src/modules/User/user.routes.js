import { Router } from "express";
import { isAuthentication } from "../../middleware/authentication.js";
import { isValid } from "../../middleware/validation.js";
import { changPasswordVal } from "./user.validation.js";
import { asyncHandler } from "../../middleware/asyncHandler.js";
import { resetPassword } from "./user.controller.js";

const authRouter = Router()
//change password
authRouter.put('/change-password',isAuthentication(),isValid(changPasswordVal),
asyncHandler(resetPassword))
export default authRouter