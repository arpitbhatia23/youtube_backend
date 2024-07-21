import { Router } from "express";
import { verifyJwt } from "../middlewares/auth.middleware.js";
import { togglelike } from "../controllers/like.controler.js";
import { getSubscribedChannels, getUserChannelSubscribers } from "../controllers/subscriber.controller";

const router=Router()
router.route("/togglesubscription/:channelId").get(verifyJwt,togglelike)
router.route("/getUserChannelSubscribers/:channelId").get(verifyJwt,getUserChannelSubscribers)
router.route("/getSubscribedChannels/:channelId").get(verifyJwt,getSubscribedChannels)
export default router