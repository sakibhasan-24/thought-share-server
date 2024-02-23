import express from "express";
import { verifyToken } from "../helper/verifyToken.js";
import { createPost, getPosts } from "../controller/post.controller.js";

const router = express.Router();

router.post("/create-post", verifyToken, createPost);
router.get("/get-posts", getPosts);
export default router;
