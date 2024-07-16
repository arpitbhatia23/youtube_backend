import { Video } from "../models/video.model.js";
import { apiError } from "../utils/apiError.js";
import { asynchandler } from "../utils/asyncHandler.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";




const videoUpload=asynchandler(async(req,res)=>{
  const videoLocalPath=  req?.files?.video[0].path
  if (!videoLocalPath) {
throw new apiError(400,"video is required")
  }

  const videofile =await uploadOnCloudinary(videoLocalPath)

  if (!videofile) {
    throw  new apiError(400,"something wrong while uploading video")
    
  }
  const  video =Video.create({

  })

})