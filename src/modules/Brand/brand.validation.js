import joi from "joi";
import { generalFields } from "../../middleware/validation.js";

export const addBrandVal =joi.object({
    name:generalFields.name.required(),
    createdBy:generalFields.objectId.required()
})

export const updateBrandVal = joi.object({
    name :generalFields.name,
    brandId : generalFields.objectId.required()
})

export const deleteBrandVal = joi.object({
    brandId : generalFields.objectId.required()
})