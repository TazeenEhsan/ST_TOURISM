const express = require('express')
const { MongoClient } = require('mongodb');
require('dotenv').config();
const cors = require('cors')

const ObjectId = require('mongodb').ObjectId;

const app = express();

const port = process.env.PORT || 5000;


app.use(cors());
app.use(express.json());


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.rmgka.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });


async function run() {
    try {
        await client.connect();
        const database = client.db('stTour');
        const servicesCollection = database.collection('services');
        const ordersCollection = database.collection('orders');

        // GET API
        // Get all services/packages
        app.get('/services', async (req, res) => {
            const cursor = servicesCollection.find({});
            const services = await cursor.toArray();
            res.send(services);
        });
        // Get all orders
        app.get('/orders', async (req, res) => {
            const cursor = ordersCollection.find({});
            const orders = await cursor.toArray();
            res.send(orders);
        });

        // Get single service
        app.get('/services/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const user = await servicesCollection.findOne(query);
            // console.log('load user with id: ', id);
            res.send(user);
        })

        // Get single order
        app.get('/orders/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const user = await ordersCollection.findOne(query);
            // console.log('load user with id: ', id);
            res.send(user);
        })

        // POST API
        // Post Single service/packages
        app.post('/services', async (req, res) => {
            const newService = req.body;
            const result = await servicesCollection.insertOne(newService);
            // console.log('got new user', newService);
            // console.log('added user', result);
            res.json(result);
        });
        //Post Single order
        app.post('/orders', async (req, res) => {
            const newOrder = req.body;
            const result = await ordersCollection.insertOne(newOrder);
            // console.log('got new user', newOrder);
            // console.log('added user', result);
            res.json(result);
        });

        //UPDATE API
        // Update Single Order 
        app.put('/orders/:id', async (req, res) => {
            const id = req.params.id;
            const updatedUser = req.body;
            // console.log('updating req', updatedUser)
            const filter = { _id: ObjectId(id) };
            const options = { upsert: true };
            const updateDoc = {
                $set: {
                    userName: updatedUser.userName,
                    serviceName: updatedUser.serviceName,
                    address: updatedUser.address,
                    phone: updatedUser.phone,
                    status: updatedUser.status

                },
            };
            const result = await ordersCollection.updateOne(filter, updateDoc, options)
            // console.log('updating', id)
            res.json(result)
        })

        // // DELETE  API
        //Delete Single Order
        app.delete('/orders/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await ordersCollection.deleteOne(query);

            // console.log('deleting user with id ', result);
            res.json(result);
        });
    }
    finally {
        // await client.close();
    }
}
run().catch(console.dir);

app.get('/', (req, res) => {
    res.send('Running ST Tours & Travels');
});


app.listen(port, () => {
    console.log('ST Tours & Travels running at', port);
})

// Done