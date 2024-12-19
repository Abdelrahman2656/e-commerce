import slugify from "slugify";
import { Brand } from "../../../Database/index.js";
import { AppError } from "../../utils/appError.js";
import cloudinary from "../../utils/cloud.js";
import { messages } from "../../utils/constant/messages.js";

export const addBrand = async (req, res, next) => {
  //get data from req
  let { name } = req.body;
  name = name.toLowerCase();

  // check existence
  const brandExistence = await Brand.findOne({ name });
  if (brandExistence) {
    return next(new AppError(messages.brand.alreadyExist, 409));
  }
  //upload image
  const slug = slugify(name)
  const { secure_url, public_id } = await cloudinary.uploader
    .upload(req.file.path, {
      folder: "E-Commerce/Brand",
      
    })
    .catch((error) => {
      console.log(error);
    });
  //prepare data

  const brand = new Brand({
    name,
    slug,
    image:{secure_url,public_id},
    createdBy: req.authUser._id
  })
  //send to db
  const createBrand = await brand.save()
  if(!createBrand){
    req.failImage={secure_url,public_id}
    return next(new AppError(messages.brand.failToCreate,500))
  }
  //send response
  res.status(201).json({message:messages.brand.createdSuccessfully,success:true,BrandData:createBrand})
};
//get all Brand
export const getAllBrand = async(req,res,next)=>{
  let brand = await Brand.find()
   // Count total number of categories
   const TotalBrand = await Brand.countDocuments();
  //sent res
  return res.status(200).json({success:true,AllBrand:brand,TotalBrand})
}

// get specific Brand by id 
export const getBrandById =async (req,res,next)=>{
//get id by params
let {id}=req.params 
let brand = await Brand.findById(id)
if(!brand){
  return next(AppError(messages.brand.notFound,404))
}
//send response 
return res.status(200).json({success:true , brandData:brand})
}
//update brand


export const updateBrand = async (req, res, next) => {
  try {
    // Get data from req
    let { name } = req.body;
    let { brandId } = req.params;

    name = name?.toLowerCase();

    // Check existence of brand ID
    const brandIdExistence = await Brand.findById(brandId);
    if (!brandIdExistence) {
      return next(new AppError(messages.brand.notFound, 404));
    }

    // Check for name conflict
    const nameExist = await Brand.findOne({ name, _id: { $ne: brandId } });
    if (nameExist) {
      return next(new AppError(messages.brand.alreadyExist, 409));
    }

    // Update name and slug
    if (name) {
      const slug = slugify(name);
      brandIdExistence.name = name;
      brandIdExistence.slug = slug;
    }

    let uploadedImage;
    if (req.file) {
      try {
        
        uploadedImage = await cloudinary.uploader.upload(req.file?.path, {
          public_id: brandIdExistence.image.public_id,
          overwrite: true,
        });

        brandIdExistence.image = {
          secure_url: uploadedImage.secure_url,
          public_id: uploadedImage.public_id,
        };
        req.failImage  = {
                secure_url: uploadedImage.secure_url,
                public_id: uploadedImage.public_id,
              };
      } catch (uploadError) {
        return next(new AppError("Image upload failed", 500));
      }
    }

    // Save to DB
    const updatedBrand = await brandIdExistence.save();
    if (!updatedBrand) {
      //we can do that 
      // req.failImage ={
                //secure_url: uploadedImage.secure_url,
           //     public_id: uploadedImage.public_id,
           //   }
      // Cleanup uploaded image if DB save fails
      if (uploadedImage) {
        await cloudinary.uploader.destroy(uploadedImage.public_id);
      }
      return next(new AppError(messages.brand.failToUpdate, 500));
    }

    // Send response
    return res.status(200).json({
      message: messages.brand.updateSuccessfully,
      success: true,
      updateBrand: updatedBrand,
    });
  } catch (error) {
    next(error);
  }
};

//delete Brand
export const deleteBrand = async(req,res,next)=>{
  let {brandId}= req.params
  //check category id existence 
  const brandExistence = await Brand.findById(brandId)
  if(!brandExistence){
    return next(new AppError(messages.brand.notFound,404))
  }
  //delete image 
  if (brandExistence.image?.public_id) {
    try {
      await cloudinary.uploader.destroy(brandExistence.image.public_id);
    } catch (cloudinaryError) {
      return next(new AppError('Failed to delete image from Cloudinary', 500));
    }
  }
  //send to db

const deleteBrand = await Brand.findByIdAndDelete(brandId);
  if(!deleteBrand){
    return next(new AppError(messages.brand.failToDelete,500))
  }
  //send response
  return res.status(200).json({message:messages.brand.deleteSuccessfully,success:true, deleteBrand})

}