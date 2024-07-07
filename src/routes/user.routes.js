    import { Router } from "express";
import {  loginUSer, logoutUser, registerUser } from "../controllers/user.controller.js";
  import {upload} from '../middlewares/multer.middleware.js'
  import {verifyJwt} from '../middlewares/auth.middleware.js'
const router =Router()
    router.route("/register").post(upload.fields([
        {name:"avatar",
        maxCount:1
    },
    {
        name:"coverImages",
        maxCount:1

    }
]),
        registerUser)

   router.route("/login").post(loginUSer)     
// secured 
router.route("/logout").post(verifyJwt ,logoutUser)
  
    export default router