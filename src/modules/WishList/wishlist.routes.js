import { Router } from "express";
import { isAuthentication } from "../../middleware/authentication.js";
import { isAuthorized } from "../../middleware/authorization.js";
import { roles } from "../../utils/constant/enums.js";
import { asyncHandler } from "../../middleware/asyncHandler.js";
import { addWishList, deleteFromWishlist, getWishlist } from "./wishlist.controller.js";
import { isValid } from "../../middleware/validation.js";
import { addWishlistVal, deleteWishlistVal } from "./wishlist.validation.js";

const wishlistRouter =Router()
//add wishList 
wishlistRouter.post('/:productId',isAuthentication(),
isAuthorized([roles.USER,roles.ADMIN]),
isValid(addWishlistVal),
asyncHandler(addWishList))
//get wishlist
wishlistRouter.get('/all-wishlist', isAuthentication(),
isAuthorized([roles.USER,roles.ADMIN ]),asyncHandler(getWishlist))
export default wishlistRouter
//delete wishLIST
wishlistRouter.delete('/:productId',isAuthentication(),
isAuthorized([roles.USER,roles.ADMIN]),
isValid(deleteWishlistVal),
asyncHandler(deleteFromWishlist))