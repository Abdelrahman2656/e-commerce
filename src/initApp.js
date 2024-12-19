// import passport from "passport";
import { globalErrorHandling } from "./middleware/asyncHandler.js"
import { authRouter, brandRouter, cartRouter, categoryRouter, couponRouter, orderRouter, productRouter, reviewRouter, subCategoryRouter, userRouter, wishlistRouter } from "./modules/index.js"
// import { Session } from "express-session";


export const initApp =(app , express)=>{
    //parse
    app.use(express.json())
    

    app.get('/',(req,res)=>{
        console.log("server is running");
        
    })
    // Configure session
    // app.use(
    //   Session({
    //     secret: process.env.SESSION_SECRET || "keyboard cat",
    //     resave: false,
    //     saveUninitialized: false,
    //     cookie: { secure: false }, // Use `secure: true` in production
    //   })
    // );
    
    // // Initialize Passport.js
    // app.use(passport.initialize());
    // app.use(passport.session());
    //routing
    app.use('/api/v1',categoryRouter)
    app.use('/api/v1', subCategoryRouter)
    app.use('/api/v1',brandRouter)
    app.use('/api/v1',productRouter)
    app.use('/api/v1',userRouter)
    app.use('/api/v1',reviewRouter)
    app.use('/api/v1',couponRouter)
    app.use('/wishlist',wishlistRouter)
    app.use('/api/v1',cartRouter)
    app.use('/v1',authRouter)
    app.use('/api/v1',orderRouter)
    //globalErrorHandling
    app.use(globalErrorHandling)
}