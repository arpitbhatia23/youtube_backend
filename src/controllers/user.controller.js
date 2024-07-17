import { asynchandler} from "../utils/asyncHandler.js"

import {apiError} from '../utils/apiError.js'
import {User} from "../models/user.model.js"
import {deleteOnCloudninary, uploadOnCloudinary} from "../utils/cloudinary.js"
import { apiResponse } from "../utils/apiResponse.js"
import jwt from 'jsonwebtoken'
import { request } from "express"
import mongoose from "mongoose"
const generateAccessTokenAndRefreshToken=async(userID)=>{
    try {
      const user=  await User.findById(userID)
     const accessToken=  user.generateAccessToken()
      const refreshToken=  user.generateRefreshToken()
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
    avatar:{
        url:avatar.url,
        public_id:avatar.public_id
    },
    coverimage:{
        url:coverImage?.url|| "",
        public_id:coverImage?.public_id
    }, 
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
if(!username && !email){
    throw new apiError(400,"username or email is requried")
}
const user=await User.findOne({$or: [{email},{username}] })
if(!user){
    throw new apiError(400,"user not exit")
}

const isPasswordVaild=await user.isPasswordcorrect(password)
 if(!isPasswordVaild){
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
    const user = await User.findById(req.user?._id)
const isPasswordCorrect=await user.isPasswordcorrect(oldPassword)
if(!isPasswordCorrect){
    throw new apiError(401,"Invalid Old password")
}
user.password=newPassword
user.save({validateBeforeSave:false})
return res.status(200)
.json(new apiResponse(200,{},"password change successfully")) 


})
// current user
const getCurrentUser=asynchandler(async(req,res)=>{
    return res 
    .status(200)
    .json(new apiResponse(200,req.user,"current user fetched succesfully"))
})
// update user details
const UpdateAccountDetails=asynchandler(async(req,res)=>{
    const {fullName,email}=req.body 
    if(!(fullName || !email)){
        throw new apiError(400,"all field  required")
    }
  const user= await  User.findByIdAndUpdate(
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
    return res.status(200)
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
            avatar:{
                url:avatar.url,
                public_id:avatar.public_id
            }
        }
    },{new:true}).select("-password")
   deleteOnCloudninary(req.user?.avatar.public_id)
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
  const user=  await User.findByIdAndUpdate(req.user?._id,{
        $set:{
            coverimage:{
                url:coverImage.url|| "",
                public_id:coverImage.public_id
            }, 
        }
    },{new:true}).select("-password")
    deleteOnCloudninary(req.user?.coverimage.public_id)

    return res.status(200)
    .json(new apiResponse(200,user,"coverimage updated"))
})

const getUserChannelProfile=asynchandler(async(req,res)=>{
    const {username}=req.params
if(username===username){
    throw new apiError(400,"username is missing")
}
 const channel=  await User.aggregate([
    {
        $match:{
            username:username?.toLowerCase()
        }
    },
    {
        $lookup:{
            from:"subscriptions",
            localField:'_id',
            foreignField:"channel",
            as:"subscribers"

        }
    },
    {
        $lookup:{
            from:"subscriptions",
            localField:"_id",
            foreignField:"subscriber",
            as:"subscribedTO"
        }
    },
    {
        $addFields:{
            subscriberCount:{
                $size:"$subscribers"
            },
            channelSubscribedToCount:{
                $size:"$subscribedTO"
            },
            isSubscribed:{
                $cond:{
                    if:{$in:[req.user?._id,"$subscribers.subscriber"]},
                    then:true,
                    else:false,
                }
            }
        }
    },
    {
        $project:{
            fullName:1,
            username:1,
            subscriberCount:1,
            channelSubscribedToCount:1,
            isSubscribed:1,
            avatar:1,
            coverimage:1,
            email:1,
        }
    }

])
if(!channel?.length){
    throw new apiError(404,"channel doesn't exit")
} 
return res
     .status(200)   
     .json(new apiResponse(200,channel[0],"user channel fetched successfully"))

})
const getWatchHistory=asynchandler(async(req,res)=>{
const user=await User.aggregate([
    {
        $match:{
            _id:new mongoose.Types.ObjectId(req.user._id)
        }
    },
    {
        $lookup:{
            from :"videos",
            localField:"watchHistory",
            foreignField:"_id",
            as:"watchHistory",
            pipeline:[{
                $lookup:{
                    from:"users",
                    localField:"owner",
                    foreignField:"_id",
                    as:"owner",
                    pipeline:[
                        {
                            $project:{
                                fullName:1,
                                username:1,
                                avatar:1,
                            }
                        },
                        {
                          $addFields:{
                                owner:{
                                    $first:"$owner"
                                }
                            }
                        }
                    ]
                }
            }]
        }
    }
])

return res.status(200)
          .json(
            new apiResponse(200,user[0].watchhistory,
                "watchHistory fetch sucessfully"
            )
          )
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
    updateUserCoverImage,
    getUserChannelProfile,
    getWatchHistory
}