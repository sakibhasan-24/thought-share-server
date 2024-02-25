import express from "express";
import { verifyToken } from "../helper/verifyToken.js";
import { createComment } from "../controller/comment.controller.js";

const router = express.Router();

router.post("/create", verifyToken, createComment);

export default router;
