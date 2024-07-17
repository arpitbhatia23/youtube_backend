import { Video } from "../models/video.model.js";
import { apiError } from "../utils/apiError.js";
import { asynchandler } from "../utils/asyncHandler.js";
import { deleteOnCloudninary, deleteVideoOnCloudninary, uploadOnCloudinary } from "../utils/cloudinary.js";
import {apiResponse} from "../utils/apiResponse.js"


// publish video 
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



// update video 
const updateVideo=asynchandler(async(req,res)=>{


  const {videoId}=req.params
  if (videoId===":videoId") {
    throw new apiError(400,"videoId  id Rquired")
    
  }
  const user=await Video.findById(videoId)
  if (String(user.owner)!==String(req.user?._id)) {
    throw new apiError(401,"you haven't premission to perform this action ")
    
  }
  
const {title,description}=req.body
if (!(title,description)) 
  {
    throw new apiError(400,"title and description  required ")

  
}

let thumbnaillocalPAth
  if (req.file && Array.isArray(req.file.thumbnail) && req.file.thumbnail.length > 0) {
    thumbnaillocalPAth = req.file.thumbnail[0].path
} 

const thumbnail=await uploadOnCloudinary(thumbnaillocalPAth)

const video=await Video.findByIdAndUpdate(videoId,
  {
    $set:{
      title,
      thumbnail:thumbnail?.url,
      public_id:thumbnail?.public_id ,
      description
      
    }
  }
  ,{new:true}
)

  return res.status(200)
            .json(new apiResponse(200,video,"video details updated successfully"))
}

)


const getVideoById=asynchandler(async(req,res)=>{
  const {videoId}=req.params
  if (videoId===":videoId") {
    throw new apiError(400,"video id required")
  }




  const video =await Video.findByIdAndUpdate(videoId,{
    $inc:{
      views:+1
    }
  },
{new :true})

return res.status(200)
        .json(new apiResponse(200,video,"video fetch succesfully"))


})
// delete video

const deletevideo=asynchandler(async(req,res)=>{

const {videoId}=req.params
// console.log(videoId)
if (videoId===":videoId") {
  throw new apiError(400,"video id required")
}


const user=await Video.findById(videoId)
console.log(user)
if(!user){
  throw new apiError(400,"video not found")
}


if (String(user?.owner)!==String(req.user?._id)) {
  throw new apiError(401,"you haven't premission to perform this action ")
  
}
await Video.findByIdAndDelete(videoId)
 await deleteVideoOnCloudninary(user.videofile?.public_id)
 await deleteOnCloudninary(user.thumbnail?.public_id)

return res.status(200).json(new apiResponse(200,{},"deleted successfully"))


})
// get all video


export {
  publishVideo,
  updateVideo,
  getVideoById,
  deletevideo
}