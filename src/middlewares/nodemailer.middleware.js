import crypto from 'crypto'
import nodemailerConfig from '../utils/nodemailer.js'
import  {User} from '../models/user.model.js' 
import { apiError } from '../utils/apiError.js'

export const sendOtp=async(email)=>{
    const otp=crypto.randomInt(1000,9999).toString()

    if (!email) {
        throw new apiError(400,"email required ")
        
    }
   
   

const otpExpire=Date.now()+15*60*1000

const user=await User.findOne({email})
if (!user) {
    throw new apiError(400,"user not found")
    
}

user.otp=otp
user.otpExpire=otpExpire
await user.save()

const mailOption={
    from:process.env.EMAIL,
    to:email,
    subject:"your otp code",
    text:`you one timme password id ${otp} is valid for 15 mins `
}
 await nodemailerConfig.sendMail(mailOption)

}
export const verifyOtp=async(email,otp)=>{
    if (!(email && otp)) {
        throw new apiError(400,"email required ")
    }
    const user=await User.findOne({email})
    if(!user){
        throw new apiError(404,"user not found")
    }
 if(user.otp!==otp){
    throw new apiError(401,"invalid otp")
 }

 if(user.otpExpire<Date.now()){
    throw new apiError(401,"your otp expired")
 }
 user.otp=undefined,
 user.otpExpire=undefined
 await user.save()

}