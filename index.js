process.on('unhandledRejection',(err)=>{
    console.log('error',err);
    
})
import cors from 'cors';
import dotenv from "dotenv";
import express from "express";
// import passport from "passport";
import path from "path";
import Stripe from "stripe";
import { dbconnection } from "./Database/dbconnection.js";
import { initApp } from "./src/initApp.js";
import { deletePendingUser } from "./src/utils/schedule.js";

// import session from "express-session";
// import { fileURLToPath } from 'url';
// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);
const app = express();
const port =3000;
console.log(port);

dotenv.config({ path: path.resolve("./config/.env") });
// console.log(process.env.DB_URL);
app.use(cors('*'))
dbconnection();
// app.get("/", (req, res) => {
//     res.sendFile(path.join(__dirname, 'index.html'));
// });
// app.use(session({
//     secret: 'keyboard cat',
//     resave: false,
//     saveUninitialized: true,
//     cookie: { secure: false }
//   }))
//   app.use(passport.initialize())
//   app.use(passport.session())
// app.get(
//   "/auth/google",
//   passport.authenticate("google", { scope: ["profile"] })
// );

// app.get(
//   "/auth/google/callback",
// //   passport.authenticate("google", { successFlash:"/auth/protected",failureRedirect: "/login" }),
//   passport.authenticate("google", { successRedirect: "/auth/protected", failureRedirect: "/login" }),

//   function (req, res) {
//     // Successful authentication, redirect home.
//     res.redirect("/");
//   }
// );
// app.get('/auth/protected',(req,res)=>{
//     let name = req.user.displayName
//     res.send(`Hello ${name}`)
// })
// app.use('/auth/logout',(req,res)=>{
//     req.session.destroy()
//     res.send('see you soon ')
// })
app.post('/api/v1/webhook', express.raw({ type: 'application/json' }), async (req, res) => {

    // console.log("test");
  
    const sig = req.headers['stripe-signature'].toString();
    const stripe = new Stripe(process.env.STRIPE_KEY)
    let event;
  
    event = stripe.webhooks.constructEvent(req.body, sig, "whsec_6Suv2cPBZYLsO8LA6BGCIz7gvKVg2o9x");
  
    if (event.type == 'checkout.session.completed') {
  
      console.log(event);
  
      const object = event.data.object;
      // logic
      // cart
      console.log(object.client_reference_id);
  
      const order = await Order.findById(object.metadata.orderID)
      for (const product of order.products) {
        await Product.findByIdAndUpdate(product.productId, { $inc: { stock: -product.quantity }  })
      }
      await Cart.findOneAndUpdate({ user: order.user }, { products: [] })
    }
    // Return a 200 res to acknowledge receipt of the event
    res.send();
  });

//cron job
deletePendingUser()

initApp(app, express);
process.on('unhandledRejection',(err)=>{
    console.log('error',err);
    
})
app.get("/", (req, res) => res.send("Hello World! gg"));
app.listen(port, () => console.log(`Example app listening on port ${port}!`));
