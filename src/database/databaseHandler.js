const {MongoClient} = require('mongodb');
require('dotenv').config();

const dbName = process.env.DB_NAME
const dbUser = process.env.DB_USER
const dbPassword = process.env.DB_PASSWORD
const dbCluster = process.env.DB_CLUSTER

const url = `mongodb+srv://${dbUser}:${dbPassword}@${dbCluster}/?retryWrites=true&w=majority`;

const dbClient = new MongoClient(url);

async function connectToDB() { // Proving db connection with a ping
    try {
        await dbClient.connect()
        await dbClient.db(dbName).command({ping: 1});
        console.log("Pinged your deployment. You successfully connected to MongoDB!");

    } finally {
        // Ensures that the client will close when you finish/error
        await dbClient.close();
        console.log('Closed mongo connection')
    }
}

module.exports = {dbClient, connectToDB}