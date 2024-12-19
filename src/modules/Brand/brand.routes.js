import { Router } from "express";
import { asyncHandler } from "../../middleware/asyncHandler.js";
import { isValid } from "../../middleware/validation.js";
import { cloudUpload } from "../../utils/cloudUpload.js";
import { addBrand, deleteBrand, getAllBrand, getBrandById, updateBrand } from "./brand.controller.js";
import { addBrandVal, deleteBrandVal, updateBrandVal } from "./brand.validation.js";
import { isAuthorized } from "../../middleware/authorization.js";
import { isAuthentication } from "../../middleware/authentication.js";
import { roles } from "../../utils/constant/enums.js";

const brandRouter = Router();
//add brand

brandRouter.post(
  "/brand",
  isAuthentication(),
  isAuthorized([roles.ADMIN, roles.SELLER]),
  cloudUpload({}).single("image"),
  isValid(addBrandVal),
  asyncHandler(addBrand)
);
brandRouter.get("/all-brand", asyncHandler(getAllBrand));
//update brand
brandRouter.put(
  "/brand/:brandId",
  isAuthentication(),
  isAuthorized([roles.ADMIN, roles.SELLER]),
  cloudUpload({}).single("image"),
  isValid(updateBrandVal),
  asyncHandler(updateBrand)
);
// get specific brand by id
brandRouter.get("/brand-id/:id", asyncHandler(getBrandById));

//delete brand 
brandRouter.delete(
  "/brand/:brandId",
  isAuthentication(),
  isAuthorized([roles.ADMIN, roles.SELLER]),
  cloudUpload({}).single("image"),
  isValid(deleteBrandVal),
  asyncHandler(deleteBrand)
);
export default brandRouter;
