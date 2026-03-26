import { register, login, getMe } from "../controllers/authController.js";
import express from "express";
import { verifyToken } from "../middleware/auth.js";

const router = express.Router();

router.post("/register", register);

router.post("/login", login);

router.get("/get-user-details", verifyToken, getMe);

export default router;
