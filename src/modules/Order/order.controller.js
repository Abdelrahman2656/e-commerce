import Stripe from "stripe";
import { Cart, Coupon, Order, Product } from "../../../Database/index.js";

import { AppError } from "../../utils/appError.js";
import {
  discountTypes,
  orderStatus,
  paymentStatus,
} from "../../utils/constant/enums.js";
import { messages } from "../../utils/constant/messages.js";
import { clearCart } from "./services/orderServices.js";
import { createInvoice } from "../../utils/pdf.js";
import { sendEmail } from "../../utils/email/email.js";

// export const createOrder = async (req, res, next) => {
//   // Get data from req
//   const { coupon, address, street, city, country, phone, payment } = req.body;
//   const userId = req.authUser._id;
//  // Check for an existing active order
//  let existingOrder = await Order.findOne({
//   user: userId,
//   status: orderStatus.PLACED, 
// });
//   // Check coupon
//   let couponExist = null;
//   let finalPrice = 0;
//   if (coupon) {
//     couponExist = await Coupon.findById(coupon);
//     if (!couponExist) {
//       return next(new AppError(messages.coupon.notFound, 404));
//     }
//     if (
//       couponExist?.fromDate > Date.now() ||
//       couponExist?.toDate < Date.now()
//     ) {
//       return next(new AppError(messages.coupon.InValid, 400));
//     }
//     if (
//       couponExist.assignedUsers?.length > 0 &&
//       !couponExist.assignedUsers.includes(userId)
//     ) {
//       return next(new AppError(messages.coupon.notAllowed, 403));
//     }
//   }

//   // Check cart
//   const cartExist = await Cart.findOne({ user: userId }).populate(
//     "products.productId",
//     "name price stock mainImage"
//   );
//   if (!cartExist || cartExist.products.length === 0) {
//     return next(new AppError(messages.cart.empty, 400));
//   }
//   const products = cartExist.products;

//   // Prepare order products and calculate price
//   let orderProducts = [];
//   let orderPrice = 0;

//   for (const product of products) {
//     // Check if product exists
//     const productExist = await Product.findById(product.productId);
//     if (!productExist) {
//       return next(new AppError(messages.product.notFound, 404));
//     }

//     // Check stock availability
//     if (!productExist.inStock(product.quantity)) {
//       return next(new AppError(`${productExist.name} is out of stock`, 400));
//     }

//     // Calculate price and prepare product details
//     let productPrice = product.quantity * productExist.finalPrice;
//     orderProducts.push({
//       productId: productExist._id,
//       name: productExist.name,
//       itemPrice: productExist.finalPrice,
//       quantity: product.quantity,
//       itemPrice: productExist.price,
//       finalPrice: productPrice,
//       mainImage: {
//         secure_url: productExist.mainImage.secure_url,
//         public_id: productExist.mainImage.public_id,
//       },
//     });

//     // Accumulate order price
//     orderPrice += productPrice;
//   }

//   // Calculate final price with coupon discount

//   if (couponExist) {
//     if (couponExist?.discountType == discountTypes.FIXED_AMOUNT) {
//       finalPrice = orderPrice - couponExist.discountAmount;
//     } else if (couponExist?.discountType == discountTypes.PERCENTAGE) {
//       finalPrice = orderPrice - (orderPrice * couponExist.discountAmount) / 100;
//     }
//     finalPrice = Math.max(0, finalPrice);
//   } else {
//     // If no coupon, finalPrice is the same as orderPrice
//     finalPrice = orderPrice;
//   }

//   // Prepare order data
//   const order = new Order({
//     user: userId,
//     products: orderProducts,
//     address,
//     phone,
//     coupon: {
//       couponId: couponExist?._id,
//       code: couponExist?.code,
//       discount: couponExist?.discountAmount,
//     },
//     status: orderStatus.PLACED,
//     payment,
//     street,
//     city,
//     country,
//     orderPrice,
//     finalPrice: finalPrice == 0 ? orderPrice : finalPrice,
//   });

//   // Save order to the database
//   const orderCreated = await order.save();
//   if (!orderCreated) {
//     return next(new AppError(messages.order.failToCreate, 500));
//   }
//   if (payment == paymentStatus.CASH) {
//     const result = await clearCart(userId);
//     if (result.errMessage) {
//       return next(new AppError(result.errMessage, 500));
//     }

//     // increment sold & decrement
//     let option = cartExist.products.map((product) => {
//       return {
//         updateOne: {
//           filter: { _id: product.productId },
//           update: { $inc: { stock: -product.quantity } },
//         },
//       };
//     });
//     await Product.bulkWrite(option);
//   }

//   if (payment == paymentStatus.VISA) {
//     const stripe = new Stripe(process.env.STRIPE_KEY);
//     const session = await stripe.checkout.sessions.create({
//       mode: "payment",
//       payment_method_types: ["card"],
//       success_url: process.env.SUCCESS_URL,
//       cancel_url: process.env.CANCEL_URL,
//       customer_email: req.authUser.email,
//       client_reference_id: req.params.id,
//       metadata: {
//         cartId: cartExist._id.toString(),
//         orderId: orderCreated._id.toString(),
//       },
//       line_items: orderCreated.products.map((product) => {
//         return {
//           price_data: {
//             currency: "EGP",
//             product_data: {
//               name: product.name,
//               // images
//               images: [product.mainImage.secure_url]
//             },
//             unit_amount: product.finalPrice * 100,
//           },
//           quantity: product.quantity,
//         };
//       }),
//     });
//     return res.status(200).json({
//       message: "order created successfully",
//       success: true,
//       url: session.url,
//     });
//   }

//   const invoice = {
//     shipping: {
//       name: req.authUser.name,
//       address: orderCreated.address,
//       city: orderCreated.city,
//       state: "CA",
//       country: orderCreated.country,
//       postal_code: 94111,
//     },
//     items: orderCreated.products,
//     subtotal: orderCreated.orderPrice,
//     paid: orderCreated.finalPrice,
//     invoice_nr: orderCreated._id,
//     date: orderCreated.createdAt,
//     coupon: orderCreated.coupon?.discount || 0,
//   };
//   createInvoice(invoice, "invoice.pdf");
//   //send pdf to email
//   await sendEmail({
//     to: req.authUser.email,
//     subject: "Order-PDF",
//     attachments: [
//       {
//         path: "invoice.pdf",
//         contentType: "application/pdf",
//       },
//     ],
//   });
//   // Send response
//   return res.status(201).json({
//     message: messages.order.createdSuccessfully,
//     success: true,
//     orderData: orderCreated,
//   });
// };
//get  all user order


export const createOrder = async (req, res, next) => {
  const { coupon, address, street, city, country, phone, payment } = req.body;
  const userId = req.authUser._id;

  try {
    // Check if there's an existing active order
    let orderExist = await Order.findOne({
      user: userId,
      status: orderStatus.PLACED,
    });

    // Validate coupon
    let couponExist = null;
    if (coupon) {
      couponExist = await Coupon.findById(coupon);
      if (!couponExist) {
        return next(new AppError(messages.coupon.notFound, 404));
      }
      if (
        couponExist?.fromDate > Date.now() ||
        couponExist?.toDate < Date.now()
      ) {
        return next(new AppError(messages.coupon.InValid, 400));
      }
      if (
        couponExist.assignedUsers?.length > 0 &&
        !couponExist.assignedUsers.includes(userId)
      ) {
        return next(new AppError(messages.coupon.notAllowed, 403));
      }
    }

    // Validate cart
    const cartExist = await Cart.findOne({ user: userId }).populate(
      "products.productId",
      "name price stock mainImage"
    );
    if (!cartExist || cartExist.products.length === 0) {
      return next(new AppError(messages.cart.empty, 400));
    }

    // Prepare order products and calculate price
    let orderProducts = [];
    let orderPrice = 0;

    for (const product of cartExist.products) {
      const productExist = await Product.findById(product.productId);
      if (!productExist) {
        return next(new AppError(messages.product.notFound, 404));
      }
      if (!productExist.inStock(product.quantity)) {
        return next(new AppError(`${productExist.name} is out of stock`, 400));
      }
      const productPrice = product.quantity * productExist.finalPrice;
      orderProducts.push({
        productId: productExist._id,
        name: productExist.name,
        itemPrice: productExist.finalPrice,
        quantity: product.quantity,
        finalPrice: productPrice,
        mainImage: {
          secure_url: productExist.mainImage.secure_url,
          public_id: productExist.mainImage.public_id,
        },
      });
      orderPrice += productPrice;
    }

    // Apply coupon discount
    let finalPrice = orderPrice;
    if (couponExist) {
      if (couponExist.discountType === discountTypes.FIXED_AMOUNT) {
        finalPrice -= couponExist.discountAmount;
      } else if (couponExist.discountType === discountTypes.PERCENTAGE) {
        finalPrice -= (orderPrice * couponExist.discountAmount) / 100;
      }
      finalPrice = Math.max(0, finalPrice);
    }

    // Update or create order
    if (orderExist) {
      orderExist.products.push(...orderProducts);
      orderExist.orderPrice += orderPrice;
      orderExist.finalPrice += finalPrice;
      orderExist.coupon = couponExist
        ? {
            couponId: couponExist._id,
            code: couponExist.code,
            discount: couponExist.discountAmount,
          }
        : orderExist.coupon;
      await orderExist.save();
    } else {
      orderExist = new Order({
        user: userId,
        products: orderProducts,
        address,
        phone,
        coupon: couponExist
          ? {
              couponId: couponExist._id,
              code: couponExist.code,
              discount: couponExist.discountAmount,
            }
          : null,
        status: orderStatus.PLACED,
        payment,
        street,
        city,
        country,
        orderPrice,
        finalPrice,
      });
      await orderExist.save();
    }

    // Process payment
    if (payment === paymentStatus.CASH) {
      const result = await clearCart(userId);
      if (result.errMessage) {
        return next(new AppError(result.errMessage, 500));
      }

      const stockUpdates = cartExist.products.map((product) => ({
        updateOne: {
          filter: { _id: product.productId },
          update: { $inc: { stock: -product.quantity } },
        },
      }));
      await Product.bulkWrite(stockUpdates);
    } else if (payment === paymentStatus.VISA) {
      const stripe = new Stripe(process.env.STRIPE_KEY);
      const session = await stripe.checkout.sessions.create({
        mode: "payment",
        payment_method_types: ["card"],
        success_url: process.env.SUCCESS_URL,
        cancel_url: process.env.CANCEL_URL,
        customer_email: req.authUser.email,
        client_reference_id: orderExist._id.toString(),
        metadata: {
          cartId: cartExist._id.toString(),
          orderId: orderExist._id.toString(),
        },
        line_items: orderProducts.map((product) => ({
          price_data: {
            currency: "EGP",
            product_data: {
              name: product.name,
              images: [product.mainImage.secure_url],
            },
            unit_amount: product.finalPrice * 100,
          },
          quantity: product.quantity,
        })),
      });

      return res.status(200).json({
        message: "Order created successfully",
        success: true,
        url: session.url,
      });
    }

    // Generate invoice
    const invoice = {
      shipping: {
        name: req.authUser.name,
        address,
        city,
        state: "CA",
        country,
        postal_code: 94111,
      },
      items: orderProducts,
      subtotal: orderPrice,
      paid: finalPrice,
      invoice_nr: orderExist._id,
      date: new Date(),
      coupon: couponExist?.discountAmount || 0,
    };
    createInvoice(invoice, "invoice.pdf");

    // Email invoice
    await sendEmail({
      to: req.authUser.email,
      subject: "Order Invoice",
      attachments: [
        {
          path: "invoice.pdf",
          contentType: "application/pdf",
        },
      ],
    });

    return res.status(201).json({
      message: messages.order.createdSuccessfully,
      success: true,
      orderData: orderExist,
    });
  } catch (error) {
    next(error);
  }
};


export const getAllOrders = async (req, res, next) => {
  const orders = await Order.find({});
  if (!orders) return next(new AppError(messages.order.notFound));

  return res.status(200).json({ success: true, data: orders });
};

export const myOrders = async (req, res, next) => {
  let userId = req.authUser._id;
  const orders = await Order.findOne({ user: userId });
  if (!orders) return next(new AppError(messages.order.notFound, 404));

  return res.status(200).json({ success: true, data: orders });
};
