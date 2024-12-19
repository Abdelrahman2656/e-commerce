import slugify from "slugify";
import { Brand, Product, Subcategory, UserProductView } from "../../../Database/index.js";
import { AppError } from "../../utils/appError.js";
import cloudinary, { deleteCloudImage } from "../../utils/cloud.js";
import { messages } from "../../utils/constant/messages.js";
import { ApiFeature } from "../../utils/apiFeature.js";

//add product
export const addProduct = async (req, res, next) => {
  //get data from req
  let {
    name,
    description,
    category,
    subcategory,
    brand,
    price,
    discount,
    discountTypes,
    colors,
    sizes,
    stock,
  } = req.body;

  //check exist brand subcategory
  const brandExist = await Brand.findById(brand);
  if (!brandExist) {
    return next(new AppError(messages.brand.notFound, 404));
  }
  const subcategoryExist = await Subcategory.findById(subcategory);
  if (!subcategoryExist) {
    return next(new AppError(messages.subcategory.notFound, 404));
  }
 //check if percentage 
 if(discountTypes == discountTypes.PERCENTAGE && discount > 100){
  return next(new AppError(messages.product.lessThan,400))
}
  //uploadImages
  let failImages = [];
  //req.files >> {mainImage:[{}],subImages:[{},{},{},{}]}
  //1- mainImage

  const { secure_url, public_id } = await cloudinary.uploader.upload(
    req.files.mainImage[0].path,
    {
      folder: "E-Commerce/Product/mainImage",
    }
  );

 failImages.push(public_id);
  let mainImage = { secure_url, public_id };

  //SubImages
//   let subImages = [];
//   for (const file of req.files.subImages) {
//     const { secure_url, public_id } = await cloudinary.uploader.upload( file.path,{folder: "E-Commerce/Product/subImages", });
//     console.log(subImages);
//     console.log({ secure_url, public_id });
    
//     subImages.push({ secure_url, public_id });
//     failImage.push(public_id);
//   }
let subImages = []

for (const file of req.files.subImages) {
    const { secure_url, public_id } = await cloudinary.uploader.upload(file.path, { folder: "E-Commerce/Product/sub-images" })
      subImages.push({ secure_url, public_id })
      failImages.push(public_id)
}

  console.log({ secure_url, public_id });
  console.log(subImages);
  //prepare data
  const slug = slugify(name);
  const product = new Product({
    name,
    slug,
    description,
    category,
    subcategory,
    brand,
    price,
    discount,
    discountTypes,
    colors: JSON.parse(colors),
    sizes: JSON.parse(sizes),
    stock,
    views: 0,
    mainImage,
    subImages,
    createdBy :req.authUser._id,
    updatedBy :req.authUser._id
  });
  //sent data to db
  const productCreated = await product.save();

  if (!productCreated) {
    req.failImages = failImages;
    return next(new AppError(messages.product.failToCreate, 500));
  }
  console.log(productCreated);

  //send response
  return res
    .status(200)
    .json({
      message: messages.product.createdSuccessfully,
      success: true,
      ProductData: productCreated,
    });
};
//get product 
export const getAllProduct =async(req,res,next) =>{
  const apiFeature = new ApiFeature(Product.find() , req.query).pagination().sort().select().filter().search()
  const products = await apiFeature.mongooseQuery
  const productsWithLinks = products.map((product) => ({
    ...product._doc,
    shareLink: `${process.env.BASE_URL}api/v1/product-id/${product._id}`,
  }));
// Count total number of categories
const TotalProduct = await Product.countDocuments();
  return res.status(200).json({success : true , productData : productsWithLinks , TotalProduct}) 
}
//get product by id 
export const getProductById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.authUser?._id;

    
    const product = await Product.findById(id);

    if (!product) {
      return next(new AppError("Product not found", 404));
    }

    
    if (!Array.isArray(product.viewedBy)) {
      product.viewedBy = [];
    }

    // Generate share link
    const shareLink = `${process.env.BASE_URL}api/v1/product-id/${product._id}`;

    // Handle views for authenticated users
    if (userId) {
     
      if (!product.viewedBy.includes(userId)) {
        product.viewedBy.push(userId);
        product.views += 1; 
      }
    } else {
      
      product.views += 1;
    }

    // Save the updated product document
    await product.save();

    
    return res.status(200).json({
      success: true,
      productData: product,
      shareLink,
      totalViews: product.views,
      uniqueViews: product.viewedBy.length,
    });
  } catch (error) {
    return next(error);
  }
};

//update product
export const updateProduct = async (req, res, next) => {
  // Get data from req
  let { productId } = req.params;
  let { name, description, category, subcategory, brand, price, discount, discountTypes, colors, sizes, stock } = req.body;

  // Check product existence 
  const productIdExistence = await Product.findById(productId);
  if (!productIdExistence) {
    return next(new AppError(messages.product.notFound, 404));
  }

  // Check brand existence 
  if (brand) {
    const brandIdExistence = await Brand.findById(brand);
    if (!brandIdExistence) {
      return next(new AppError(messages.brand.notFound, 404));
    }
  }

  // Check subcategory existence 
  if (subcategory) {
    const subcategoryIdExistence = await Subcategory.findById(subcategory);
    if (!subcategoryIdExistence) {
      return next(new AppError(messages.subcategory.notFound, 404));
    }
  }

  // Update req.body data
  if (name) {
    const slug = slugify(name);
    productIdExistence.name = name;
    productIdExistence.slug = slug;
  }
  if (description) {
    productIdExistence.description = description;
  }
  if (price) {
    productIdExistence.price = price;
  }
  if (category) {
    productIdExistence.category = category;
  }
  if (discount) {
    productIdExistence.discount = discount;
  }
  if (colors) {
    productIdExistence.colors = JSON.parse(colors);
  }
  if (sizes) {
    productIdExistence.sizes = JSON.parse(sizes);
  }
  if (stock) {
    productIdExistence.stock = stock;
  }
  if (discountTypes) {
    productIdExistence.discountTypes = discountTypes;
  }
  if (brand) productIdExistence.brand = brand;
  if (subcategory) productIdExistence.subcategory = subcategory;

  // Handle mainImage upload
  let failImages = [];
  if (req.files?.mainImage) {
    const { secure_url, public_id } = await cloudinary.uploader.upload(req.files.mainImage[0].path, {
      public_id: productIdExistence.mainImage.public_id,
      overwrite: true,
    });
    productIdExistence.mainImage = { secure_url, public_id };
    failImages.push(public_id);
  }

  // Handle subImages upload
  let subImages = productIdExistence.subImages;
  let newSubImages = []; 
  
  if (req.files?.subImages) {
   
    const existingPublicIds = subImages.map(image => image.public_id);
  
   
    for (const oldImage of subImages) {
      const imageExistsInNewArray = req.files.subImages.some(file => file.public_id === oldImage.public_id);
      if (!imageExistsInNewArray) {
        // If the old image is not part of the new subImages, delete it from Cloudinary
        await cloudinary.uploader.destroy(oldImage.public_id);
      }
    }
  
   
    for (const file of req.files.subImages) {
    
      const existingImage = subImages.find(image => image.public_id === file.public_id);
  
      
      if (existingImage) {
        const { secure_url, public_id } = await cloudinary.uploader.upload(file.path, {
          public_id: existingImage.public_id, 
          overwrite: true, 
          folder: 'E-commerce/product/sub-images', 
        });
  
       
        existingImage.secure_url = secure_url;
        existingImage.public_id = public_id;
  
       
        newSubImages.push(existingImage);
        failImages.push(public_id);
      } else {
        
        const { secure_url, public_id } = await cloudinary.uploader.upload(file.path, {
          folder: 'E-commerce/product/sub-images', 
        });
  
        
        newSubImages.push({ secure_url, public_id });
        failImages.push(public_id);
      }
    }
  
    // Step 3: Replace old subImages with new subImages array in the product
    productIdExistence.subImages = newSubImages;
  }
  
  // Save to DB
  const updatedProduct = await productIdExistence.save();
  if (!updatedProduct) {
    req.failImages = failImages;
    return next(new AppError(messages.product.failToUpdate, 500));
  }

  // Send response
  return res.status(200).json({ message: messages.product.updateSuccessfully, success: true, updatedProduct });
};
//delete product
export const deleteProduct = async (req,res,next)=>{
  let {productId}= req.params
  //check category id existence 
  const productExistence = await Product.findById(productId)
  if(!productExistence){
    return next(new AppError(messages.product.notFound,404))
  }
  //delete image 
  if (productExistence.mainImage) {
    await deleteCloudImage(productExistence.mainImage.public_id)
}

if (productExistence.subImages?.length > 0) {
    for (const subImages of productExistence.subImages) {
        await deleteCloudImage(subImages.public_id);
    }
}
  //send to db

const deleteProduct = await Product.findByIdAndDelete(productId);
  if(!deleteProduct){
    return next(new AppError(messages.product.failToDelete,500))
  }
  //send response
  return res.status(200).json({message:messages.product.deleteSuccessfully,success:true, deleteProduct})
}
//viewer
// Route to view a product
// export const viewProduct = async (req, res, next) => {
//   const { productId } = req.params;

 
//   const product = await Product.findById(productId);
//   if (!product) {
//     return next(new AppError(messages.product.notFound, 404));
//   }

  
//   if (!req.authUser) {
    
//     product.views += 1;
//   } else {
   
   
//     const userHasViewed = await UserProductView.findOne({ userId: req.authUser._id, productId });
//     if (!userHasViewed) {
//       product.views += 1;
//       await UserProductView.create({ userId: req.authUser._id, productId });
//     }
//   }


//   await product.save();


//   return res.status(200).json({
//     message: "Product viewed successfully",
//     success: true,
//     product: product,
//   });
// };

// Route to view a product
export const viewProduct = async (req, res, next) => {
  const { productId } = req.params;

  // Find the product by ID
  const product = await Product.findById(productId);
  if (!product) {
    return next(new AppError(messages.product.notFound, 404));
  }

  let userId = req.authUser?._id;  

  if (!userId) {
    product.views += 1;
  } else {
    // For authenticated users, check if they've viewed the product
    const userHasViewed = await UserProductView.findOne({ userId, productId });
    if (!userHasViewed) {
      product.views += 1;  
      await UserProductView.create({ userId, productId });  // Record this view
      product.viewedBy.push(userId);  
    }
  }


  await product.save();

  // Return success response
  return res.status(200).json({
    message: "Product viewed successfully",
    success: true,
    product,
  });
};

//history
// Get user’s viewed products history
// export const getViewHistory = async (req, res, next) => {
//   const userId = req.authUser?._id;

//   if (!userId) {
//     return next(new AppError("User not authenticated", 401));
//   }

//   // Find the last 10 viewed products for the user
//   const viewedProducts = await UserProductView.findById( userId )
//     .sort({ viewedAt: -1 })
//     .limit(1) 
//     .populate("productId"); 

//   if (!viewedProducts || viewedProducts.length === 0) {
//     return res.status(404).json({
//       message: "No viewed products found",
//       success: false,
//     });
//   }

//   return res.status(200).json({
//     message: "View history retrieved successfully",
//     success: true,
//     viewedProducts,
//   });
// };
//compare
// export const compareProducts = async (req, res, next) => {
//   const { productIds } = req.body;  // Array of product IDs to compare
//   if (!Array.isArray(productIds) || productIds.length < 2) {
//     return next(new AppError("Please provide at least two product IDs to compare.", 400));
//   }

//   // Fetch the products from the database
//   const products = await Product.find({ _id: { $in: productIds } });

//   if (products.length < 2) {
//     return next(new AppError("One or more products not found.", 404));
//   }

//   // Find the product with the lowest price
//   let bestPriceProduct = products.reduce((min, product) => {
//     return (min.price < product.price) ? min : product;
//   });

//   //send response
//   return res.status(200).json({
//     success: true,
//     comparedProducts: products,
//     bestPriceProduct: bestPriceProduct,
//   });
// };
