import joi from "joi";
import { generalFields } from "../../middleware/validation.js";

export const createOrderVal = joi.object({
    phone: generalFields.phone.required(),
    payment: generalFields.payment,
    street:generalFields.street,
    country:generalFields.country,
    city:generalFields.city,
    coupon: generalFields.code.optional()
})