import { isValidObjectId } from "mongoose";
import { Comment } from "../models/comments.model.js";
import { asynchandler } from "../utils/asyncHandler.js";
import { apiError } from "../utils/apiError.js";
import { apiResponse } from "../utils/apiResponse.js";
// create comment
const comment=asynchandler(async(req,res)=>{
   try {
     const {videoId,content}=req.body
     console.log(videoId,content)
     const userId=req.user?._id
     console.log(userId)
     if(!(videoId&&content)){
     throw new apiError(400,"videoId and content required")
     }
     const comment=await Comment.create({
         content:content,
         video:videoId,
         owner:userId
 
     })
     if (!comment) {
         throw new apiError(500,"somethig went while creating comment")
         
     }
     return res.status(201)
     .json(new apiResponse(201,{comment},"comment created sucessfully"))
   } catch (error) {
    throw new apiError(500,`internal server error${error.message}`)
    
   }
})


// update comment

const updatecomment=asynchandler(async(req,res)=>{
    

        const {content}=req.body
        const {commentId}=req.params
        if(!isValidObjectId(commentId)){
            throw new apiError (400,"user id required")
        }
        if(!content){
            throw new apiError(400,"content required")
        }
        const comment=await Comment.findById(commentId)
        if(String(comment.owner)!== String(req.user?._id)){
            throw new apiError(400, "you have no persmission to perform this action")
        }

        await Comment.findByIdAndUpdate(comment,{
            $set:{
                content:content
            }
        },{new:true})
 return res.status(200)
 .json(new apiResponse(200,{},"comment updated successfully"))

})
// delete comment
const deletecomment=asynchandler(async(req,res)=>{
   

        const {commentId}=req.params
        if(!isValidObjectId(commentId)){
            throw new apiError (400,"user id required")
        }
        const comment=await Comment.findById(commentId)
        console.log(comment.owner ,req.user._id)
        if(String(comment.owner)!==String(req.user?._id)){
            throw new apiError(400, "you have no persmission to perform this action")
        }

        await Comment.findByIdAndDelete(commentId)
 return res.status(200)
 .json(new apiResponse(200,{},"comment deleted successfully"))

})
// getallcomment 

const getallcomment=asynchandler(async(req,res)=>{
    try {
        const {limit=10,page=1,sortType="desc"}=req.query
        const sortOrder = sortType === "desc" ? -1 : 1;
        const skip = (page - 1) * limit;
        const {videoId}=req.params
        if(!isValidObjectId(videoId)){
            throw new apiError(400,"video id required")
        }
const comments=await Comment.find({video:videoId}).sort({createdAt:sortOrder}).skip(skip).limit(limit)
 
return res.status(200)
.json(new apiResponse(200,{comments},"comment fetch succesfully"))


    } catch (error) {
         throw new apiError(500,error.message)
    }
})

export {
    comment,
    updatecomment,
    deletecomment,
    getallcomment
}