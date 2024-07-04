import { asynchandler} from "../utils/asyncHandler.js"
import {apiError} from '../utils/apiError.js'
import {User} from "../models/user.model.js"
import {uploadOnCloudinary} from "../utils/cloudinary.js"
import { apiResponse } from "../utils/apiResponse.js"
const registerUser = asynchandler(async (req,res)=>{
// get user details from frontend
// validation - not empty
// check if user already exixt: username , email
//check for images check for avatar 
// upload to cloudinary ,avtar 
// create user object - create entry in  db
// remove password and access token 
// check for user creation
// return res 

const {fullName,email,username,password }=req.body 


if ([fullName,username,email,password].some((field) => field?.trim() === "")) 
{
   throw new apiError(400,"All fields are required")
}
const existedUser=await User.findOne({$or:[{username},{email}]})
if (existedUser) {
    throw new apiError(409,"user already exist ")
}
const avatarLocalPath= req.files?.avatar[0]?.path;

let  coverImageLocalPath
 if (req.files && Array.isArray(req.files.coverImage) && req.files.coverImage.length > 0) {
    coverImageLocalPath = req.files.coverImage[0].path
}
if (!avatarLocalPath) {
    
    throw new apiError(400,"Avatar file is required")
}

const avatar=await uploadOnCloudinary(avatarLocalPath)
const coverImage=await uploadOnCloudinary(coverImageLocalPath)

if(!avatar)
    {
    throw new apiError(400,"Avatar file is required")
   
}
 const user= await User.create({
    fullName,
    avatar:avatar.url,
    coverImage:coverImage?.url || "",
     email,
     password,
     username:username.toLowerCase()
})
const createdUser = await User.findById(user._id).select(
    "-password -refreshToken"
)
if(!createdUser){
    throw new apiError(500 ,"something went wrong while registerring user ")
}

return res.status(201).json(
    
        new  apiResponse(200,createdUser,"user register sucessfully")
    
)
})
export {registerUser}