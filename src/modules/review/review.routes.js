import { Router } from "express";
import { isAuthentication } from "../../middleware/authentication.js";
import { isAuthorized } from "../../middleware/authorization.js";
import { roles } from "../../utils/constant/enums.js";
import { isValid } from "../../middleware/validation.js";
import { addReviewVal, deleteReviewsVal } from "./review.validation.js";
import { asyncHandler } from "../../middleware/asyncHandler.js";
import {
  addReview,
  deleteReviews,
  getAllReviews,
} from "./review.controller.js";

const reviewRouter = Router();
//add review
reviewRouter.post(
  "/review/:productId",
  isAuthentication(),
  isAuthorized([roles.ADMIN, roles.USER]),
  isValid(addReviewVal),
  asyncHandler(addReview)
);
//get all reviews
reviewRouter.get("/all-review", asyncHandler(getAllReviews));
//delete reviews
reviewRouter.delete(
  "/review/:reviewId",
  isAuthentication(),
  isAuthorized([roles.ADMIN, roles.USER]),
  isValid(deleteReviewsVal),
  asyncHandler(deleteReviews)
);
export default reviewRouter;
