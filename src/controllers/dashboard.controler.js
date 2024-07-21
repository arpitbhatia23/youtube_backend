import mongoose, { isValidObjectId } from "mongoose"
import {Video} from "../models/video.model.js"
import {Subscription} from "../models/subscription.model.js"
import {Like} from "../models/like.model.js"
import {apiError} from "../utils/apiError.js"
import {apiResponse} from "../utils/apiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"

const getChannelStats = asyncHandler(async (req, res) => {
    // TODO: Get the channel stats like total video views, total subscribers, total videos, total likes etc.
    const { channelId } = req.params;
    if (!isValidObjectId(channelId)) {
        throw new apiError(400, "Invalid channelId");
    }

    // Total Videos
    const totalVideos = await Video.countDocuments({ owner: channelId });

    // Total Video Views
    const totalViewsResult = await Video.aggregate([
        { $match: { owner: mongoose.Types.ObjectId(channelId) } },
        { $group: { _id: null, totalViews: { $sum: "$views" } } }
    ]);
    const totalViews = totalViewsResult[0]?.totalViews || 0;

    // Total Subscribers
    const totalSubscribers = await Subscription.countDocuments({ channel: channelId });

    // Total Likes
    const totalLikes = await Like.countDocuments({ video: { $in: (await Video.find({ owner: channelId }).select('_id')) } });

    const stats = {
        totalVideos,
        totalViews,
        totalSubscribers,
        totalLikes
    };

    res.status(200).json(new apiResponse(200, stats, "Channel stats fetched successfully"));
});



const getChannelVideos = asyncHandler(async (req, res) => {
    // TODO: Get all the videos uploaded by the channel
    const {channelId}=req.params
    if (!isValidObjectId(channelId)) {
        throw new apiError(400,"invalid channelId")   
    }
    const video=await Video.find({owner:channelId})
    if (!video) {
        throw new apiError(500,"internal server error")
        
    }
    if (video.length===0) {
        throw new apiError(404,"no videos found")
        
    }
    return res.status(200).json(new apiResponse(200,video,"video fech sucessfully "))
})

export {
    getChannelStats, 
    getChannelVideos
    }