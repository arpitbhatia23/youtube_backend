import { asynchandler} from "../utils/asyncHandler.js"

import {apiError} from '../utils/apiError.js'
import {User} from "../models/user.model.js"
import {uploadOnCloudinary} from "../utils/cloudinary.js"
import { apiResponse } from "../utils/apiResponse.js"

const generateAccessTokenAndRefreshToken=async(userID)=>{
    try {
      const user=  await User.findById(userID)
     const accessToken= user.generateAccessToken()
      const refreshToken=user.generateRefreshToken()
      user.refreshToken=refreshToken
     await user.save({validateBeforeSave:false})
   
     return {accessToken,refreshToken}

    } catch (error) {
       throw new apiError(500,'something went wrong while generating refresh and access token') 
    }
}

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

// login

const loginUSer=asynchandler(async(req,res)=>{
// get user data from frontend 
// validation {not empty}
// find username or check password match in database
//if match return acess token or refresh token 
// send cookies

const {email,username,password}=req.body
if(!username || !email){
    throw apiError(400,"username or email is requried")
}
const user=await User.findOne({$or: [{email},{username}] })
if(!user){
    throw apiError(400,"user not exit")
}

const isPasswordVaild=await user.isPasswordcorrect(password)
 if(!isPasswordVaild){
    throw apiError(401,'Invalid user credentials')
 }
 const {accessToken,refreshToken}=await generateAccessTokenAndRefreshToken(user._id)

 const loggedInUser=User.findById(user._id).select('-password -refreshToken')
 const options={
    httpOnly:true,
    secure:true
 }
 return res
 .status(200)
 .cookie('accessToken',accessToken,options)
 .cookie('refreshToken',refreshToken,options)
 .json(
    new apiResponse(200,{
        user: loggedInUser,accessToken,refreshToken,
        
    },'user logged in sucessfully')
 )


})
const logoutUser=asynchandler(async(req,res)=>{
   await User.findById(
        req.user._id,
        {
            $set:{
                refreshToken:undefined
            }
        },
        {
            new:true
        }
    )
    const options={
        httpOnly:true,
        secure:true
     }
     return res.status(200)
     .clearCookie("accesstoken",options)
     .clearCookie('refreshToken',options)
     .json(new apiResponse(200,{},'user logged out'))
})


export {
    registerUser,
    loginUSer,
    logoutUser
}