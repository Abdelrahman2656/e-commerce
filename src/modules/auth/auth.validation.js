import joi from "joi";
import { generalFields } from "../../middleware/validation.js";

export const signUpVal = joi.object({
name : generalFields.name.required(),
email:generalFields.email.required(),
password :generalFields.password.required(),
phone:generalFields.phone.required(),
cPassword: generalFields.cPassword.required(),
DOB: generalFields.DOB,


})

export const loginVal = joi.object({
    email :generalFields.email.when('phone',{
        is:joi.exist(),
        then:joi.optional(),
        otherwise:joi.required()
    }),
    phone:generalFields.phone,
    password:generalFields.password.required()
})
export const forgetPasswordVal =joi.object({
    email :generalFields.email.when('phone',{
        is:joi.exist(),
        then:joi.optional(),
        otherwise:joi.required()
    }),
    phone:generalFields.phone,
})

export const changPassVal = joi.object({
    email :generalFields.email.when('phone',{
        is:joi.exist(),
        then:joi.optional(),
        otherwise:joi.required()
    }),
    phone:generalFields.phone,
    password:generalFields.password.required(),
   cPassword: generalFields.cPassword.required(),
   otp:generalFields.otp.required()
})