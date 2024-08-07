import { v2 as cloudinary} from "cloudinary";
import fs from "fs"
cloudinary.config({
    cloud_name:process.env.CLOUDINARY_CLOUD_NAME ,
    api_key:process.env.CLOUDINARY_API_KEY,
    api_secret:process.env.CLOUDINARY_API_SECRET,
});

const uploadOnCloudinary=async(localFilePath)=>{
    try {
        if (!localFilePath)
            return null
     const response= await  cloudinary.uploader.upload(localFilePath,{
            resource_type:"auto"
        })
       // console.log("file uploaded successfully" ,response.url)
        fs.unlinkSync(localFilePath)
        console.log(response)
        return response
        
    } catch (error) {
         fs.unlinkSync(localFilePath) //remove the locally saved temperary file on server
        
    }
}


const deleteOnCloudninary=async(public_id)=>{
    try {
        if(!public_id){
            return null
        }
        await cloudinary.uploader.destroy(public_id,{resource_type:"image"})
        
    } catch (error) {
        console.log(error.message)
        
    }
}
const deleteVideoOnCloudninary=async(public_id)=>{
    try {
        if(!public_id){
            return null
        }
        await cloudinary.uploader.destroy(public_id,{resource_type:"video"})
        
    } catch (error) {
        console.log(error.message)
        
    }
}

export {uploadOnCloudinary,deleteOnCloudninary,deleteVideoOnCloudninary}