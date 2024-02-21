import express from "express";
import { userSignUp } from "../controller/auth.controller.js";

const router = express.Router();

router.post("/signup", userSignUp);

export default router;
