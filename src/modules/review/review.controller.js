import { Product, Review } from "../../../Database/index.js";
import { AppError } from "../../utils/appError.js";
import { roles } from "../../utils/constant/enums.js";
import { messages } from "../../utils/constant/messages.js";

//add review and update review
export const addReview = async (req, res, next) => {
  //get data from req
  let { comment, rate } = req.body;
  let { productId } = req.params;
  let userId = req.authUser._id;
  //check product
  const productExist = await Product.findById(productId);
  if (!productExist) {
    return next(new AppError(messages.product.notFound, 404));
  }
  //to do
  //check if review
  const reviewExist = await Review.findOneAndUpdate(
    { user: userId, product: productId },
    { rate, comment },
    { new: true }
  );
  let data = reviewExist;
  if (!reviewExist) {
    //prepare data
    const review = new Review({
      user: userId,
      product: productId,
      comment,
      rate,
      isVerified: false, // todo true
    });
    //send to db
    const createdReview = await review.save();
    data = createdReview;
    if (!createdReview) {
      return next(messages.review.failToCreate, 500);
    }
  }
  // update rate
  let reviews = await Review.find({ product: productId }); //[{}]
  // reviews.forEach((review)=>{
  //     finalRate += review.rate
  // })
  // let finalRate = finalRate/reviews.length
  //   let finalRate = reviews.reduce((acc, cur) => {
  //     return (acc += cur.rate);
  //   }, 0);
  //   finalRate /= reviews.length;
  // Calculate the average rating
  const rating = await Review.find({ product: productId }).select('rate')
  let avgRate = rating.reduce((acc, cur) => {
    return (acc += cur.rate);
  }, 0);
  avgRate = avgRate / rating.length;

  await Product.findByIdAndUpdate(productId, { rate: avgRate });
  const formatDate = (date) => {
    const options = { day: "2-digit", month: "short", year: "numeric" };
    return new Date(date).toLocaleDateString("en-US", options);
  };
  const formattedDate = formatDate(data.createdAt || data.updatedAt);

  //send response
  return res.status(201).json({
    message: messages.review.createdSuccessfully,
    success: true,
    dataReviews: {
      ...data.toObject(),
      formattedDate, // Include formatted date
    },
  });
};
//get all reviews
export const getAllReviews = async (req, res, next) => {
  let reviews = await Review.find();
  // total
  const TotalReviews = await Review.countDocuments();
  //send response
  return res
    .status(200)
    .json({ success: true, TotalReviews, ReviewsData: reviews });
};
//delete reviews
export const deleteReviews = async (req, res, next) => {
  //get data from req
  let { reviewId } = req.params;
  let userId=req.authUser._id
  let userRole=req.authUser.role
  //check review Id
  const reviewExist = await Review.findById(reviewId);
  if (!reviewExist) {
    return next(new AppError(messages.review.notFound, 404));
  }
  //delete review
  if (userId.toString() != reviewExist.user.toString() && userRole != roles.ADMIN) {
    return next(new AppError(messages.user.notAllowed, 401))
}
let deleteReviews =await Review.findByIdAndDelete(reviewId)
if(!deleteReviews){
    return next(new AppError(messages.review.failToDelete,500))
}
  // Find the product associated with the review
  const product = await Product.findById(deleteReviews.product);
  if (!product) {
    return next(new AppError(messages.product.notFound, 404));
  }
  
  const totalReviews = await Review.find({ product: product._id });

  if (totalReviews.length === 0) {
    product.rate = 1;  
    product.rateNum = 0;  
  } else {
    const totalRate = totalReviews.reduce((sum, review) => sum + review.rate, 0);
    
    product.rate = totalRate / totalReviews.length;
    
    product.rateNum = totalReviews.length;
  }
  
  await product.save();


//send response
return res.status(200).json({message:messages.review.deleteSuccessfully,success:true,deleteReviews})
};
