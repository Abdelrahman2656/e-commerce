
import { model, Schema } from "mongoose";

//schema
const subCategorySchema = new Schema({
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
    secure_url:{type:String ,required:true},
    public_id:{type:String ,required:true}
  },
  createdBy:{
    type:Schema.Types.ObjectId,
    ref:'User',
    required:true 
  },
  category:{
    type:Schema.Types.ObjectId,
    ref : 'Category',
    required:true
  }
},{
    timestamps:true
});
//model
export const Subcategory =model('Subcategory', subCategorySchema)