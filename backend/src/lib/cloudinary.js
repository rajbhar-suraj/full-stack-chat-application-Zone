import { v2 as cloudinary } from 'cloudinary';
import dotenv from 'dotenv';
dotenv.config();
import multer from 'multer';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
dotenv.config()

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_SECRET_KEY
})

export const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: 'chat_profiles',
        allowed_formats: ['jpeg', 'png', 'jpg']
    }
})


export const upload = multer({ storage })

export default cloudinary