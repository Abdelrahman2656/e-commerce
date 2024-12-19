import _ from "lodash";
import slugify from "slugify";
import { Category, Subcategory } from "../../../Database/index.js";
import { AppError } from "../../utils/appError.js";
import cloudinary from "../../utils/cloud.js";
import { messages } from "../../utils/constant/messages.js";
//add subcategory
export const addSubCategory = async (req, res, next) => {
  //get data from req
  let { name, category } = req.body;

  name = name.toLowerCase();
  //checkExistence:
  const categoryExistence = await Category.findById(category);
  if (!categoryExistence) {
    return next(new AppError(messages.category.notFound, 404));
  }
  const checkSubCategoryExistence = await Subcategory.findOne({ name });
  if (checkSubCategoryExistence) {
    return new next(new AppError(messages.subcategory.alreadyExist, 409));
  }
  //upload image
  const { secure_url, public_id } = await cloudinary.uploader.upload(
    req.file?.path,
    {
      folder: "E-Commerce/SubCategory",
    }
  );
  //prepare data:
  let slug = slugify(name, { replacement: "-" });
  const subCategory = new Subcategory({
    name,
    slug,
    image: { secure_url, public_id },
    category,
    createdBy: req.authUser._id,
  });
  const createdSubCategory = await subCategory.save();
  if (!createdSubCategory) {
    req.failImage = { secure_url, public_id };
    return next(new AppError(messages.subcategory.failToCreate, 500));
  }
  //send response
  return res
    .status(201)
    .json({
      message: messages.subcategory.createdSuccessfully,
      success: true,
      subCategoryData: createdSubCategory,
    });
};
//get subcategory
export const getAllSubcategory = async (req, res, next) => {
  let subcategories = await Subcategory.find();
  //count all subcategory
  const totalSubCategories = await Subcategory.countDocuments();
  //sent response
  return res
    .status(200)
    .json({
      success: true,
      subCategoryData: subcategories,
      totalSubCategories,
    });
};
//get subcategory by id
export const getAllSubcategoryById = async (req, res, next) => {
  //get data from req
  let { subcategoryId } = req.params;

  let subcategory = await Subcategory.findById(subcategoryId);
  if (!subcategory) {
    return next(new AppError(messages.subcategory.notFound, 404));
  }
  //send response
  return res.status(200).json({ success: true, subcategoryData: subcategory });
};
//update subcategory
export const updateSubCategory = async (req, res, next) => {
  // Get data from request
  let { subCategoryId } = req.params;
  let { name } = req.body;

  name = name?.toLowerCase();

  // Check subcategory existence
  const subCategoryExistence = await Subcategory.findById(subCategoryId);
  if (!subCategoryExistence) {
    return next(new AppError(messages.subcategory.notFound, 404));
  }

  // Check if name exists in another subcategory
  const nameExistence = await Subcategory.findOne({
    name,
    _id: { $ne: subCategoryId },
  });
  if (nameExistence) {
    return next(new AppError(messages.subcategory.alreadyExist, 409));
  }

  const updatedFields = {};
  if (name && name !== subCategoryExistence.name) {
    updatedFields.name = name;
    updatedFields.slug = slugify(name);
  }

  // If no other updates and no file provided, return early
  if (_.isEmpty(updatedFields) && !req.file) {
    return res.status(200).json({
      message: "No changes detected.",
      success: true,
      subCategoryData: subCategoryExistence,
    });
  }

  // Upload new image
  if (req.file) {
    const { secure_url, public_id } = await cloudinary.uploader.upload(
      req.file?.path,
      {
        public_id: subCategoryExistence.image.public_id,
      }
    );
    updatedFields.image = { secure_url, public_id };
    req.failImage ={ secure_url, public_id }
  }

  // Apply the updates
  Object.assign(subCategoryExistence, updatedFields);

  // Save to database
  const updatedSubCategory = await subCategoryExistence.save();
  if (!updatedSubCategory) {
    req.failImage
    return next(new AppError(messages.subcategory.failToUpdate, 500));
  }

  // Send response
  return res.status(200).json({
    message: messages.subcategory.updateSuccessfully,
    success: true,
    subCategoryData: updatedSubCategory,
  });
};

//delete category
export const deleteSubCategory = async (req, res, next) => {
  let { subCategoryId } = req.params;
  //check category id existence
  const subCategoryExistence = await Subcategory.findById(subCategoryId);
  if (!subCategoryExistence) {
    return next(new AppError(messages.subcategory.notFound, 404));
  }
  //delete image
  if (subCategoryExistence.image?.public_id) {
    try {
      await cloudinary.uploader.destroy(subCategoryExistence.image.public_id);
    } catch (cloudinaryError) {
      return next(new AppError("Failed to delete image from Cloudinary", 500));
    }
  }
  //send to db

  const deleteSubCategory = await Subcategory.findByIdAndDelete(subCategoryId);
  if (!deleteSubCategory) {
    return next(new AppError(messages.subcategory.failToDelete, 500));
  }
  //send response
  return res
    .status(200)
    .json({
      message: messages.subcategory.deleteSuccessfully,
      success: true,
      deleteSubCategory,
    });
};
