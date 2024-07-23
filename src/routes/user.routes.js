    import { Router } from "express";
import {  
    changeCurrentPassword,
    forgotPassword,
    getCurrentUser, 
    getUserChannelProfile,
    getWatchHistory, 
    loginUSer, 
    logoutUser, 
    refreshAccessToken,
    registerUser, requestOtp, UpdateAccountDetails,
    updateAvatar, updateUserCoverImage
     } from "../controllers/user.controller.js";
  import {upload} from '../middlewares/multer.middleware.js'
  import {verifyJwt} from '../middlewares/auth.middleware.js'

const router =Router()
// take email
router.route("/requestotp").post(requestOtp)

    router.route("/register").post(upload.fields([
        {name:"avatar",
        maxCount:1
    },
    {
        name:"coverimage",
        maxCount:1

    }
]),
        registerUser)

   router.route("/login").post(loginUSer)     
// secured 
router.route("/logout").post(verifyJwt ,logoutUser)

router.route("/refreshToken").post(refreshAccessToken)
  
router.route("/change-password").post(verifyJwt,changeCurrentPassword)

router.route("/current-user").get(verifyJwt ,getCurrentUser)

router.route("/update-account").patch(verifyJwt,UpdateAccountDetails)

router.route("/update-avatar").patch(verifyJwt,upload.single("avatar"),updateAvatar)

router.route("/update-coverimage").patch(verifyJwt,upload.single("coverimage"),updateUserCoverImage)
router.route("/c/:username").get(verifyJwt,getUserChannelProfile)

router.route("/watchHistory").get(verifyJwt,getWatchHistory)
// take otp and newPassword
router.route("/forgot-password").post(forgotPassword)


    export default router