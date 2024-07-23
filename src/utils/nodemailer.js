import nodemailer, { createTransport } from 'nodemailer'

const nodemailerConfig= createTransport({
    service:"gmail",
    host:"smtp.gmail.com",
    secure:false,
    auth:{
        user:process.env.EMAIL,
        pass:process.env.EMAIL_PASSWORD

    }
    
})

export default nodemailerConfig