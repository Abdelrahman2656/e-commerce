import { model, Schema } from "mongoose";
import { discountTypes } from "../../src/utils/constant/enums.js";

//schema
const productSchema = new Schema(
  {
    name: {
      type: String,
      trim: true,
      required: true,
    },
    slug: {
      type: String,
      trim: true,
      required: true,
    },
    description: {
      type: String,
      trim: true,
      required: true,
    },
    stock: {
      type: Number,
      min: 0,
      default: 1,
    },
    price: {
      type: Number,
      min: 0,
      required: true,
    },
    discount: {
      type: Number,
      min: 0,
      max: 100,
    },
    discountTypes: {
      type: String,
      enum: Object.values(discountTypes),
      default: discountTypes.FIXED_AMOUNT,
    },
    views: {
      type: Number,
      default: 0,
    },
    colors: [String],
    sizes: [String],
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
    subImages: [
      {
        secure_url: { type: String, required: true },
        public_id: { type: String, required: true },
      },
    ],

    rate: {
      type: Number,
      default: 5,
      max: 5,
      min: 1,
    },
    //id
    category: {
      type: Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },
    subcategory: {
      type: Schema.Types.ObjectId,
      ref: "Subcategory",
      required: true,
    },
    brand: {
      type: Schema.Types.ObjectId,
      ref: "Brand",
      required: true,
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    updatedBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    viewedBy: [{ type: Schema.Types.ObjectId, ref: "User" }],
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
    },
    toObject: { virtuals: true },
  }
);
productSchema.virtual("finalPrice").get(function () {
  if (this.discountType == discountTypes.FIXED_AMOUNT) {
    return this.price - this.discount;
  } else {
    return this.price - (this.price * (this.discount || 0)) / 100;
  }
});
//instock
productSchema.methods.inStock = function (quantity) {
  return this.stock < quantity ? false : true;
};
//model
export const Product = model("Product", productSchema);
