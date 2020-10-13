const express = require('express')
require('dotenv').config()
const MongoClient = require('mongodb').MongoClient;
const cors = require('cors')
const bodyParser = require('body-parser')
const port = 5000

// middleware 
const app = express()
app.use(bodyParser.json());
app.use(cors());

app.get('/', (req, res) => {
    res.send('Welcome to Creative Agency Server Side')
})

const uri = `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@cluster0.449nt.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
    const serviceCollection = client.db(`${process.env.DB_NAME}`).collection(`${process.env.DB_COLLECTION_1}`);
    const feedbackCollection = client.db(`${process.env.DB_NAME}`).collection(`${process.env.DB_COLLECTION_2}`);
    const messageCollection = client.db(`${process.env.DB_NAME}`).collection(`${process.env.DB_COLLECTION_3}`);

    // add service post method
    app.post('/addService', (req, res) => {
        service = req.body;
        serviceCollection.insertOne(service)
            .then(result => {
                res.send(result.insertedCount > 0)
            })
    })

    // service get method
    app.get('/services', (req, res) => {
        serviceCollection.find({})
            .toArray((err, documents) => {
                res.send(documents);
            })
    })

    // feedback post method
    app.post('/insertFeedback', (req, res) => {
        feedback = req.body;
        feedbackCollection.insertMany(feedback)
            .then(result => {
                res.send(result.insertedCount > 0)
            })
    })

    // feedback get method
    app.get('/feedbacks', (req, res) => {
        feedbackCollection.find({})
            .toArray((err, documents) => {
                res.send(documents);
            })
    })

    // store message in database
    app.post('/privateMessage', (req, res) => {
        message = req.body;
        messageCollection.insertOne(message)
            .then(result => {
                res.send(result.insertedCount > 0)
            })
    })

    console.log('database connected');
});


app.listen(process.env.PORT || port, () => {
    console.log(`App listening at http://localhost:${port}`)
})