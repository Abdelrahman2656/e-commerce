import { Router } from "express";
import { asyncHandler } from "../../middleware/asyncHandler.js";
import { isValid } from "../../middleware/validation.js";
import {
  addCategory,
  deleteCategory,
  getAllCategory,
  getCategoryById,
  updateCategory,
} from "./category.controller.js";
import { addCategoryVal, deleteCategoryVal, updateCategoryVal } from "./category.validation.js";
import { isAuthentication } from "../../middleware/authentication.js";
import { isAuthorized } from "../../middleware/authorization.js";
import { roles } from "../../utils/constant/enums.js";
import { cloudUpload } from "../../utils/cloudUpload.js";

const categoryRouter = Router();
//todo auth
categoryRouter.post(
  "/category",
  isAuthentication(),
  isAuthorized([roles.ADMIN, roles.SELLER]),
  cloudUpload({}).single("image"),
  isValid(addCategoryVal),
  asyncHandler(addCategory)
);
//get category
categoryRouter.get("/allcategory", asyncHandler(getAllCategory));
// get specific category by id
categoryRouter.get("/category-id/:id", asyncHandler(getCategoryById));
// update category
categoryRouter.put(
  "/category/:categoryId",
  isAuthentication(),
  isAuthorized([roles.ADMIN, roles.SELLER]),
  cloudUpload({}).single("image"),
  isValid(updateCategoryVal),
  asyncHandler(updateCategory)
);
//delete category 
categoryRouter.delete(
  "/category/:categoryId",
  isAuthentication(),
  isAuthorized([roles.ADMIN, roles.SELLER]),
  cloudUpload({}).single("image"),
  isValid(deleteCategoryVal),
  asyncHandler(deleteCategory)
);
export default categoryRouter;
