import express from "express";
import { verifyToken } from "../helper/verifyToken.js";
import { createPost } from "../controller/post.controller.js";

const router = express.Router();

router.post("/create-post", verifyToken, createPost);
export default router;
