import { register, login, getMe } from "../controllers/authController.js";
import express from "express";
import { verifyToken } from "../middleware/auth.js";
import authorize from "../middleware/authorize.js";

const router = express.Router();

router.post("/register", authorize("ADMIN"), verifyToken, register);

router.post("/login", login);

router.get("/get-user-details", verifyToken, getMe);

export default router;
