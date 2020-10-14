const express = require('express')
require('dotenv').config()
const MongoClient = require('mongodb').MongoClient;
const cors = require('cors')
const bodyParser = require('body-parser');
const  ObjectId  = require('mongodb').ObjectId;
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
    const customerOrdersCollection = client.db(`${process.env.DB_NAME}`).collection(`${process.env.DB_COLLECTION_4}`);
    const adminCollection = client.db(`${process.env.DB_NAME}`).collection(`${process.env.DB_COLLECTION_5}`);

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
        feedbackCollection.insertOne(feedback)
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

    // store customer order in database
    app.post('/placeOrder', (req, res) => {
        order = req.body;
        console.log(order)
        customerOrdersCollection.insertOne(order)
            .then(result => {
                res.send(result.insertedCount > 0)
            })
    })

    // fetch customer order from database
    app.get('/customerOrders', (req, res) => {
        const email = req.query.email
        adminCollection.find({ email: email })
            .toArray((err, admin) => {
                const filter = {}
                if (admin.length === 0) {
                    filter.email = email
                }
                customerOrdersCollection.find(filter)
                    .toArray((err, documents) => {
                        res.send(documents);
                    })
            })

    })

    // make new admin
    app.post('/makeAdmin', (req, res) => {
        newAdmin = req.body
        adminCollection.insertOne(newAdmin)
            .then(result => {
                res.send(result.insertedCount > 0)
            })
    })

    // specified admin or user 
    app.get('/isAdmin', (req, res) => {
        adminCollection.find({ email: req.query.email })
            .toArray((err, documents) => {
                res.send(documents.length > 0)
            })
    })

    app.patch('/update/:id', (req, res) => {
        customerOrdersCollection.updateOne({_id: ObjectId(req.params.id)},
            {
                $set: {status: req.body.status}
            })
            .then(result => {
                res.send(result.modifiedCount > 0)
            })
    })

    console.log('database connected');
});

app.listen(process.env.PORT || port, () => {
    console.log(`App listening at http://localhost:${port}`)
})