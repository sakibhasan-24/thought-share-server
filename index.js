const express = require("express");
const jwt = require("jsonwebtoken");
const cors = require("cors");
const app = express();

app.use(cors());
app.use(express.json());
require("dotenv").config();
const port = process.env.PORT || 5000;
const { MongoClient, ServerApiVersion } = require("mongodb");

const client = new MongoClient(process.env.MONGO_URI, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  // collections
  const usersCollection = client.db("blogs").collection("users");
  const postsCollection = client.db("blogs").collection("posts");
  //   end of collections
  try {
    // token create and save
    app.post("/jwt", async (req, res) => {
      const user = req.body;
      const token = jwt.sign(user, process.env.ACCESS_TOKEN);
      res.send({ token });
    });
    // end of token create and save
    // verify token
    const verifyToken = (req, res, next) => {
      const headers = req.header.authorization;
      console.log("verifyToken", headers);
      if (!headers) {
        return res.status(401).send({ message: "unauthorized access" });
      }
      const token = headers.split(" ")[1];
      jwt.verify(token, process.env.ACCESS_TOKEN, (err, decoded) => {
        if (err) {
          return res.status(403).send({ message: "unauthorized access" });
        }
        req.decoded = decoded;
        next();
      });
    };
    // root route
    app.get("/", async (req, res) => {
      res.send("blogs server is running");
    });

    // user route
    app.post("/users", async (req, res) => {
      const user = req.body;
      //   console.log(user);
      const existingUser = await usersCollection.findOne({ email: user.email });
      if (existingUser) {
        return res.send({ success: false, error: "User already exists" });
      }
      try {
        const result = await usersCollection.insertOne(user);
        res.send({ success: true, data: result, user });
      } catch (error) {
        res.send({ success: false, error: error.message });
      }
    });
    // end of user route
    // create a post

    app.post("/create-post", verifyToken, async (req, res) => {
      const data = req.body;
      const insertedData = { ...data, createdAt: new Date() };
      const result = await postsCollection.insertOne(insertedData);
      res.send(result);
    });
  } finally {
  }
}
run().catch(console.dir);
// app.get("/", (req, res) => res.send("Hello Blogs"));
app.listen(port, () => console.log(`port is running on ${port}!`));
//
