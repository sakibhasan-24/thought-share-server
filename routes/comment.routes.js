import express from "express";
import { verifyToken } from "../helper/verifyToken.js";
import {
  createComment,
  getComments,
} from "../controller/comment.controller.js";

const router = express.Router();

router.post("/create", verifyToken, createComment);
router.get("/getComments/:postId", getComments);

export default router;
