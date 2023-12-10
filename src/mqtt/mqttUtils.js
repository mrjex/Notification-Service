const mqtt = require("mqtt")
require('dotenv').config();
require('../controllers/emailController')
const {sendNewTimeslotsEmail} = require("../controllers/emailController");

const mqttOptions = {
    host: process.env.MQTT_HOST,
    port: process.env.MQTT_PORT,
    protocol: process.env.MQTT_PROTOCOL,
    username: process.env.MQTT_USERNAME,
    password: process.env.MQTT_PASSWORD
}
// Sync topics during integration
const subscriptionTopics = [
    'grp20/clinic/new/timeslot',
]

const client = mqtt.connect(mqttOptions)

client.on("message", (topic, message) => {
    console.log('Topic: ' + topic)
    console.log('Message received: ' + message)
    switch (topic) {
        case 'grp20/clinic/new/timeslot':
            sendNewTimeslotsEmail()
            break
        default:
            console.log('Unrecognised topic')
    }
})

client.on("connect", () => {
    console.log("Successfully connected to broker")
    client.subscribe(subscriptionTopics)
})

client.on("reconnect", () => {
    console.log("Reconnecting to broker...")
})

client.on("error", (error) => {
    console.error(error)
})

client.on("close", () => {
    console.log("Disconnected from broker")
})

module.exports = {client}