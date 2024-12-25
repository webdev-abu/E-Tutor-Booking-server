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
    const bookCollection = bd.collection("booked-tutor");

    // Save a tutorsData in DB
    app.post("/add-tutorial", async (req, res) => {
      const tutorData = req.body;
      console.log(tutorData);
      const result = await tutorsCollection.insertOne(tutorData);
      res.send(result);
    });

    app.get("/my-tutorials/:userEmail", async (req, res) => {
      const userEmail = req.params.userEmail;
      const query = { email: userEmail };
      const result = await tutorsCollection.find(query).toArray();
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

    // Book Tutorial with New Book Collection
    app.post("/booked-tutorial", async (req, res) => {
      const bookData = req.body;
      const result = await bookCollection.insertOne(bookData);
      res.send(result);
    });

    // get all booked posted by a specific user from db
    app.get("/booked-tutorial/:email", async (req, res) => {
      const email = req.params.email;
      const query = { user_email: email };
      const result = await bookCollection.find(query).toArray();
      res.send(result);
    });

    app.patch("/update-review/:tutorId", async (req, res) => {
      const tutorId = req.params.tutorId;
      console.log(tutorId);
      const query = { _id: new ObjectId(tutorId) };
      const options = { upsert: false };
      const updateDoc = {
        $inc: { reviews: 1 },
      };
      const result = await tutorsCollection.updateOne(
        query,
        updateDoc,
        options
      );
      res.send(result);
    });
    // get all tutors posted by a specific category tutors from db
    // app.get("/booked-tutorial/:id", async (req, res) => {
    //   const id = req.params.id;
    //   console.log(id);
    //   const query = { _id: new ObjectId(id) };
    //   const result = await tutorsCollection.findOne(query);
    //   // const result = await tutorsCollection.find(query).toArray();
    //   res.send(result);
    // });

    // Delete tutor from tutors collection
    app.delete("/delete-tutorial/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await tutorsCollection.deleteOne(query);
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
