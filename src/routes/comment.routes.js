import { Router } from "express";
import { verifyJwt } from "../middlewares/auth.middleware.js";
import { comment, deletecomment, getallcomment, updatecomment } from "../controllers/comment.controller.js";
const router=Router()
router.route("/createcomment").post(verifyJwt,comment)
router.route("/updatecomment/:commentId").patch(verifyJwt,updatecomment)
router.route("/deletecomment/:commentId").delete(verifyJwt,deletecomment)
router.route("/getallcomment/:videoId").get(verifyJwt,getallcomment)

export default router