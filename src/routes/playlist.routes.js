import { Router } from "express";
import { verifyJwt } from "../middlewares/auth.middleware.js";
import { addVideoToPlaylist, createPlaylist, deletePlaylist, getPlaylistbyId, getUserPlaylist, removeVideoFromPlaylist, updatePlaylist } from "../controllers/playlist.controller.js";

const router=Router()
//take name ans discription
router.route("/createPlaylist").post(verifyJwt,createPlaylist)
//name , discription and playlistId
router.route("/updatePlaylist/:playlistId").patch(verifyJwt,updatePlaylist)
//playlistid
router.route("/deletePlaylist/:playlistId").delete(verifyJwt,deletePlaylist)
//take playlist id and videoID
router.route("/addVideoToPlaylist/:playlistId").post(verifyJwt,addVideoToPlaylist)
// take playlistID and videoID
router.route("/removeVideoFromPlaylist/:playlistId").delete(verifyJwt,removeVideoFromPlaylist)
router.route("/getUserPlaylist/:userId").get(verifyJwt,getUserPlaylist)
router.route("/getPlaylistbyId/:playlistId").get(verifyJwt,getPlaylistbyId)
export default router