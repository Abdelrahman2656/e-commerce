import joi from "joi";
import { generalFields } from "../../middleware/validation.js";


export const addCouponVal = joi.object({
  code: generalFields.code.required(),
  discountAmount: generalFields.discountAmount.required(),
  discountType: generalFields.discountTypes.required(),
  fromDate: generalFields.fromDate,
  toDate: generalFields.toDate,
});

export const updateCouponVal = joi.object({
  couponId: generalFields.objectId.required(),
  code: generalFields.code,
  discountAmount: generalFields.discountAmount,
  discountType: generalFields.discountTypes,
  fromDate: generalFields.fromDate,
  toDate: generalFields.toDate,
});

export const deleteCouponVal = joi.object({
    couponId: generalFields.objectId.required(),
})
