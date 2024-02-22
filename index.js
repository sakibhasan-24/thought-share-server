import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";

import cookieParser from "cookie-parser";
dotenv.config();
import cors from "cors";
// import userRoutes from "./routes/auth.routes.js";
import authRoutes from "./routes/auth.routes.js";
import userRoutes from "./routes/user.routes.js";
const app = express();
app.use(cookieParser());
const port = process.env.PORT || 5000;

app.use(
  cors({
    // origin: ["http://localhost:5173", "https://api.imgbb.com"],
    // origin: "http://localhost:5173 https://api.imgbb.com",
    // origin: ["http://localhost:5173"],
    // origin: true,
    origin: ["http://localhost:5173"],
    credentials: true,
  })
);
// console.log(`https://api.imgbb.com/1/upload?key=${process.env.IMAGE_HOISTING}`);

app.use(express.json());
// console.log(cookieParser);

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("DB connection successful");
  })
  .catch((error) => {
    console.log(error);
  });

app.use("/api/users", authRoutes);
app.use("/api/users", userRoutes);
app.listen(port, () => {
  console.log("my server is running");
});
app.get("/", (req, res) => {
  res.send("hello world");
});
