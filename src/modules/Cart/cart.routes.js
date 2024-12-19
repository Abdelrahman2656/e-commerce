import { Router } from "express";
import { isAuthentication } from "../../middleware/authentication.js";
import { isAuthorized } from "../../middleware/authorization.js";
import { roles } from "../../utils/constant/enums.js";
import { isValid } from "../../middleware/validation.js";
import { addToCartVal, deleteCartVal } from "./cart.validation.js";
import { asyncHandler } from "../../middleware/asyncHandler.js";
import { addToCart, deleteAllCart, deleteCart, getCart } from "./cart.controller.js";

const cartRouter = Router();
cartRouter.put(
  "/cart",
  isAuthentication(),
  isAuthorized([roles.USER, roles.ADMIN]),
  isValid(addToCartVal),
  asyncHandler(addToCart)
);
//get cart
cartRouter.get(
  "/cart",
  isAuthentication(),
  isAuthorized([roles.USER, roles.ADMIN]),
  asyncHandler(getCart)
);
//delete cart
cartRouter.delete(
  "/cart-id/:productId",
  isAuthentication(),
  isAuthorized([roles.USER, roles.ADMIN]),
  isValid(deleteCartVal),
  asyncHandler(deleteCart)
);
//delete all cart
cartRouter.delete(
    "/cart-id",
    isAuthentication(),
    isAuthorized([roles.USER, roles.ADMIN]),
  
    asyncHandler(deleteAllCart)
  );
export default cartRouter;
