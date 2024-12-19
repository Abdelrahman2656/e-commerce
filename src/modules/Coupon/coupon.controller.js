import { Coupon } from "../../../Database/index.js";
import { AppError } from "../../utils/appError.js";
import { discountTypes } from "../../utils/constant/enums.js";
import { messages } from "../../utils/constant/messages.js";

//add coupon
export const addToCoupon = async (req, res, next) => {
  //get from req
  let { code, discountAmount, discountType, fromDate, toDate } = req.body;
  let userId = req.authUser._id;
  code = code.toUpperCase();
  //check coupon
  const couponExist = await Coupon.findOne({ code });
  if (couponExist) {
    return next(new AppError(messages.coupon.alreadyExist, 409));
  }
  //check if percentage
  if (discountType == discountTypes.PERCENTAGE && discountAmount > 100) {
    return next(new AppError(messages.coupon.lessThan, 400));
  }
  //prepare data
  const coupon = new Coupon({
    code,
    discountAmount,
    discountType,
    fromDate,
    toDate,
    createdBy:userId
  });
  const createdCoupon = await coupon.save()
  if(!createdCoupon){
    return next(new AppError(messages.coupon.failToCreate,500))
  }
  //send response
  return res.status(201).json({message:messages.coupon.createdSuccessfully,success:true,
    CouponData:createdCoupon
  })

};
//get all coupon
export const getAllCoupon=async(req,res,next)=>{
  let coupon = await Coupon.find()
  //total
  const TotalCoupon = await Coupon.countDocuments()
  //send response
  return res.status(200).json({TotalCoupon,success:true,CouponData:coupon})
}
// get by id
export const getAllCouponById =async (req,res,next)=>{
  let{couponId}=req.params
  //check coupon
  let coupon=await Coupon.findById(couponId)
  if(!coupon){
    return next(new AppError(messages.coupon.notFound,404))
  }
  //send response
  return res.status(200).json({success:true , CouponData:coupon})
}
//Update coupon
export const updateCoupon = async(req,res,next)=>{
  //get data from req
  let {couponId}=req.params
  let{code, discountAmount, discountType, fromDate, toDate}=req.body
  //check coupon existence
  const couponExist=await Coupon.findById(couponId)
  if(!couponExist){
    return next(new AppError(messages.coupon.notFound,404))
  }
  if(code){
    couponExist.code=code
  }
  if(discountAmount){
    couponExist.discountAmount=discountAmount
  }
  if(discountType){
    couponExist.discountType=discountType
  }
  if(fromDate){
    couponExist.fromDate=fromDate
  }
  if(toDate){
    couponExist.toDate=toDate
  }
  //save to db
  const updatedCoupon = await couponExist.save()
  if(!updateCoupon){
    return next(new AppError(messages.coupon.failToUpdate,500))
  }
  //send response
  return res.status(200).json({message:messages.coupon.updateSuccessfully,success:true,updatedCoupon})
}
//delete coupon 
export const deleteCoupon = async(req,res,next)=>{
  //get id from req
  let {couponId}= req.params
  //check coupon existence
  const couponExist=await Coupon.findById(couponId)
  if(!couponExist){
    return next(new AppError(messages.coupon.notFound,404))
  }
  //delete coupon
  const deletedCoupon = await Coupon.findByIdAndDelete(couponId)
  if(!deletedCoupon){
    return next(new AppError(messages.coupon.failToDelete,500))
  }
   //send response
   return res.status(200).json({message:messages.coupon.deleteSuccessfully,success:true, deletedCoupon})

}