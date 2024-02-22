import express from "express";
import { deleteUser, updateUser } from "../controller/user.controller.js";
import { verifyToken } from "../helper/verifyToken.js";

const router = express.Router();

router.put("/update/:id", verifyToken, updateUser);
router.delete("/delete/:id", verifyToken, deleteUser);

export default router;
