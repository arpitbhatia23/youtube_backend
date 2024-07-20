import { Router } from "express";
import { verifyJwt } from "../middlewares/auth.middleware.js";
import { getItemsLikedByUser, getVideoTotalLike, togglelike, totalCommentLike, totalTweetLike } from "../controllers/like.controler.js";
import { get } from "mongoose";

const router=Router()
router.route("/toggleLike").post(verifyJwt,togglelike)
router.route("/totalVideoLike/:videoId").get(verifyJwt,getVideoTotalLike)
router.route("/totalCommentLike/:commentId").get(verifyJwt,totalCommentLike)
router.route("/totoalTweetLike/:tweetId").get(verifyJwt,totalTweetLike)
router.route("/getItemsLikeByUser/:userId").get(verifyJwt,getItemsLikedByUser)

export default router
9
