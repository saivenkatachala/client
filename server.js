const express = require('express');
const cors = require('cors');
const { MongoClient, ObjectId } = require('mongodb');

const app = express();
app.use(express.json());
app.use(cors());

// MongoDB connection URI
const uri = "mongodb+srv://saivenkat:saivenkat@cluster10.cpz1vqf.mongodb.net/?retryWrites=true&w=majority&appName=Cluster10";

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function connectToMongo() {
    try {
        await client.connect();
        console.log('Connected to MongoDB');
    } catch (error) {
        console.error('Failed to connect to MongoDB', error);
    }
}

connectToMongo();

const db = client.db("amountmom");
const col1 = db.collection("data1");

app.post('/add_member', async (req, res) => {
    try {
        console.log(req.body);
        await col1.insertOne(req.body);
        res.send(req.body);
    } catch (error) {
        console.error(error);
        res.status(500).send('Error adding member');
    }
});

app.get('/members', async (req, res) => {
    try {
        const members = await col1.find().toArray();
        res.send(members);
    } catch (error) {
        console.error(error);
        res.status(500).send('Error fetching members');
    }
});

app.get('/member/:chittiNumber', async (req, res) => {
    try {
        const { chittiNumber } = req.params;
        const members = await col1.find({ chittiNumber: parseInt(chittiNumber) }).toArray();
        res.send(members);
    } catch (error) {
        console.error(error);
        res.status(500).send('Error fetching members by chitti number');
    }
});

app.put('/update_member/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const updatedData = req.body;
        await col1.updateOne({ _id: new ObjectId(id) }, { $set: updatedData });
        res.send('Member updated successfully');
    } catch (error) {
        console.error(error);
        res.status(500).send('Error updating member');
    }
});

app.delete('/delete_member/:id', async (req, res) => {
    try {
        const { id } = req.params;
        await col1.deleteOne({ _id: new ObjectId(id) });
        res.send('Member deleted successfully');
    } catch (error) {
        console.error(error);
        res.status(500).send('Error deleting member');
    }
});

app.listen(8081, () => {
    console.log('Server started on port 8081');
});
