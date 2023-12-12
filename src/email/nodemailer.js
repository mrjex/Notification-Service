const nodemailer = require('nodemailer')
require('dotenv').config();

/* Note:
   It is hard to predict the amount of emails that are sending, currently it won't be any significant amount
   Therefore I have chosen to create a transport connection whenever a sendEmail() is called rather than
   having a continuous open connection. There might be a case for pooling and having connections open at
   a later stage.
 */
async function sendEmail(options) {
    const transporter = nodemailer.createTransport({ // NOTE: Be sure to check out the smtp and security settings for your email
        host: process.env.SMTP_HOST,                           //       I had some issues getting emails identified as spam by the receiving server.
        secureConnection: false,
        port: process.env.SMTP_PORT,
        service: process.env.EMAIL_SERVICE,
        auth: {
            user: process.env.EMAIL_USERNAME,
            pass: process.env.EMAIL_PASSWORD
        },
        tls: {
            ciphers: 'SSLv3'
        }
    })
    transporter.sendMail(options, (error, info) => {
        if (error) console.log(error)
        else console.log(info)
    })
}

module.exports = {
    sendEmail
}