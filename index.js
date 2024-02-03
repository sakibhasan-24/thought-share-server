const express = require("express");
const jwt = require("jsonwebtoken");
const cors = require("cors");
const app = express();

app.use(cors());
app.use(express.json());
require("dotenv").config();
const port = process.env.PORT || 5000;
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");

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
      const header = req.headers.authorization;
      // console.log("verifyToken", header);
      if (!header) {
        return res
          .status(401)
          .send({ message: "unauthorized access from headers" });
      }
      const token = header.split(" ")[1];
      jwt.verify(token, process.env.ACCESS_TOKEN, (err, decoded) => {
        if (err) {
          return res
            .status(403)
            .send({ message: "unauthorized access from error" });
        }
        req.decoded = decoded;
        next();
      });
    };
    // root route
    app.get("/", async (req, res) => {
      res.send("blogs server is running");
    });

    // get user when log in only need email and photoURL
    //get all post
    // get only some post

    app.get("/posts", async (req, res) => {
      const order = req.query.order === "asc" ? 1 : -1;
      const limit = parseInt(req.query.limit) || 21;
      // console.log(limit);
      const startIndex = parseInt(req.query.startIndex) || 0;
      console.log(startIndex);
      const searchText = req.query.searchText || "";
      let filter = {};
      if (searchText) {
        filter = {
          $or: [
            { title: { $regex: searchText, $options: "i" } },
            { content: { $regex: searchText, $options: "i" } },
          ],
        };
      }
      // console.log("index", startIndex);
      const posts = await postsCollection
        .find(filter)
        .sort({ createdAt: order })
        .skip(startIndex)
        .limit(limit)
        .toArray();
      const totalPost = await postsCollection.estimatedDocumentCount();
      // console.log(totalPost);
      // Get the current date
      const currentDate = new Date();

      // Subtract one month from the current date
      const oneMonthAgo = new Date();
      oneMonthAgo.setMonth(currentDate.getMonth() - 1);

      // console.log(oneMonthAgo);
      // now get the last months post
      const lastMonthPost = postsCollection.find({
        createdAt: { $gte: oneMonthAgo },
      });
      res.send({ posts, totalPost, lastMonthPost });
    });
    // get single post by id
    app.get("/post/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const post = await postsCollection.findOne(query);
      res.send(post);
    });
    // delete a post by admin
    app.delete("/posts/:id", verifyToken, async (req, res) => {
      const user = req.decoded;
      // admin verfication next
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await postsCollection.deleteOne(query);
      res.send(result);
      // console.log(user.email);
    });

    // edit a post
    app.patch("/posts/edit/:id", verifyToken, async (req, res) => {
      const user = req.decoded;
      // admin verfication next
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const post = req.body;
      const updatedDoc = {
        $set: {
          title: post.title,
          category: post.category,
          content: post.content,
          image: post.image,
          createdAt: post.createdAt,
        },
      };
      const result = await postsCollection.updateOne(query, updatedDoc);
      res.send({ success: true, message: "post updated", result });
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
      console.log(data);
      const insertedData = { ...data, createdAt: new Date() };
      console.log("insertedData", insertedData);
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
