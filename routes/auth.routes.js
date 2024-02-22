import express from "express";
import {
  googleLogIn,
  userLogin,
  userSignUp,
} from "../controller/auth.controller.js";

const router = express.Router();

router.post("/signup", userSignUp);
router.post("/login", userLogin);
router.post("/google", googleLogIn);

export default router;
