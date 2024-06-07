import mongoose, { Schema } from "mongoose";
import jwt from "jsonwebtoken"
import bcrypt from "bcrypt"
const userSchema= new Schema({
    username:{
              type:String,
              required:true,
              unique:true,
              lowercase:true,
              trim:true,
              index:true,
    },
    email:{
        type:String,
        required:true,
        unique:true,
        lowercase:true,
        trim:true,
    },
    fullname:{
        type:String,
        required:true,
        lowercase:true,
        trim:true,
    },
    avatar:{
        type:String,//cloudinary url
        required:true,
        
    },
    coverimage:{
        type:String,
        
    },
    watchhistory:[{
        type:Schema.Types.ObjectId,
        ref:"Video"
    }],
    password:{
        type:String,
        required:[true,"password is required"]
    },
    refreshtoken:{
        type:String
    }
},{timestamps:true})
userSchema.pre("save",async function(next) {
    if(!this.isModified("password")) return next();
    this.password=bcrypt.hash(this.password,10)
    next()
}) 
userSchema,methods.isPasswordcorrect=async function(password) {
   return await bcrypt.compare(password,this.password)

}
export const User=mongoose.model("User",userSchema)