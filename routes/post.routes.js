import express from "express";
import { verifyToken } from "../helper/verifyToken.js";
import {
  createPost,
  deletePost,
  getPosts,
  updatePost,
} from "../controller/post.controller.js";

const router = express.Router();

router.post("/create-post", verifyToken, createPost);
router.get("/get-posts", getPosts);
router.put("/updatePost/:postId/:userId", verifyToken, updatePost);
router.delete("/deletePost/:postId/:userId", verifyToken, deletePost);
export default router;
