import { apiError } from "../utils/apiError.js";
import { asynchandler } from "../utils/asyncHandler.js";
import { User } from "../models/user.model.js";
import jwt from 'jsonwebtoken'
export const verifyJwt=asynchandler(async(req,res,next)=>{
  try {
    const token=  req.cookies?.accessToken || req.header('Authorization')?.replace('Bearer ','')
    if(!token){
      throw new apiError(401,'unauthorized requrst')
    }

   const decodetokeninfo= jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)
  const user =await User.findById(decodetokeninfo?._id).select('-password -refreshToken')
  if(!user){
      throw new apiError(401,'invalid access token')
  }
  req.user=user
  } catch (error) {
    throw new apiError(401,error?.message || 'unauthorized requrst')
  }
next()
})