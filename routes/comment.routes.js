import express from "express";
import { verifyToken } from "../helper/verifyToken.js";
import {
  createComment,
  deleteComment,
  editComment,
  getAllComments,
  getComments,
  likeAction,
} from "../controller/comment.controller.js";

const router = express.Router();

router.post("/create", verifyToken, createComment);
router.get("/getComments/:postId", getComments);
router.get("/getAllComments/:id", verifyToken, getAllComments);
router.put("/likeAction/:commentId", verifyToken, likeAction);
router.put("/edit/comment/:commentId", verifyToken, editComment);
router.delete("/delete/comment/:commentId", verifyToken, deleteComment);

export default router;
