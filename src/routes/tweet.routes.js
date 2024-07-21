import { Router } from "express";
import { verifyJwt } from "../middlewares/auth.middleware.js";
import { createTweet, deleteTweet, getUserTweets, updateTweet } from "../controllers/tweet.controllers.js";

const router=Router()
router.route("/createtweet").post(verifyJwt,createTweet)
router.route("/getUserTweets/:userId").get(verifyJwt,getUserTweets)
router.route("/updateTweet/:tweetId").patch(verifyJwt,updateTweet)
router.route("/deleteTweet/:tweetID").delete(verifyJwt,deleteTweet)
export default router