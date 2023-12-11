require('dotenv').config()
const mongoose = require('mongoose')
const {dbClient} = require('../database/databaseClient')
const {publishResponse, formatResponse} = require('../mqtt/mqttResUtils')

const sub = require('../database/models/subscriber')

const dbName = process.env.DB_NAME // NotificationService

async function connectToDB() { // Proving db connection with a ping for devs
    try {
        await dbClient.connect()
        await dbClient.db(dbName).command({ping: 1});
        console.log("Pinged your deployment. You successfully connected to MongoDB!")

    } finally {
        // Ensures that the client will close when you finish/error
        await dbClient.close();
        console.log('Closed mongo connection')
    }
}
// Subscribe patient to emails by adding them to the notification database.
async function subToEmails(message) {
    try {
        const pay = message.toString()
        const parsedMessage = JSON.parse(pay)
        
        await dbClient.connect()
        console.log('Opened db connection')

        const newSubscriber = new sub({
            patient_ID: parsedMessage.patient_ID,
            email: parsedMessage.email,
            clinic: parsedMessage.clinic
        })
        const validationError = newSubscriber.validateSync()

        if (validationError) {
            console.error(validationError)
            const response = await formatResponse(parsedMessage, '400', 'Validation error')
            await publishResponse('grp20/res/notification/sub', response) 
        }  else {
            console.log('Validation passed');
            
            const db = dbClient.db(dbName)
            const collection = db.collection("Subscribers") // Reference the collection in the specified database
            const document = await collection.insertOne(newSubscriber)
            console.log('Save Succsesful, saved document:', document)

            const response = await formatResponse(parsedMessage, '201')
            await publishResponse('grp20/res/notification/sub', response)
        }

    } catch (err) {
        console.error('SUBTOEMAIL ERROR', err)
    } finally {
        await dbClient.close()
        console.log('Closed mongo connection')
    }
}
// Unsubscribe a patient from emails by deleting them from the notification database.
async function unsubFromEmails(message) {
    try {
        const parsedMessage = JSON.parse(message)
        const patient_ID = {patient_ID: parsedMessage.patient_ID}

        await dbClient.connect()
        console.log('Opened db connection')
        const db = dbClient.db(dbName)
        const collection = db.collection("Subscribers") // Reference the collection in the specified database
        const subscriber = await collection.findOneAndDelete(patient_ID)

        if (subscriber === null) { // Fail case no matching subscriber found
            const response = await formatResponse(parsedMessage, '404', 'Subscriber not found')
            console.log('Delete failed:', subscriber, response)
            await publishResponse('grp20/res/notification/unsub', response)
        } else {                   // Success case, matching subscriber found
            const response = await formatResponse(parsedMessage, '200')
            console.log('Delete successful', subscriber, response)
            await publishResponse('grp20/res/notification/unsub', response)
        }
    } catch (err) {
        console.error('UNSUBFROMEMAIL ERROR', err)
    } finally {
        await dbClient.close();
        console.log('Closed mongo connection')
    }

}

module.exports = {connectToDB, subToEmails, unsubFromEmails}