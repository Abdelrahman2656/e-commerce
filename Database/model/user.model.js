import { model, Schema } from "mongoose"
import { roles, statues } from "../../src/utils/constant/enums.js"

// schema 
const  userSchema = new Schema({
    name:{
        type : String,
        trim: true,
        required:true
    },
    email:{
        type:String,
        unique:true,
        required:true,
        lowercase : true,
        trim:true
    },
    password:{
        type:String,
        required:true
    },
    phone:{
        type : String , 
        trim : true , 
        unique:true ,
        required:true
    },
    role:{
        type:String,
        enum:Object.values(roles),
        default:roles.USER
    },
    status :{
        type:String,
        enum:Object.values(statues),
        default:statues.PENDING
    },
    image:{
        secure_url :{
            type:String ,required:false
        },
        public_id : {
            type:String ,required:false
        },
    },
    DOB: {
        type: String,
        default: () => new Date().toISOString() // ISO format string of the current date and time
    },
    wishlist:[{
        type:Schema.Types.ObjectId,
        ref:"Product"
    }],
    otp:Number,
    expiredDateOtp:Date
    
},{timestamps:true})

//model
export const User = model('User', userSchema)