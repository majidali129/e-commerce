
import {v2 as cloudinary} from 'cloudinary';


export const uploadToCloudinary = async localFilePath => {

    cloudinary.config({
        cloud_name: process.env.CLOUD_NAME,
        api_key: process.env.CLOUD_API_KEY,
        api_secret: process.env.CLOUD_API_SECRET
    });
    if(!localFilePath) throw new Error('localFilePath is required to upload on cloudinary')
    uploadResult = await cloudinary.uploader.upload(localFilePath, {
        format: "auto"
    }).catch((error)=>{console.log(error)});

    console.log(uploadResult);
}