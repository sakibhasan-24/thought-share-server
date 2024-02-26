import express from "express";
import { verifyToken } from "../helper/verifyToken.js";
import {
  createComment,
  editComment,
  getComments,
  likeAction,
} from "../controller/comment.controller.js";

const router = express.Router();

router.post("/create", verifyToken, createComment);
router.get("/getComments/:postId", getComments);
router.put("/likeAction/:commentId", verifyToken, likeAction);
router.put("/edit/comment/:commentId", verifyToken, editComment);

export default router;
