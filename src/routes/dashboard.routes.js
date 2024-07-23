import { Router } from "express";
import { verifyJwt } from "../middlewares/auth.middleware.js";
import { getChannelStats, getChannelVideos } from "../controllers/dashboard.controler.js";

const router=Router()
// take channel id
router.route("/getChannelStats/:channelId").get(verifyJwt,getChannelStats)
//take channel id
router.route("/getChannelVideos/:channelId").get(verifyJwt,getChannelVideos)
export default router