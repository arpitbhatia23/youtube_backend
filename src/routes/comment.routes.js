import { Router } from "express";
import { verifyJwt } from "../middlewares/auth.middleware.js";
import { comment, deletecomment, getallcomment, updatecomment } from "../controllers/comment.controller.js";
const router=Router()
//take videoId or content
router.route("/createcomment").post(verifyJwt,comment)
// take video id or content
router.route("/updatecomment/:commentId").patch(verifyJwt,updatecomment)
// take comment id
router.route("/deletecomment/:commentId").delete(verifyJwt,deletecomment)
//video id
router.route("/getallcomment/:videoId").get(verifyJwt,getallcomment)

export default router