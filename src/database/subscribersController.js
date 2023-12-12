require('dotenv').config()
const mongoose = require('mongoose')
const {dbClient} = require('./databaseClient')
const {publishResponse, formatResponse} = require('../mqtt/mqttResUtils')

const sub = require('./models/subscriber')

const dbName = process.env.DB_NAME // NotificationService

// --For devs-- Prove db connection with ping
async function connectToDB() {
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
// Gets which clinics a user is currently subscribed to
async function getSubscriber(message) {
    try {
        let parsedMessage = JSON.parse(message)
        const patient_ID = {patient_ID: parsedMessage.patient_ID}

        await dbClient.connect()
        console.log('Opened db connection')
        const db = dbClient.db(dbName)
        const collection = db.collection("Subscribers")
        const subscriber = await collection.findOne(patient_ID)
        console.log('Looking for subscriber')

        if (subscriber === null) { // Fail case no matching subscriber found
            const response = await formatResponse(parsedMessage, 404, 'Subscriber not found', 'sub not found')
            await publishResponse('grp20/res/subscriber/get', response)
        } else {                   // Success case, matching subscriber found
            parsedMessage.subscriber = subscriber
            const response = await formatResponse(parsedMessage, 200, null, 'sub found')
            await publishResponse('grp20/res/subscriber/get', response)
        }

    } catch (err) {
        console.error('GETSUBSCRIBER ERROR', err)
    } finally {
        await dbClient.close();
        console.log('Closed mongo connection')
    }
} 
// Subscribe patient to emails by adding them to the notification database.
async function subToEmails(message) {
    try {
        // const pay = message.toString()
        const parsedMessage = JSON.parse(message)
        
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
            const response = await formatResponse(parsedMessage, 400, 'Validation error', 'invalid document')
            await publishResponse('grp20/res/notification/sub', response) 
        }  else {
            console.log('Validation passed');
            
            const db = dbClient.db(dbName)
            const collection = db.collection("Subscribers")
            const document = await collection.insertOne(newSubscriber)
            console.log('Saving document')
            console.log('Save Succsesful, saved document:', document)
            parsedMessage.subscriber = document
            
            const response = await formatResponse(parsedMessage, 201, null, 'document saved')
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
        const collection = db.collection("Subscribers")
        const subscriber = await collection.findOneAndDelete(patient_ID)
        console.log('Looking for subscriber')

        if (subscriber === null) { // Fail case no matching subscriber found
            const response = await formatResponse(parsedMessage, 404, 'Subscriber not found', 'sub not found')
            console.log('Delete failed:', subscriber, response)
            await publishResponse('grp20/res/notification/unsub', response)
        } else {                   // Success case, matching subscriber found
            parsedMessage.subscriber = subscriber
            const response = await formatResponse(parsedMessage, 200, null, 'sub found')
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

module.exports = {connectToDB, subToEmails, unsubFromEmails, getSubscriber, getRecieverList}