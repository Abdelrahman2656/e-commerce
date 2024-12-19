import joi from "joi"
import { AppError } from "../utils/appError.js"
import { discountTypes, paymentStatus, statues } from "../utils/constant/enums.js"
const parseArray = (value, helper) => {
    let data = JSON.parse(value)
    let schema = joi.array().items(joi.string())
    const { error } = schema.validate(data)
    if (error) {
        return helper(error.details)
    }
    return true
}
// const validateLeapYearAndDays = (value, helpers) => {
//     const date = new Date(value);
  
//     if (isNaN(date)) {
//       return helpers.message('Invalid date format.');
//     }
  
//     const year = date.getFullYear();
//     const month = date.getMonth();
//     const day = date.getDate();
  
//     // Leap year logic directly inside the function
//     const isLeapYear = (year) => {
//       return (year % 4 === 0 && year % 100 !== 0) || (year % 400 === 0);
//     };
  
//     if (month === 1) { // February is month 1 (0-indexed)
//       if (day > 28) {
//         if (day === 29 && !isLeapYear(year)) {
//           return helpers.message(`The year ${year} does not have a February 29th.`);
//         }
//         if (day > 29) {
//           return helpers.message(`February ${year} cannot have a ${day}th.`);
//         }
//       }
//     }
  
//     return value; // Valid date
//   };
 
export const generalFields = {
    name: joi.string(),
    description: joi.string().max(2000),
    objectId: joi.string().hex().length(24),
    stock: joi.number().positive(),
    price: joi.number().positive(),
    discount: joi.number(),
    views: joi.number().integer().min(0).default(0),
    colors: joi.custom(parseArray),
    sizes: joi.custom(parseArray),
    rate: joi.number().min(1).max(5),
    discountTypes: joi.string().valid(...Object.values(discountTypes)),
    subImages: joi.array().items(joi.object().required()).optional() ,
    email:joi.string().email(),
    password: joi.string().pattern(new RegExp(/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/)),
    cPassword: joi.string().valid(joi.ref('password')),
    phone:joi.string().pattern(new RegExp(/^(00201|\+201|01)[0-2,5]{1}[0-9]{8}$/)),
    DOB:joi.string(),
    status:joi.string().valid(...Object.values(statues)),
    comment: joi.string().max(200),
    code :joi.string().max(6),
    discountAmount:joi.number().positive(),
    fromDate: joi.date()
    .greater(Date.now() - 24 * 60 * 60 * 1000)
    ,
  
  toDate: joi.date()
    .greater(joi.ref('fromDate'))
    ,
    quantity:joi.number().positive().integer().min(1),
    oldPassword:joi.string(),
    otp:joi.number().positive(),
    payment: joi.string().valid(...Object.values(paymentStatus)),
    street:joi.string(),
    country:joi.string(),
    city:joi.string(),

  
}

export const isValid = (schema)=>{
    return (req,res,next)=>{
        let data = {...req.body,...req.params,...req.query}
        let{error}= schema.validate(data,{abortEarly:false})
        if(error){
            let errArr = [];
            error.details.forEach((err) => {
                errArr.push(err.message)
            });
            console.log(errArr);
            
            return next(new AppError(errArr,400))
        }
        next()
    }

}