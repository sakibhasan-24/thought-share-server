import express from "express";
import {
  deleteUser,
  getUsers,
  updateUser,
  userLogOut,
} from "../controller/user.controller.js";
import { verifyToken } from "../helper/verifyToken.js";

const router = express.Router();

router.get("/getUsers", verifyToken, getUsers);
router.put("/update/:id", verifyToken, updateUser);
router.delete("/delete/:id", verifyToken, deleteUser);
router.get("/logout/:id", userLogOut);

export default router;
