const express = require("express");
const cors = require("cors");
const { MongoClient, ServerApiVersion, Db, ObjectId } = require("mongodb");
require("dotenv").config();

const port = process.env.PORT || 5000;
const app = express();

app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@nabenducluster.rpwkxww.mongodb.net/?retryWrites=true&w=majority&appName=NabenduCluster`;

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
    const bd = client.db("E-TutorDB");
    const tutorsCollection = bd.collection("tutors");

    // Save a tutorsData in DB
    app.post("/add-tutors", async (req, res) => {
      const tutorData = req.body;
      console.log(tutorData);
      const result = await tutorsCollection.insertOne(tutorData);
      res.send(result);
    });

    // get all tutors from db
    app.get("/tutors", async (req, res) => {
      const result = await tutorsCollection.find().toArray();
      res.send(result);
    });

    app.get("/tutors/category", async (req, res) => {
      // const category = req.query.category;
      const query = tutorsCollection.find().limit(9);
      const result = await query.toArray();
      res.send(result);
    });

    // get all tutors posted by a specific category tutors from db
    app.get("/find-tutors/:category", async (req, res) => {
      const category = req.params.category;

      const query = { category: category };
      const result = await tutorsCollection.find(query).toArray();
      res.send(result);
    });

    //  get a single tutor from tutors collection
    app.get("/tutor-detail/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await tutorsCollection.findOne(query);
      res.send(result);
    });

    // Delete tutor from tutors collection
    app.delete("/job/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await jobsCollection.deleteOne(query);
      res.send(result);
    });

    // updated jobs collection
    app.put("/update-job/:id", async (req, res) => {
      const jobData = req.body;
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const updateJob = {
        $set: jobData,
      };
      const options = { upsert: true };
      const result = await jobsCollection.updateOne(query, updateJob, options);
      res.send(result);
    });

    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
    // Ensures that the client will close when you finish/error
  }
}
run().catch(console.dir);
app.get("/", (req, res) => {
  res.send("Hello from E-Tutor Server....");
});

app.listen(port, () => console.log(`Server running on port ${port}`));
