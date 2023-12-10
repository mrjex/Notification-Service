const mqtt = require("mqtt")
require('dotenv').config();

const mqttOptions = {
    host: process.env.MQTT_HOST,
    port: process.env.MQTT_PORT,
    protocol: process.env.MQTT_PROTOCOL,
    username: process.env.MQTT_USERNAME,
    password: process.env.MQTT_PASSWORD
}

const client = mqtt.connect(mqttOptions)

client.on("message", (topic, message) => {
    console.log('Topic ' + topic)
    console.log('Message received ' + message)
})

client.on("connect", () => {
    console.log("Succesfully connected to broker")
    client.subscribe('grp20/test/')
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