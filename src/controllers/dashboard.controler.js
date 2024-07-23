import mongoose, { isValidObjectId } from "mongoose"
import {Video} from "../models/video.model.js"
import {Subscription} from "../models/subscriptions.model.js"
import {Like} from "../models/likes.model.js"
import {apiError} from "../utils/apiError.js"
import {apiResponse} from "../utils/apiResponse.js"
import {asynchandler} from "../utils/asyncHandler.js"

const getChannelStats = asynchandler(async (req, res) => {
    // TODO: Get the channel stats like total video views, total subscribers, total videos, total likes etc.
    try {
        const { channelId } = req.params;
        if (!isValidObjectId(channelId)) {
            throw new apiError(400, "Invalid channelId");
        }
    
        // Total Videos
        const totalVideos = await Video.countDocuments({ owner: channelId });
    console.log(totalVideos)
        // Total Video Views
        const videos = await Video.find({ owner: channelId }, 'views');
        const totalViews = videos.reduce((sum, video) => sum + (video.views || 0), 0);
        console.log('Total Views:', totalViews);

        // Total Subscribers
        const totalSubscribers = await Subscription.countDocuments({ channel: channelId });
    console.log(totalSubscribers)
        // Total Likes
        const videoIds = await Video.find({ owner: channelId }, { _id: 1 }).lean();
        const totalLikes = await Like.countDocuments({Video:videoIds.map(video => video._id) });
        console.log(totalLikes)
    
        const stats = {
            totalVideos,
            totalViews,
            totalSubscribers,
            totalLikes
        };
        res.status(200).
    json(new apiResponse(200, stats, "Channel stats fetched successfully"));
    } catch (error) {
        console.log(error)
    }

    
});



const getChannelVideos = asynchandler(async (req, res) => {
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