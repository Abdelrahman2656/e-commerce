import joi from "joi";
import { generalFields } from "../../middleware/validation.js";

export const changPasswordVal = joi.object({
password : generalFields.password.required(),
oldPassword:generalFields.oldPassword,
cPassword: generalFields.cPassword.required(),
})