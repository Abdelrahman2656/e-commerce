import { Router } from "express";
import { isValid } from "../../middleware/validation.js";
import { addSubCategoryVal, deleteSubCategoryVal, updateSubCategoryVal } from "./subcategory.validation.js";
import { asyncHandler } from "../../middleware/asyncHandler.js";
import { addSubCategory, deleteSubCategory, getAllSubcategory, getAllSubcategoryById, updateSubCategory } from "./subcategory.controller.js";
import { cloudUpload } from "../../utils/cloudUpload.js";
import { isAuthentication } from "../../middleware/authentication.js";
import { isAuthorized } from "../../middleware/authorization.js";
import { roles } from "../../utils/constant/enums.js";

const subCategoryRouter = Router();

//add subcategory:

subCategoryRouter.post(
  "/subcategory",
  isAuthentication(),
  isAuthorized([roles.ADMIN, roles.SELLER]),
  cloudUpload({}).single("image"),
  isValid(addSubCategoryVal),
  asyncHandler(addSubCategory)
);
//get all subcategory
subCategoryRouter.get('/all-subcategory',asyncHandler(getAllSubcategory))
//get subcategory by id 
subCategoryRouter.get('/subcategory-id/:subcategoryId',asyncHandler(getAllSubcategoryById))
//update subcategory
subCategoryRouter.put('/subcategory-id/:subCategoryId',isAuthentication(),
isAuthorized([roles.ADMIN,roles.SELLER]),cloudUpload({}).single('image'),isValid(updateSubCategoryVal),asyncHandler(updateSubCategory))
//delete subcategory
subCategoryRouter.delete('/subcategory-id/:subCategoryId',isAuthentication(),
isAuthorized([roles.ADMIN,roles.SELLER]),cloudUpload({}).single('image'),isValid(deleteSubCategoryVal),asyncHandler(deleteSubCategory))
export default subCategoryRouter;
