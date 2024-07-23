import { Router } from "express";
import { verifyJwt } from "../middlewares/auth.middleware.js";
import { getSubscribedChannels, getUserChannelSubscribers, toggleSubscription } from "../controllers/subscriber.controller.js";

const router=Router()
// take  channelID
router.route("/togglesubscription/:channelId").get(verifyJwt,toggleSubscription)
// take chanel id
router.route("/getUserChannelSubscribers/:channelId").get(verifyJwt,getUserChannelSubscribers)
// take channe;ID
router.route("/getSubscribedChannels/:subscriberId").get(verifyJwt,getSubscribedChannels)
export default router