import slugify from "slugify";

import { Category } from "../../../Database/index.js";
import { AppError } from "../../utils/appError.js";
import { messages } from "../../utils/constant/messages.js";
import cloudinary from "../../utils/cloud.js";

export const addCategory = async (req, res, next) => {
  //get data from req
  let { name } = req.body;
  name = name.toLowerCase();
  //checkExistence 
  const checkExistence = await Category.findOne({ name });
  if (checkExistence) {
    return next(new AppError(messages.category.alreadyExist, 409));
  }
  //prepare data
  const slug = slugify(name);
  //upload 1image
  const {secure_url,public_id}= await cloudinary.uploader.upload(req.file?.path , {
    folder:"E-Commerce/Category"
  })
  const category = new Category({
    name,
    slug,
    image:  {secure_url,public_id} ,
     createdBy: req.authUser._id
  });
  const createdCategory = await category.save();
  if (!createdCategory) {
    req.failImage={secure_url,public_id}
    return next(new AppError(messages.category.failToCreate, 500));
  }
  // sent response
  return res
    .status(201)
    .json({
      message: messages.category.createdSuccessfully,
      success: true,
      data: createdCategory,
    });
};
//get all category
export const getAllCategory = async(req,res,next)=>{
    let categories = await Category.find().populate([{path:'subCategories',populate:[{path:'category'}]}])
     // Count total number of categories
     const totalCategories = await Category.countDocuments();
    //sent res
    return res.status(200).json({success:true,AllCategory:categories,totalCategories})
}

// get specific category by id 
export const getCategoryById =async (req,res,next)=>{
  //get id by params
  let {id}=req.params 
  let category = await Category.findById(id)
  if(!category){
    return next(AppError(messages.category.notFound,404))
  }
  //send response 
  return res.status(200).json({success:true , categoryData:category})
}
//update category 
export const updateCategory = async(req,res,next)=>{
  // get data from req
  let {categoryId}=req.params
  let {name}=req.body
  name=name?.toLowerCase()
  //check category id existence 
  const categoryExistence = await Category.findById(categoryId)
  if(!categoryExistence){
    return next( new AppError(messages.category.notFound,404))
  }
  //check name 

  const nameExistence = await Category.findOne({ name, _id: { $ne:  categoryId  } });

  if(nameExistence){
    return next(new AppError(messages.category.alreadyExist,409))
  }
  if(name){
    let slug=slugify(name)
    categoryExistence.name=name
    categoryExistence.slug=slug
  }
  //upload new image 
  // if(req.file){
  //   const{secure_url,public_id}=await cloudinary.uploader.upload(req.file?.path,{
  //     public_id : categoryExistence.image.public_id
  //   })
  //   categoryExistence.image={secure_url,public_id}
  //   categoryExistence.failImage={secure_url,public_id}
  // }
  let uploadedImage;
  if (req.file) {
    // Upload new image with the same public ID to overwrite
    uploadedImage = await cloudinary.uploader.upload(req.file?.path, {
      public_id: categoryExistence.image.public_id,
      overwrite: true,
    });

    categoryExistence.image = {
      secure_url: uploadedImage.secure_url,
      public_id: uploadedImage.public_id,
    };
    req.failImage ={
      secure_url: uploadedImage.secure_url,
      public_id: uploadedImage.public_id,
    };
  }
  //send to db
  const updateCategoryCreated = await categoryExistence.save()
  if (!updateCategoryCreated) {
    // Cleanup uploaded image if DB save fails
    if (uploadedImage) {
      await cloudinary.uploader.destroy(uploadedImage.public_id);
    }
    return next(new AppError(messages.category.failToUpdate, 500));
  }
  //send response
  return res.status(200).json({message:messages.category.updateSuccessfully,success:true ,updateCategoryCreated:updateCategoryCreated})
}
//delete category 
export const deleteCategory = async(req,res,next)=>{
  let {categoryId}= req.params
  //check category id existence 
  const categoryExistence = await Category.findById(categoryId)
  if(!categoryExistence){
    return next(new AppError(messages.category.notFound,404))
  }
  //delete image 
  if (categoryExistence.image?.public_id) {
    try {
      await cloudinary.uploader.destroy(categoryExistence.image.public_id);
    } catch (cloudinaryError) {
      return next(new AppError('Failed to delete image from Cloudinary', 500));
    }
  }
  //send to db

const deleteCategory = await Category.findByIdAndDelete(categoryId);
  if(!deleteCategory){
    return next(new AppError(messages.category.failToDelete,500))
  }
  //send response
  return res.status(200).json({message:messages.category.deleteSuccessfully,success:true, deleteCategory})

}