// EmailController provides methods to send emails
require('dotenv').config()
const { DateTime } = require("luxon");
const {sendEmail} = require('./nodemailer')
const {getRecieverList} = require('../database/subscribersController')
const {newTimeslotsEmail} = require('./templates/newTimeslots.js')
const {bookingConfirmationEmail} = require('./templates/bookingConfirmation')
const {bookingCancellationEmail} = require('./templates/bookingCancellation')
const { getPatient, getDentist } = require('../apiRequests/userRequests')
const { getClinic } = require('../apiRequests/clinicRequests')


async function sendNewTimeslotsEmail(topic) {
    try {
        const topics = topic.split('/')
        const clinic = topics.pop()
        console.log('CLINIC: ', clinic)
        
        let email = await JSON.parse(JSON.stringify(newTimeslotsEmail))
        email.html = email.html.replace('[clinic]', clinic)

        receiverList = await getRecieverList(clinic)
        email.to = receiverList
        await sendEmail(email)
        console.log(email)
    } catch (err) {
        console.error(err)
    }
}

async function sendBookingNotificationEmail(topic, message) {
    try {
        message =  JSON.parse(message)

        const patient = await getPatient(message.appointment.patient_id)
        const dentist =  await getDentist(message.appointment.dentist_id)
        const clinic = '' // await getClinic() TODO: Implement get clinic by id from clinic service, currently out of function. 
        let start = DateTime.fromISO(message.appointment.start_time).toFormat('yy-MM-dd HH:mm')
        let end = DateTime.fromISO(message.appointment.end_time).toFormat('yy-MM-dd HH:mm')
        let email
        
        if(topic  === 'grp20/req/booking/confirmation') {
            email =  await JSON.parse(JSON.stringify(bookingConfirmationEmail))
        } else {
            email =  await JSON.parse(JSON.stringify(bookingCancellationEmail))
        }
            email.html = email.html.replace('[patient]', patient.username).replace('[dentist]', dentist.username)
                                   .replace('[clinic]', clinic.clinic).replace('[location]', clinic.location)
                                   .replace('[start_time]', start).replace('[end_time]', end)
            email.to = patient.email + ', ' + dentist.email
    
        await sendEmail(email)
        console.log(email)
    } catch (err) {
        console.error(err)
    }
}

module.exports = {
    sendNewTimeslotsEmail, sendBookingNotificationEmail
};