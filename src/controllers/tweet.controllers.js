import mongoose, { isValidObjectId } from "mongoose"
import {Tweet} from "../models/tweets.model.js"
import {apiError, } from "../utils/apiError.js"
import {apiResponse, } from "../utils/apiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"

const createTweet = asyncHandler(async (req, res) => {

    //TODO: create tweet
const{content}=req.body
const userId=req.user?._id

if (!content) {
    throw new apiError(400,"tweet required")
}
const tweet=await Tweet.create({
    content,
    owner:userId
})
if (!tweet) {
    throw new apiError(500,"internal server error")
    
}
return res.status(201)
.json(new apiResponse(201,{tweet},"tweet created sucessfully"))

})

const getUserTweets = asyncHandler(async (req, res) => {
    // TODO: get user tweets
       const{userId}=req.params
       if(!isValidObjectId(userId)){
        throw new apiError(400,"invaild user id")
       }
       const tweets=await Tweet.find({owner:userId}).sort({createdAt:-1})
    return res.status(200)
    .json(new apiResponse(200,{tweets},"user tweets fetchsucessfully"))
})

const updateTweet = asyncHandler(async (req, res) => {
    //TODO: update tweet
const {tweetID}=req.params
const {content}=req.body
if(!isValidObjectId(tweetID)){
    throw new apiError(400,"invalid tweet Id")
}
if (!content) {
    throw new apiError(400,"content required")
    
}
const user=await Tweet.findById(tweetID)
if(String(user.owner)!==String(req.user?.id)){
    throw new apiError(401,"you don't have permision to perform this action")
}
await Tweet.findByIdAndUpdate(tweetID,{
    $set:{
        content
    }
},{new:true})

return res.status(200)
      .json(new apiResponse(200,{},"tweet update sucessfully"))
})

const deleteTweet = asyncHandler(async (req, res) => {
    //TODO: delete tweet
    const {tweetID}=req.params
if(!isValidObjectId(tweetID)){
    throw new apiError(400,"invalid tweet Id")
}

const user=await Tweet.findById(tweetID)
if(String(user.owner)!==String(req.user?.id)){
    throw new apiError(401,"you don't have permision to perform this action")
}
await Tweet.findByIdAndDelete(tweetID)

return res.status(200)
      .json(new apiResponse(200,{},"tweet deleted sucessfully"))
})

export {
    createTweet,
    getUserTweets,
    updateTweet,
    deleteTweet
}