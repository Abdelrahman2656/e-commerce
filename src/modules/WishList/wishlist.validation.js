import joi from "joi";
import { generalFields } from "../../middleware/validation.js";

export const addWishlistVal = joi.object({
productId:generalFields.objectId.required(),
})

export const deleteWishlistVal = joi.object({
    productId:generalFields.objectId.required(),
    })
    