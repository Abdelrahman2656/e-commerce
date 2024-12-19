import { model, Schema } from "mongoose";
import { orderStatus, paymentStatus } from "../../src/utils/constant/enums.js";

//schema
const orderSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    products: [
      {
        productId: {
          type: Schema.Types.ObjectId,
          ref: "Product",
          required: true,
        },
        name: String,
        itemPrice: Number,
        finalPrice: Number,
        quantity: Number,
        _id:false,
        mainImage: {
          secure_url: {
            type: String,
            required: true,
          },
          public_id: {
            type: String,
            required: true,
          },
        },
      },
    ],
    address: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      required: true,
    },
    street:String,
    city:String,
    country:String,
    coupon: {
      couponId: {
        type: Schema.Types.ObjectId,
        ref: "Coupon",
       
      },
      code:String,
      discount:Number
    },
    status: {
      enum: Object.values(orderStatus),
      default: orderStatus.PLACED,
      type: String,
    },
    payment: {
      type: String,
      enum: Object.values(paymentStatus),
      default: paymentStatus.CASH,
    },
    finalPrice: Number,
    orderPrice: Number,
  },
  { timestamps: true }
);
//model
export const Order = model("Order", orderSchema);
