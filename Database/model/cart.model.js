import { model, Schema } from "mongoose";
import { Product } from "./product.model.js";

//schema
const cartSchema = new Schema({
    user:{
        type:Schema.Types.ObjectId,
        ref:'User',
        required:true
    },
    products:[{
        productId:{type:Schema.Types.ObjectId , ref:'Product' },
        _id:false,
        quantity:Number,
        price:Number
    }],
    totalCartPrice:Number,
    discount:Number,
    totalCartPriceAfterDiscount:Number
    
 },{timestamps:true, versionKey:false})
//model
cartSchema.methods.calculateCartPrices = async function () {
    
    const totalCartPrice = await this.products.reduce(async (accPromise, product) => {
     
      const productDetails = await Product.findById(product.productId);
      const finalPrice = productDetails.finalPrice;  // Get the final price after discount
  
      const acc = await accPromise;
      return acc + product.quantity * finalPrice;
    }, Promise.resolve(0));  
  
    
    this.totalCartPrice = totalCartPrice;
  
   
    if (this.discount) {
      this.totalCartPriceAfterDiscount =
        totalCartPrice - (totalCartPrice * this.discount) / 100;
    } else {
      this.totalCartPriceAfterDiscount = totalCartPrice;
    }
  
    return this;
  };
  ;
  
export const Cart = model('Cart',cartSchema)