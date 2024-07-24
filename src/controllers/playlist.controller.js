import {asynchandler} from "../utils/asyncHandler.js"
import {apiError} from "../utils/apiError.js"
import { Playlist } from "../models/playlist.model.js"
import {apiResponse} from "../utils/apiResponse.js"
import { isValidObjectId } from "mongoose"

// create playlist
const createPlaylist=asynchandler(async(req,res)=>{
    const {name,description}=req.body

    if (!(name&&description)) {
        throw new apiError(400,"name and descripttion required")   
    }

    const userId=req.user?._id
    if (!userId) {
        throw new apiError(400,"userId required")
        
    }

    const playlist = await Playlist.create({
        name,
        description,
        owner:userId
    })

    return res.status(201)
    .json(new apiResponse(201,playlist,"playlist created sucessfully"))

})
// update
const updatePlaylist=asynchandler(async(req,res)=>{
    const {name,description}=req.body
   const {playlistId}=req.params
   if (!isValidObjectId(playlistId)) {
    throw new apiError(400,"playlistId required")
    
   }
    if (!(name&&description)) {
        throw new apiError(400,"name and descripttion required")   
    }

    const playlist= await Playlist.findById(playlistId)
    if (!playlistId) {
        throw new apiError(404,"playlist not found")
    }

    if(String(playlist.owner)!==String(req.user?._id)){
                throw new apiError(401,"you have not permission to perform this action")
    }
   
    await Playlist.findByIdAndUpdate(playlistId,{
        $set:{
            name,
            description
        }
    },{new:true})
 return res.status(200)
 .json(new apiResponse(200,{},"playlist updated successfuly"))
        
    })
// delete
    const deletePlaylist=asynchandler(async(req,res)=>{
       const {playlistId}=req.params
       if (!isValidObjectId(playlistId)) {
        throw new apiError(400,"playlistId required")
        
       }
       
        const playlist= await Playlist.findById(playlistId)
        if (!playlistId) {
            throw new apiError(404,"playlist not found")
        }
    
        if(String(playlist.owner)!==String(req.user?._id)){
            throw new apiError(401,"you have not permission to perform this action")
        }
       
        await Playlist.findByIdAndDelete(playlistId)
     return res.status(200)
     .json(new apiResponse(200,{},"playlist deleted successfuly"))
            
        })
//add
        const addVideoToPlaylist=asynchandler(async(req,res)=>{
      const {playlistId}=req.params
      const {videoId}=req.body
      if (!isValidObjectId(videoId)) {
        throw new apiError(400,"video id required")
      }
      if (!isValidObjectId(playlistId)) {
        throw new apiError(400,"playlist id required")
      }
      

      const playlist=await Playlist.findByIdAndUpdate(playlistId,{
        $push:{video:videoId}
      },{new:true})
      return res.status(200)
      .json(new apiResponse(200,{playlist},"video added succesfully"))

        })
// remove
const removeVideoFromPlaylist=asynchandler(async(req,res)=>{
    const {playlistId}=req.params
    const {videoId}=req.body
    if (!isValidObjectId(videoId)) {
      throw new apiError(400,"video id required")
    }
    if (!isValidObjectId(playlistId)) {
      throw new apiError(400,"playlist id required")
    }
    

    const playlist=await Playlist.findByIdAndUpdate(playlistId,{
        $pull:{video:videoId}
    },{new:true})
    return res.status(200)
    .json(new apiResponse(200,{playlist},"video remove succesfully"))

})

// getUserplaylist
const getUserPlaylist=asynchandler(async(req,res)=>{
 const {userId}=req.params
 if(!isValidObjectId(userId)){
    throw new apiError(400,"invalid user Id")

 }
const playlist =await Playlist.findOne({owner:userId})
if (!playlist) {
    throw new apiError(400,"playlist not found")
}
return res.status(200)
.json(new apiResponse(200,playlist,"playlsit fetch sucessfully"))


})

const getPlaylistbyId=asynchandler(async(req,res)=>{
    const {playlistId}=req.params
    if(!isValidObjectId(playlistId)){
       throw new apiError(400,"invalid playlsit Id")
   
    }
   const playlist =await Playlist.findById(playlistId)
   if (!playlist) {
       throw new apiError(400,"playlist not found")
   }
   return res.status(200)
   .json(new apiResponse(200,{playlist},"playlsit fetch sucessfully"))
   
   
   })

export {
    createPlaylist,
    updatePlaylist,
    deletePlaylist,
    addVideoToPlaylist,
    removeVideoFromPlaylist,
    getUserPlaylist,
    getPlaylistbyId
    
}