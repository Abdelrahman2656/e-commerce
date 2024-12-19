import { Cart } from "../../../../Database/index.js";

export const clearCart = async (userId) => {
    const updatedCart = await Cart.findOneAndUpdate(
      { user: userId },
      { products: [] }
    ); // {},null
    if (!updatedCart) {
      return { errMessage: "fail to update cart" };
    }
    return true;
  };
