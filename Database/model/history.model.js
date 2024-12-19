import { model, Schema } from "mongoose";

const userProductViewSchema = new Schema(
    {
      userId: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
      },
      productId: {
        type: Schema.Types.ObjectId,
        ref: "Product",
        required: true,
      },
      viewedAt: {
        type: Date,
        default: Date.now,
      },
    },
    {
      timestamps: true,
    }
  );
  
  export const UserProductView = model("UserProductView", userProductViewSchema);