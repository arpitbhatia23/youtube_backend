import { asynchandler} from "../utils/asyncHandler.js"

import {apiError} from '../utils/apiError.js'
import {User} from "../models/user.model.js"
import {uploadOnCloudinary} from "../utils/cloudinary.js"
import { apiResponse } from "../utils/apiResponse.js"
import jwt from 'jsonwebtoken'
import { request } from "express"
const generateAccessTokenAndRefreshToken=async(userID)=>{
    try {
        console.log(userID)
      const user=  await User.findById(userID)
     const accessToken=  user.generateAccessToken()
      const refreshToken=  user.generateRefreshToken()
      user.refreshToken=refreshToken
      

     await user.save({validateBeforeSave:false})
     console.log(user)

     return {accessToken,refreshToken}

    } catch (error) {
        console.log(500,'something went wrong while generating refresh and access token')
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
    console.log(400,"All fields are required")
   throw new apiError(400,"All fields are required")
}
const existedUser=await User.findOne({$or:[{username},{email}]})
if (existedUser) {
    console.log(409,"user already exist ")
    throw new apiError(409,"user already exist ")
}
const avatarLocalPath= req.files?.avatar[0]?.path;

let  coverImageLocalPath
 if (req.files && Array.isArray(req.files.coverImage) && req.files.coverImage.length > 0) {
    coverImageLocalPath = req.files.coverImage[0].path
}
if (!avatarLocalPath) {
    console.log(400,"Avatar file is required")
    throw new apiError(400,"Avatar file is required")
}

const avatar=await uploadOnCloudinary(avatarLocalPath)
const coverImage=await uploadOnCloudinary(coverImageLocalPath)

if(!avatar)
    {
        console.log(400,"Avatar file is required")
    throw new apiError(400,"Avatar file is required")
   
}
 const user= await User.create({
    fullName,
    avatar:avatar.url,
    coverimage:coverImage?.url || "",
     email,
     password,
     username:username.toLowerCase()
})
const createdUser = await User.findById(user._id).select(
    "-password -refreshToken"
)
if(!createdUser){
    console.log(500 ,"something went wrong while registerring user ")
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
if(!username && !email){
    console.log(400,"username or email is requried")
    throw new apiError(400,"username or email is requried")
}
const user=await User.findOne({$or: [{email},{username}] })
if(!user){
    console.log(400,"user not exit")
    throw new apiError(400,"user not exit")
}

const isPasswordVaild=await user.isPasswordcorrect(password)
 if(!isPasswordVaild){
    console.log(401,'Invalid user credentials')
    throw new apiError(401,'Invalid user credentials')
 }
 const {accessToken,refreshToken}=await generateAccessTokenAndRefreshToken(user._id)

 const loggedInUser= await User.findById(user._id).select('-password -refreshToken')
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
// logout
const logoutUser=asynchandler(async(req,res)=>{
   await User.findByIdAndUpdate(
        req.user._id,
        {
            $unset:{
                refreshToken:1,
                
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
     .clearCookie("accessToken",options)
     .clearCookie('refreshToken',options)
     .json(new apiResponse(200,{},'user logged out'))
})

// RefreshAccessToken controler
const refreshAccessToken=asynchandler(async(req,res)=>{
   const incomingRefreshToken= req.cookies.refreshToken || req.body.refreshToken
   if(!incomingRefreshToken){
    throw new apiError(401,"unauthorized request")
   }

   try {
    const decodedToken=jwt.verify(incomingRefreshToken ,
     process.env.REFRESH_TOKEN_SECRET
    )
   const user= User.findById(decodedToken?._id)
   if(!user){
     throw new apiError(401,"invalid refresh token")
   }
   if(incomingRefreshToken!==user?.refreshToken){
  throw new apiError(401,'refresh token is expired or used')
  
   }
   const options={
     httpOnly:true,
     secure:true
 
   }
  const{accessToken,refreshToken}= await generateAccessTokenAndRefreshToken(user._id)
   return res
   .status(200)
   .cookie("accessToken",accessToken,options)
   .cookie('refreshToken',refreshToken,options)
   .json(
     new apiResponse(200,{
          newRefreshToken:refreshToken,
         accessToken
     },
    "access token refresh")
   )
   } catch (error) {
    throw new apiError(401,error.message || "inavalid " )
    
   }
})

//change password 
const changeCurrentPassword=asynchandler(async(req,res)=>{
    const {oldPassword,newPassword}=req.body
 const user= await User.findById(req.user?._id) 
const isPasswordCorrect=await user.isPasswordcorrect(oldPassword)
if(!isPasswordCorrect){
    throw new apiError(401,"Invalid Old password")
}
user.password=newPassword
User.save({validateBeforeSave:false})
return res.status(200)
.json(new apiResponse(200,{},"password change successfully")) 


})
// current user
const getCurrentUser=asynchandler(async(req,res)=>{
    return res 
    .status(200)
    .json(new apiResponse(200,req.user,"current user fetched succesfully"))
})
// 
const UpdateAccountDetails=asynchandler(async(req,res)=>{
    const {fullName,email}=req.body 
    if(! fullName || !email){
        throw new apiError(400,"all field  required")
    }
  const user=  User.findByIdAndUpdate(
        req.user?._id,{
            $set:{
                fullName,
                email
            }
        },
        {
            new:true
        }
    ).select("-password ")
    return req.status(200)
    .json(new apiResponse(200,user,"account details updated succesfully"))
})
// update avatar
const updateAvatar=asynchandler(async(req,res)=>{
    const avatarLocalPath=req.file?.path
    if(!avatarLocalPath){
        throw new apiError(400,"avatar file is missing")

    }
    const avatar=await uploadOnCloudinary(avatarLocalPath)
    if(!avatar.url){
        throw new apiError(400,"Error while uploading password")
    }
  const user=  await User.findByIdAndUpdate(req.user?._id,{
        $set:{
            avatar:avatar.url
        }
    },{new:true}).select("-password")
    return res.status(200)
    .json(new apiResponse(200,user,"avatar updated"))
})


// update coverImage
const updateUserCoverImage=asynchandler(async(req,res)=>{
    const coverImageLocalPath=req.file?.path
    if (!coverImageLocalPath) {
        throw new apiError(400,"coverImage is missing")
        
    }
    const coverImage=await uploadOnCloudinary(coverImageLocalPath)
    if (!coverImage) {
    throw new apiError(400,"error while uploading image")
        
    }
  const user=  await User.findByIdAndUpdate(req.User?._id,{
        $set:{
            coverimage:coverImage
        }
    },{new:true}).select("-password")
    return res.status(200)
    .json(new apiResponse(200,user,"coverimage updated"))
})
export {
    registerUser,
    loginUSer,
    logoutUser,
    refreshAccessToken,
    changeCurrentPassword,
    getCurrentUser,
    UpdateAccountDetails,
    updateAvatar,
    updateUserCoverImage
}