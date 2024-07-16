import { Video } from "../models/video.model.js";
import { apiError } from "../utils/apiError.js";
import { asynchandler } from "../utils/asyncHandler.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import {apiResponse} from "../utils/apiResponse.js"



const publishVideo=asynchandler(async(req,res)=>{

const {title,description}=req.body
if (!(title && description)) {
  throw new apiError(404,"title and discription required")
  
}
console.log(req.files)
const thumbnailLocalFile=req.files?.thumbnail[0].path
if (!thumbnailLocalFile) {
  throw new apiError(400,"thubnail is required")
  
}
const thumbnail= await uploadOnCloudinary(thumbnailLocalFile)
if (!thumbnail) {
  throw new apiError(400,"something went wrong while uploading file")
}
  const videoLocalPath=  req?.files?.video[0].path
  if (!videoLocalPath) {
throw new apiError(400,"video is required")
  }

  const video =await uploadOnCloudinary(videoLocalPath)

  if (!video) {
    throw  new apiError(400,"something wrong while uploading video")
    
  }
  const  publish = await Video.create({
    videofile:{
      url:video.url,
      public_id:video.public_id
    },
    thumbnail:{
      url:thumbnail.url,
      public_id:thumbnail.public_id
    },
    
    title,
    description,
    duration:video.duration,
     owner:req.user?._id
  })

  return res.status(201)
  .json(new apiResponse(201,publish,"video publish successfully"))

})

export {
  publishVideo
}