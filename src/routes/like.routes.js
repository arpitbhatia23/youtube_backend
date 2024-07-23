import { Router } from "express";
import { verifyJwt } from "../middlewares/auth.middleware.js";
import { getItemsLikedByUser, getVideoTotalLike, togglelike, totalCommentLike, totalTweetLike } from "../controllers/like.controler.js";

const router=Router()
// take videoId ,commentId , tweetId ,userId 
router.route("/toggleLike").post(verifyJwt,togglelike)
//take video id
router.route("/totalVideoLike/:videoId").get(verifyJwt,getVideoTotalLike)
// take comment id
router.route("/totalCommentLike/:commentId").get(verifyJwt,totalCommentLike)
//take tweet id
router.route("/totoalTweetLike/:tweetId").get(verifyJwt,totalTweetLike)

router.route("/getItemsLikeByUser").get(verifyJwt,getItemsLikedByUser)

export default router
