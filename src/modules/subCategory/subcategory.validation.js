import joi from "joi";
import { generalFields } from "../../middleware/validation.js";

export const addSubCategoryVal = joi.object({
    name : generalFields.name.required(),
    category:generalFields.objectId.required(),
    createdBy:generalFields.objectId.required()
})

export const updateSubCategoryVal = joi.object({
    subCategoryId:generalFields.objectId.required(),
    name : generalFields.name
})

export const deleteSubCategoryVal =joi.object({
    subCategoryId:generalFields.objectId.required()
})