import { Router } from "express";
import { cloudUpload } from "../../utils/cloudUpload.js";
import { isValid } from "../../middleware/validation.js";
import { addProductVal, deleteProductVal, updateProductVal } from "./product.validation.js";
import { asyncHandler } from "../../middleware/asyncHandler.js";
import { addProduct, deleteProduct, getAllProduct, getProductById,  updateProduct } from "./product.controller.js";
import { isAuthentication } from "../../middleware/authentication.js";
import { isAuthorized } from "../../middleware/authorization.js";
import { roles } from "../../utils/constant/enums.js";

const productRouter = Router();
//add product
//todo
productRouter.post(
  "/product",isAuthentication(),isAuthorized([roles.ADMIN , roles.SELLER]),
  cloudUpload({}).fields([
    { name: "mainImage", maxCount: 1 },
    { name: "subImages", maxCount: 10 },
  ]),
  isValid(addProductVal),
  asyncHandler(addProduct)
);
productRouter.get("/all-product",asyncHandler(getAllProduct))
productRouter.get('/product-id/:id',isAuthentication(),asyncHandler(getProductById))
//update product
productRouter.put('/product/:productId',isAuthentication(),
isAuthorized([roles.ADMIN , roles.SELLER]),
cloudUpload({}).fields([
  { name: "mainImage", maxCount: 1 },
  { name: "subImages", maxCount: 10 },
]),isValid(updateProductVal),asyncHandler(updateProduct))
//delete product
productRouter.delete('/product/:productId',isAuthentication(),
isAuthorized([roles.ADMIN , roles.SELLER]),
isValid(deleteProductVal),asyncHandler(deleteProduct))
//history
// productRouter.get('/view-history', isAuthentication(), asyncHandler(getViewHistory));

export default productRouter;
