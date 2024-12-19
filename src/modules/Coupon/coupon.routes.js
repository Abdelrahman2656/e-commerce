import { Router } from "express";
import { isAuthentication } from "../../middleware/authentication.js";
import { isAuthorized } from "../../middleware/authorization.js";
import { roles } from "../../utils/constant/enums.js";
import { isValid } from "../../middleware/validation.js";
import { addCouponVal, deleteCouponVal, updateCouponVal } from "./coupon.validation.js";
import { asyncHandler } from "../../middleware/asyncHandler.js";
import {
  addToCoupon,
  deleteCoupon,
  getAllCoupon,
  getAllCouponById,
  updateCoupon,
} from "./coupon.controller.js";

const couponRouter = Router();
//add coupon
couponRouter.post(
  "/coupon",
  isAuthentication(),
  isAuthorized([roles.ADMIN]),
  isValid(addCouponVal),
  asyncHandler(addToCoupon)
);
//get all coupon
couponRouter.get("/all-coupon", asyncHandler(getAllCoupon));
//get by id
couponRouter.get("/coupon/:couponId", asyncHandler(getAllCouponById));
//update coupon
couponRouter.put(
  "/coupon-id/:couponId",
  isAuthentication(),
  isAuthorized([roles.ADMIN]),
  isValid(updateCouponVal),
  asyncHandler(updateCoupon)
);
//update coupon
couponRouter.delete(
  "/coupon-id/:couponId",
  isAuthentication(),
  isAuthorized([roles.ADMIN]),
  isValid(deleteCouponVal),
  asyncHandler(deleteCoupon)
);
export default couponRouter;
