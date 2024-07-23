import { Router } from "express";
import { verifyJwt } from "../middlewares/auth.middleware.js";
import { createTweet, deleteTweet, getUserTweets, updateTweet } from "../controllers/tweet.controllers.js";

const router=Router()
// take content 
router.route("/createtweet").post(verifyJwt,createTweet)
// take userId
router.route("/getUserTweets/:userId").get(verifyJwt,getUserTweets)
// take tweetId
router.route("/updateTweet/:tweetId").patch(verifyJwt,updateTweet)
// take tweertId
router.route("/deleteTweet/:tweetID").delete(verifyJwt,deleteTweet)
export default router