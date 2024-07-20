import { isValidObjectId } from "mongoose";
import { asynchandler } from "../utils/asyncHandler.js";
import { apiError } from "../utils/apiError.js";
import { Like } from "../models/likes.model.js";
import { apiResponse } from "../utils/apiResponse.js";


const togglelike=asynchandler(async(req,res)=>{
   try {
     const {videoId,commentId,tweetId,userId}=req.body
    
     if(!isValidObjectId(videoId || commentId || tweetId ||userId)){
         throw new apiError(400,"id requried")
     }
  const existedLike= await Like.findOne({
     comment:commentId,
     Video:videoId,
     likedby:userId,
     tweet:tweetId
  })
  if(existedLike){
     await Like.deleteOne({
        comment:commentId,
         Video:videoId,
         likedby:userId,
         tweet:tweetId
     })
     return res.status(200).json(new apiResponse(200,{},"remove like succesfully"))
  }else{
     const newLike=new Like(
       {  comment:commentId,
         Video:videoId,
         likedby:userId,
         tweet:tweetId}
     )
 const liked= await newLike.save()
 return res.status(200).json(new apiResponse(200,liked,"like succesfully"))
  }
  
   } catch (error) {

    throw new apiError(500,`internal server error || ${error.message}`)
    
   }

})

const getVideoTotalLike=asynchandler(async(req,res)=>{
    try {

        const {videoId}=req.params
        if (!isValidObjectId(videoId)) {
            throw new apiError(400,"video id required")
        }
        const totalLike= await Like.countDocuments({Video:videoId})
    
             return res.status(200).json(new apiResponse(200,totalLike,"total like found"))
    } catch (error) {
        throw new apiError(500,`internal server error || ${error.message}`)
    }
})

const totalCommentLike=asynchandler(async(req,res)=>{
    try {

        const {commentId}=req.params
        if (!isValidObjectId(commentId)) {
            throw new apiError(400,"video id required")
        }
        const totalLike=await Like.countDocuments({comment:commentId})
        if(!totalLike){
            throw new apiError(400,"no like found")
        }
        return res.status(200).json(new apiResponse(200,totalLike,"total like found"))
        
    } catch (error) {
        throw new apiError(500,`internal server error || ${error.message}`)
    }
})
const totalTweetLike=asynchandler(async(req,res)=>{
    try {

        const {tweetId}=req.params
        if (!isValidObjectId(tweetId)) {
            throw new apiError(400,"video id required")
        }
        const totalLike=await Like.countDocuments({tweet:tweetId})
        if(!totalLike){
            throw new apiError(400,"no like found")
        }
        return res.status(200).json(new apiResponse(200,totalLike,"total like found"))
        
    } catch (error) {
        throw new apiError(500,`internal server error || ${error.message}`)
    }
})

const getItemsLikedByUser=asynchandler(async(req,res)=>{
    try {
        const {userId}=req.params
        if(!isValidObjectId(userId)){
            throw new apiError(400,"user id required")
        }
        if(String(userId)!==String(req.user?._id)){
            throw new apiError(401, "you have no permission to perform this action")
        }
        const items=await Like.find({likedby:userId})
        .populate("video")
        .populate("comment")
        .populate("tweet")
        if (!items) {
            throw new apiError(400,"no liked item find")
         
        }
 return res.status(200)
 .json(new apiResponse(200,{items},"liked item fetch sucessfully"))
    } catch (error) {
        
    }
})
export {
    togglelike,
    totalCommentLike,
    totalTweetLike,
    getVideoTotalLike,
    getItemsLikedByUser
}