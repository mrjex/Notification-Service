const mqtt = require("mqtt")
require('dotenv').config();
require('../email/emailController')
const {sendNewTimeslotsEmail} = require("../email/emailController");
const {connectToDB, subToEmails, unsubFromEmails, getSubscriber} = require('../database/databaseController')

const mqttOptions = {
    host: process.env.MQTT_HOST,
    port: process.env.MQTT_PORT,
    protocol: process.env.MQTT_PROTOCOL,
    username: process.env.MQTT_USERNAME,
    password: process.env.MQTT_PASSWORD
}
// Sync topics during integration
// add req and res
const subscriptionTopics = [
    'grp20/clinic/new/timeslot',
    'grp20/req/notification/sub',
    'grp20/req/notification/unsub',
    'grp20/req/subscriber/get'
]

const client = mqtt.connect(mqttOptions)

client.on("message", (topic, message) => {
    console.log('Topic: ' + topic)
    console.log('Message received: ' + message)
    switch (topic) {
        case 'grp20/clinic/new/timeslot':
            sendNewTimeslotsEmail()
            break
        case 'grp20/req/notification/sub':
            subToEmails(message)
            break
        case 'grp20/req/notification/unsub':
            unsubFromEmails(message)
            break
        case 'grp20/req/subscriber/get':
            getSubscriber(message)
            break
        default:
            console.log('Unrecognised topic')
            connectToDB()
    }
})

client.on("connect", () => {
    console.log("Req client Successfully connected to broker")
    client.subscribe(subscriptionTopics)
})

client.on("reconnect", () => {
    console.log("Req client Reconnecting to broker...")
})

client.on("error", (error) => {
    console.error(error)
})

client.on("close", () => {
    console.log("Req client Disconnected from broker")
})

module.exports = {client}