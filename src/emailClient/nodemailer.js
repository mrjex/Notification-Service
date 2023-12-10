const nodemailer = require('nodemailer')
require('dotenv').config();

console.log('RUNNING NODEMAILER')

const transporter = nodemailer.createTransport({ // NOTE: Be sure to check out the smtp and security settings for your email
    host: process.env.SMTP_HOST,                           //       I had some issues getting emails identified as spam by the receiving server.
    secureConnection: false,
    port: process.env.SMTP_PORT,
    service : process.env.EMAIL_SERVICE,
    auth : {
        user : process.env.EMAIL_USERNAME,
        pass : process.env.EMAIL_PASSWORD
    },
    tls: {
        ciphers:'SSLv3'
    }
})

const options = {
    from : process.env.EMAIL_SENDER,
    to: "Placeholder@mail.com", // placeholder
    subject: "Nodemailer Test", // placeholder
    text: "This is a test email to test nodemailer" // placeholder
}

transporter.sendMail(options, (error, info) =>{
    if(error) console.log(error)
    else console.log(info)
})