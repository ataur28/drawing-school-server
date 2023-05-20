const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config()
const app = express();
const port = process.env.PORT || 5000;

// middleware
app.use(cors());
app.use(express.json());


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.ve1ztfj.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

async function run() {
    try {
        // Connect the client to the server	(optional starting in v4.7)
        await client.connect();

        const dollCollection = client.db('dollHouse').collection('dolls');

        app.get('/dolls', async (req, res) => {
            const cursor = dollCollection.find();
            const result = await cursor.toArray();
            res.send(result);
        })
        // need some data email data
        
        app.get('/dolls', async (req, res) => {
            // console.log(req.query.email);
            console.log(req.query.email);
            // const cursor = dollCollection.find();
            // const result = await cursor.toArray();
            // let query = {};
            // if(res.query?.email){
            //     query = {email: req.query.email}
            // }
            const result = await dollCollection.find().toArray();
            res.send(result);
        })

        app.get('/dolls/:id', async (req,res) =>{
            const id = req.params.id;
            const query = {_id: new ObjectId(id)}
            const result = await dollCollection.findOne(query);
            res.send(result);
        })

        app.post('/dolls', async (req, res) => {
            const doll = req.body;
            console.log('new doll', doll);
            const result = await dollCollection.insertOne(doll);
            res.send(result);
        })

        app.put('/dolls/:id', async(req, res)=>{
            const id = req.params.id;
            const updatedDoll = req.body;
            console.log(updatedDoll);
        })

        app.delete('/dolls/:id', async(req, res) =>{
            const id = req.params.id;
            console.log(id);
            const query = {_id: new ObjectId(id)}
            console.log(query);

            const result = await dollCollection.deleteOne(query);
            console.log(result);
            res.send(result);
        })



        // Send a ping to confirm a successful connection
        await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
        // Ensures that the client will close when you finish/error
        // await client.close();
    }
}
run().catch(console.dir);



app.get('/', (req, res) => {
    res.send('doll house is running')
})

app.listen(port, () => {
    console.log(`Doll House Server is running on port ${port}`)
})