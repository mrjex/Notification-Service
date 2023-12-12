// EmailController provides methods to send emails
require('dotenv').config()
const {dbClient} = require('../database/databaseClient')

const {sendEmail} = require('./nodemailer')
const {getRecieverList} = require('../database/subscribersController')
const {newTimeslotsEmail} = require('./templates/newTimeslots.js')

const dbName = process.env.DB_NAME

async function sendNewTimeslotsEmail(topic) {
    try {
        const topics = topic.split('/')
        const clinic = topics.pop()
        console.log('CLINIC: ', clinic)

        receiverList = await getRecieverList(clinic)
        newTimeslotsEmail.to = receiverList
        await sendEmail(newTimeslotsEmail)
        console.log(newTimeslotsEmail)
    } catch (err) {
        console.error(err)
    }
}

module.exports = {
    sendNewTimeslotsEmail, getRecieverList
};