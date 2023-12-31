const express = require("express");
const cors = require("cors");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const app = express();
const prot = process.prot || 5000;
require("dotenv").config();

app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_NAME}:${process.env.DB_PASS}@cluster0.wjgws1x.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    // await client.connect();
    // Send a ping to confirm a successful connection
    const internshipTaskCollection = client.db("DevTown_Internship_Task").collection("brand_name");
    const usersDataCollection = client.db("DevTown_Internship_Task").collection("users_data");
    const mobileProdackCollection = client.db("DevTown_Internship_Task").collection("Mobile_Prodack");
    const buyNowCollection = client.db("DevTown_Internship_Task").collection("Buy_Now");

    //  ---------------------------------Mobile API---------------------------------------
    app.get("/mobile", async (req, res) => {
      const result = await mobileProdackCollection.find().toArray();
      res.send(result);
    });
    app.delete("/mobile/delete/:id", async (req, res) => {
      const id = req.params.id;
      const filter = {_id: new ObjectId(id)}
      console.log(id, filter);
      const result = await mobileProdackCollection.deleteOne(filter)
      res.send(result)
    });
    app.get("/brand/mobile/:brandName", async (req, res) => {
      const brandName = req.params.brandName;
      const filter = { brand_name: brandName };
      const result = await mobileProdackCollection.find(filter).toArray();
      res.send(result);
    });
    //  ---------------------------------Buy Now  API---------------------------------------
    // Admin buy now data
    app.get("/allbuynow", async(req, res)=>{
      const result = await buyNowCollection.find().toArray()
      res.send(result)
    })
    app.patch("/allbuynow/confirm", async(req, res)=>{
      const id = req.query.id;
      const filter = {_id: new ObjectId(id)}
      const options = { upsert: true };
      const updatedDoc = {
        $set:{
          state: "Confirm"
        }
      }
      const result = await buyNowCollection.updateMany(filter, updatedDoc, options)
      res.send(result)
    })
    app.patch("/allbuynow/rejected", async(req, res)=>{
      const id = req.query.id;
      const filter = {_id: new ObjectId(id)}
      const options = { upsert: true };
      const updatedDoc = {
        $set:{
          state: "Rejected"
        }
      }
      const result = await buyNowCollection.updateMany(filter, updatedDoc, options)
      res.send(result)
    })
    //user buy now data
    app.get("/buynow", async(req, res)=>{
      const email = req.query.email;
      const query = {user_email: email}
      const result = await buyNowCollection.find(query).toArray()
      res.send(result)
    })
    app.delete('/buynow/delete/:id', async(req, res)=>{
      const id = req.params.id;
      const filter = {_id: new ObjectId(id)}
      const result = await buyNowCollection.deleteOne(filter)
      res.send(result)

    })
    
    app.post("/buynow", async(req, res)=>{
    const result = await buyNowCollection.insertOne(req.body) 
    res.send(result)
    })
    //  ---------------------------------Brand  API---------------------------------------
    app.get("/brand", async (req, res) => {
      const result = await internshipTaskCollection.find().toArray();
      res.send(result);
    });
    //  ---------------------------------Users  API---------------------------------------
    app.get("/usersdata", async(req, res)=>{
      const result = await usersDataCollection.find().toArray();
      res.send(result)
    })
    app.delete('/usersdata/delete/:id', async(req, res)=>{
      const id = req.params.id;
      const filter = {_id: new ObjectId(id)}
      const result = await usersDataCollection.deleteOne(filter)
      res.send(result)

    })
    app.put('/usersdata/updated', async(req, res)=>{
      const id = req.query.id;
      const filter = {_id: new ObjectId(id)}
      const data = req.body;
      const updatedDoc = {
        $set: {
          roll: "Admin",
          photo: data.photo,
          name: data.name,
          email: data.email
        }
      }
      const result = await usersDataCollection.updateOne(filter,updatedDoc)
      res.send(result)

    })
    app.post("/usersdata", async (req, res) => {
      const query = { email: req.body.email };
      const existingUser = await usersDataCollection.findOne(query);
      if (existingUser) {
        return res.send({ message: "user alredy exists", insertedId: null });
      }
      const result = await usersDataCollection.insertOne(req.body);
      res.send(result);
    });
    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

app.get("/", async (req, res) => {
  res.send("Full stack Developer Hiring task");
});
app.listen(prot, () => {
  console.log(`Full stack Developer Hiring task server prot : ${prot}`);
});
