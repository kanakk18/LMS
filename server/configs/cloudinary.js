import { v2 as cloudinary } from 'cloudinary'
import { connect } from 'mongoose'
const ConnectCloudinary = async () => {
    cloudinary.config({
        cloud_name: process.env.CLOUDINARY_NAME,
        api_key: process.env.CLOUDINARY_API_NAME,
        api_secret: process.env.CLOUDINARY_SECRET_KEY,
    })
}

export default ConnectCloudinary