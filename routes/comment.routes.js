import express from "express";
import { verifyToken } from "../helper/verifyToken.js";
import {
  createComment,
  getComments,
  likeAction,
} from "../controller/comment.controller.js";

const router = express.Router();

router.post("/create", verifyToken, createComment);
router.get("/getComments/:postId", getComments);
router.put("/likeAction/:commentId", verifyToken, likeAction);

export default router;
