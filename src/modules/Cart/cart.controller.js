
import { Cart, Product } from "../../../Database/index.js";
import { AppError } from "../../utils/appError.js";
import { messages } from "../../utils/constant/messages.js";


//add cart
export const addToCart = async (req, res, next) => {
  //get data from req
  let { productId, quantity } = req.body;
  let userId = req.authUser._id;
  //check product exist
  const productExist = await Product.findById(productId);
  if (!productExist) {
    return next(new AppError(messages.product.notFound, 404));
  }
  // check stock
  if (!productExist.inStock(quantity)) {
    return next(new AppError(messages.cart.outStock, 400));
  }
  // already exist
  let data = "";
  let productsInCart = await Cart.findOneAndUpdate(
    { user: userId, "products.productId": productId },
    { "products.$.quantity": quantity , "products.$.price": productExist.finalPrice },
    { new: true }
  );
  if (productsInCart) {
    productsInCart = await productsInCart.calculateCartPrices();
    data = productsInCart;
    console.log(data);
  }
  

  // not exist
  if (!productsInCart) {
    let addedProduct = await Cart.findOneAndUpdate(
      { user: userId },
      { $push: { products: { productId, quantity ,price :productExist.finalPrice } } },
      { new: true }
    );
    if (addedProduct) {
      addedProduct = await addedProduct.calculateCartPrices();
      data = addedProduct;
      console.log(data);
    }
  }
   


  //send response
  return res.status(201).json({
    message: messages.cart.createdSuccessfully,
    success: true,
    CartData: data,
  });
};

//get cart
export const getCart = async (req, res, next) => {
  //get data from req
  let userId = req.authUser._id;
  // find cart
  let carts = await Cart.findOne({ user: userId }).populate(
    "products.productId",
    "name price quantity"
  );
  // total
  const TotalCarts = await Cart.countDocuments();
  //send response
  return res.status(200).json({ success: true, TotalCarts, DataCarts: carts });
};

//delete cart
export const deleteCart = async (req, res, next) => {
  //get id from req
  let { productId } = req.params;
  let userId = req.authUser._id;
  //check product exist
  const productExitInCart = await Cart.findOne({
    user: userId,
    "products.productId": productId,
  });
  if (!productExitInCart) {
    return next(new AppError(messages.cart.notFound, 404));
  }
  // delete cart
  const deleteCart = await Cart.findOneAndUpdate(
    { user: userId },
    { $pull: { products: { productId } } },
    {new:true}
  );
  if(!deleteCart){
    return next(new AppError(messages.cart.failToDelete,500))
  }
  //send response
  return res.status(200).json({message:messages.cart.deleteSuccessfully,success:true,data:deleteCart})
};
//delete all cart
export const deleteAllCart = async (req, res, next) => {
  // Get user ID from the request
  let userId = req.authUser._id;
    //check product exist
    const productExitInCart = await Cart.findOne({
      user: userId,
      
    });
    if (!productExitInCart) {
      return next(new AppError(messages.cart.notFound, 404));
    }
  // Find the user's cart and delete all products
  const deleteCart = await Cart.findOneAndUpdate(
    { user: userId },
    { $set: { products: [] } }, 
    { new: true }
  );

  // If no cart is found or deletion fails
  if (!deleteCart) {
    return next(new AppError(messages.cart.failToDelete, 500));
  }

  // Send response
  return res.status(200).json({
    message: messages.cart.deleteAllSuccessfully,
    success: true,
    data: deleteCart
  });
};
