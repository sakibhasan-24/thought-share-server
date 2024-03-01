import express from "express";
import {
  deleteUser,
  getRequestUser,
  getUser,
  getUsers,
  updateUser,
  userLogOut,
  userRequest,
  handleRequest,
} from "../controller/user.controller.js";
import { verifyToken } from "../helper/verifyToken.js";

const router = express.Router();

router.get("/getUsers", verifyToken, getUsers);
router.get("/getUser/:userId", getUser);
router.put("/update/:id", verifyToken, updateUser);
router.delete("/delete/:id", verifyToken, deleteUser);
router.get("/logout/:id", userLogOut);
router.put("/adminRequest/:userId", verifyToken, userRequest);
router.put("/requestHandle", verifyToken, handleRequest);
router.get("/requestUser", verifyToken, getRequestUser);

export default router;
