
import {v2 as cloudinary} from 'cloudinary';


export const uploadToCloudinary = async localFilePath => {
    console.log(localFilePath)
    cloudinary.config({
        cloud_name: process.env.CLOUD_NAME,
        api_key: process.env.CLOUD_API_KEY,
        api_secret: process.env.CLOUD_API_SECRET
    });
   try {
     if(!localFilePath) return null;
     const response = await cloudinary.uploader.upload(localFilePath, {
         resource_type: "auto"
     })
     console.log(response)
     return response
   } catch (error) {
    console.log('Cloudinary error ::', error)
    return null
   }
}