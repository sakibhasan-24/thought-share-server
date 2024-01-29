const express = require("express");
const app = express();
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
  try {
    console.log("connected");
  } finally {
  }
}
run().catch(console.dir);
app.get("/", (req, res) => res.send("Hello Blogs"));
app.listen(port, () => console.log(`port is running on ${port}!`));
//
