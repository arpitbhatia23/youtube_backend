import { Router } from "express";
import { verifyJwt } from "../middlewares/auth.middleware.js";
import { getChannelStats, getChannelVideos } from "../controllers/dashboard.controler";

const router=Router()
router.route("/getChannelStats/:channelId").get(verifyJwt,getChannelStats)
router.route("/ getChannelVideos/:channelID").get(verifyJwt,getChannelVideos)
export default router