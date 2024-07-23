import { Router } from "express";
import { upload } from "../middlewares/multer.middleware.js";
import { verifyJwt } from "../middlewares/auth.middleware.js";
import { deletevideo, getvideo, getVideoById, ispublish, publishVideo, updateVideo } from "../controllers/video.controler.js";

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
// take  limit = 10, page = 1, query, sortBy, sortType = "desc", userId } = req.query;
router.route("/getvideos").get(verifyJwt,getvideo)
// viedoId
router.route("/ispublish/:videoId").get(verifyJwt,ispublish)
export default router 
