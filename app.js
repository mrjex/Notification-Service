// The program initializes a mqtt client and connects attempts to connect it to a broker.
// The program initializes a mongo client and attempts to connect it, upon successful connection the db is pinged to prove connection.
// The program uses nodemailer to send an emails.
const {client} = require('./src/mqtt/mqttUtils')
const {dbClient, connectToDB} = require('./src/database/databaseHandler')

console.log(client.options)

connectToDB()
    .then(r => {
        console.log('Successful')
    })
    .catch(error => {
        console.log(error)
    })
