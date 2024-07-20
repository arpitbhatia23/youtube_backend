import {asynchandler} from '../utils/asyncHandler.js'
import {apiResponse} from "../utils/apiResponse.js"

const healthchecker=asynchandler(async(req,res)=>{

    return res.status(200)
    .json(new apiResponse(200,{},"system health is good"))
})
export {healthchecker}