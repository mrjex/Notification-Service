// EmailController provides methods to send emails
require('dotenv').config()
const {dbClient} = require('../database/databaseClient')

const {sendEmail} = require('./nodemailer')
const {newTimeslotsEmail} = require('./templates/newTimeslots.js')

const dbName = process.env.DB_NAME

// Returns an array of patients subscribed to a clinic
async function getRecieverList(clinic){
    let receiverList = []
    try {
        const filter = { clinic: { $eq: clinic } }
        
        await dbClient.connect()
        console.log('Opened db connection')
        const db = dbClient.db(dbName)
        const collection = db.collection("Subscribers")
        const subscribers = collection.find(filter) // returns cursor
        console.log('Looking for subscribers')
        
        for await (const doc of subscribers) {
            receiverList.push(doc.email)
          }
          console.log(receiverList)
          return receiverList
    } catch(err) {
        console.error(err)
    } finally {
        await dbClient.close();
        console.log('Closed mongo connection')
    }
}

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