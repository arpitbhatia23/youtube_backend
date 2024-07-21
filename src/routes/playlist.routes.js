import { Router } from "express";
import { verifyJwt } from "../middlewares/auth.middleware.js";
import { addVideoToPlaylist, createPlaylist, deletePlaylist, removeVideoFromPlaylist, updatePlaylist } from "../controllers/playlist.controller.js";

const router=Router()
router.route("/createPlaylist").post(verifyJwt,createPlaylist)
router.route("/updatePlaylist/:playlistId").patch(verifyJwt,updatePlaylist)
router.route("/deletePlaylist/:playlistId").delete(verifyJwt,deletePlaylist)
router.route("/addVideoToPlaylist/:playlistId").post(verifyJwt,addVideoToPlaylist)
router.route("/removeVideoFromPlaylist/:playlistId").delete(verifyJwt,removeVideoFromPlaylist)
export default router