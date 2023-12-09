// A subscriber is a user who has opted to subscribe to new available timeslots and potentially other news from a clinic.
// A subscriber shall have email, array of clinics hen subscribes to and a userID as a foreign key.
const mongoose = require('mongoose')
const Schema = mongoose.Schema

const subscriberSchema = new Schema({});

module.exports = mongoose.model('subscriber', subscriberSchema)