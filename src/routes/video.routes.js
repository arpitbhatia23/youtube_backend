import { Router } from "express";
import { upload } from "../middlewares/multer.middleware.js";
import { verifyJwt } from "../middlewares/auth.middleware.js";
import { deletevideo, getVideoById, publishVideo, updateVideo } from "../controllers/video.controler.js";

const router=Router()

router.route("/publish-video").post(verifyJwt,upload.fields([
    {
        name:"video",
        maxCount:1
    },
    {
        name:"thumbnail",
        maxCount:1
    }

]),publishVideo)

router.route("/update-video/:videoId").patch(verifyJwt,upload.single("thumbnail"),updateVideo)
 
router.route("/getvideoById/:videoId").get(verifyJwt,getVideoById)
router.route("/deletevideo/:videoId").delete(verifyJwt,deletevideo)
export default router 
