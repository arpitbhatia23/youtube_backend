import mongoose, {isValidObjectId} from "mongoose"
import { Subscription } from "../models/subscriptions.model.js"
import {apiError, ApiError} from "../utils/apiError.js"
import {apiResponse, ApiResponse} from "../utils/apiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"


const toggleSubscription = asyncHandler(async (req, res) => {
    const {channelId} = req.params
    // TODO: toggle subscription
    if (!isValidObjectId(channelId)) {
        throw new apiError(400,"invalid channelId")
    }
    const subscriptioncheck=await Subscription.findOne({channel:channelId})
    if(subscriptioncheck){
        await Subscription.findOneAndDelete({channel:channelId})
       return res.status(200)
        .json(200,{},"subscription remove successfully")
    }
    else{
      await Subscription.create({
        channel:channelId,
      subscriber:req.user?._id
      })
return  res.status(200)
        .json(200,{},"subscription added successfully")
    }



    
})

// controller to return subscriber list of a channel
const getUserChannelSubscribers = asyncHandler(async (req, res) => {
    const {channelId} = req.params
    if (!isValidObjectId(channelId)) {
        throw new apiError(400,"invalid channelId")
        
    }
    const channel=await Subscription.find({channel:channelId}).populate("subscriber","fullName username avatar email")
 return res.status(200)
 .json(new apiResponse(200,{channel},"subscriber fetch succesfully"))
})

// controller to return channel list to which user has subscribed
const getSubscribedChannels = asyncHandler(async (req, res) => {
    const { subscriberId } = req.params
    if (!isValidObjectId(subscriberId)) {
        throw new apiError(400,"invaild suscriber id")
    }

    const channelList=await Subscription.find({subscriber:subscriberId}).populate("channel","fullName username avatar email")
   return res.status(200)
   .json(new apiResponse(200,{channelList},"channel list fetch sucessfully"))
})

export {
    toggleSubscription,
    getUserChannelSubscribers,
    getSubscribedChannels
}