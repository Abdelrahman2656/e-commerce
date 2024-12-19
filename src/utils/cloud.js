import { v2 as cloudinary } from "cloudinary";
import dotenv from "dotenv";
import path from "path";
dotenv.config({ path: path.resolve("./config/.env") });
// console.log(process.env.DB_URL);

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
});
export default cloudinary;
// console.log('CLOUD_NAME:', process.env.CLOUD_NAME);
// console.log('API_KEY:', process.env.API_KEY);
// console.log('API_SECRET:', process.env.API_SECRET);
export const deleteCloudImage = async(public_id)=>{
    await cloudinary.uploader.destroy(public_id)
}