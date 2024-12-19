
import { model, Schema } from "mongoose";

//schema
const categorySchema = new Schema({
  name: {
    type: String,
    trim: false,
    required: true,
    unique: true,
    lowercase: true,
  },
  slug: {
    type: String,
    trim: false,
    required: true,
    unique: true,
    lowercase: true,
  },
  image: {
    secure_url:{type:String , required:true},
    public_id:{type:String , required:true}
  },
  createdBy:{
    type:Schema.Types.ObjectId,
    ref:'User',
    required:true 
  }
},{
    timestamps:true,
    toJSON:{virtuals:true}
});

categorySchema.virtual('subCategories',{
  ref:"Subcategory",
  localField:"_id",
  foreignField:"category"
})
//model
export const Category =model('Category', categorySchema)