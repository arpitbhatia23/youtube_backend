import { app } from "./app.js";
import connectDB from "./db/index.js";
  

connectDB()
.then(()=>{
    app.listen(process.env.PORT || 8000, ()=> {
        console.log(`server is runing at port ${process.env.PORT}`)
    })
})
.catch((err)=>{
    console.log("connection failded !!!",err)
})













// import express from 'express'
// const app = express()
// ;(async()=>{
//     try {
//         await mongoose.connect(`${process.env.MONGODB_URL}/${DB_NAME}`)
//         app.on("error",(error)=>{
//             console.log("err",error);
//             throw error
//         })
//         app.listen(process.env.PORT,()=>{
//             console.log(`app is listening on port ${process.env.PORT}`)
//         })
//     } catch (error) {
//         console.error("error",error)
//     }
// })()