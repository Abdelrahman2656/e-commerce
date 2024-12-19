import { model, Schema } from "mongoose";

//schema
const brandSchema = new Schema({
    name :{
        type:String,
        trim:true,
        lowercase:true,
        unique:true,
        required:true
    },
    slug:{
        type:String,
        trim:true,
        lowercase:true,
        unique:true,
        required:true
    },
    image:{
        secure_url:{
            type:String,
            required:true
        },
        public_id:{
            type:String,
            required:true
        }
    },
    createdBy:{
        type:Schema.Types.ObjectId,
        ref:'User',
        required:true 
    }
},{timestamps:true})
//model
export const Brand = model('Brand',brandSchema)