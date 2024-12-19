import joi from "joi";
import { generalFields } from "../../middleware/validation.js";

export const addToCartVal = joi.object({
productId:generalFields.objectId.required(),
quantity:generalFields.quantity,


})

export const deleteCartVal =joi.object({
    productId:generalFields.objectId.required(),
})
