// EmailController provides methods to send emails
const {sendEmail} = require('./nodemailer')
const {newTimeslotsEmail} = require('./templates/newTimeslots.js')

async function sendNewTimeslotsEmail() {
    try {
        await sendEmail(newTimeslotsEmail)
    } catch (err) {
        console.error(err)
    }
}

module.exports = {
    sendNewTimeslotsEmail
};