import express from "express"
import cookieParser from "cookie-parser"
import cors from 'cors'
import YAML from "yamljs"
import SwaggerUi from "swagger-ui-express"
const app = express()

app.use(cors({
    origin:process.env.CORS_ORIGIN,
    Credential:true
}))
app.use(express.json({limit:"16kb"}))
app.use(express.urlencoded({extended:true, limit:"16kb"}))
app.use(express.static("public"))
app.use(cookieParser())



// routes import
import userRouter from "./routes/user.routes.js"
import videoRouter from "./routes/video.routes.js"
import healthCheckRouter from "./routes/healthcheck.routes.js"
import likeRouter from "./routes/like.routes.js"
import commentRouter from "./routes/comment.routes.js"
import playlistRouter from "./routes/playlist.routes.js"
import tweetRouter from "./routes/tweet.routes.js"
import subscriptionRouter from "./routes/subscription.routes.js"
import dashboardRouter from"./routes/dashboard.routes.js"
//routes decleration
app.use("/api/v1/users",userRouter)
app.use("/api/v1/videos",videoRouter)
app.use("/api/v1/",healthCheckRouter)
app.use("/api/v1/likes",likeRouter)
app.use("/api/v1/comment",commentRouter)
app.use("/api/v1/playlist",playlistRouter)
app.use("/api/v1/tweet",tweetRouter)
app.use("/api/v1/subscription",subscriptionRouter)
app.use("/api/v1/dashboard",dashboardRouter)
import path from "path"
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const swaggerdoc=YAML.load(path.join(__dirname,"./swagger.yaml"))
app.use("/",SwaggerUi.serve,SwaggerUi.setup(swaggerdoc)
)
export {app}