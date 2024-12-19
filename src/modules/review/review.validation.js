import joi from "joi";
import { generalFields } from "../../middleware/validation.js";

export const addReviewVal = joi.object({
    user:generalFields.objectId,
    productId:generalFields.objectId.required(),
    comment:generalFields.comment,
    rate:generalFields.rate.required().min(0)
    //to do
})

export const deleteReviewsVal =joi.object({
    reviewId:generalFields.objectId.required()
})