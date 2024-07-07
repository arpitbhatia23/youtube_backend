const asynchandler =(fn)=>async(req,res,next)=>{
    try {
        await fn(req,res,next)
    } catch (error) {
        console.log(error)
        res.status(error.code||500).json({
            success:false,
            message:error.message
            
        })
    }
}



export {asynchandler}