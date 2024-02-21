import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();
import cors from "cors";
// import userRoutes from "./routes/auth.routes.js";
import authRoutes from "./routes/auth.routes.js";
const app = express();
const port = process.env.PORT || 5000;
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: false,
  })
);
app.use(express.json());
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("DB connection successful");
  })
  .catch((error) => {
    console.log(error);
  });

app.use("/api/users", authRoutes);
app.listen(port, () => {
  console.log("my server is running");
});
app.get("/", (req, res) => {
  res.send("hello world");
});
