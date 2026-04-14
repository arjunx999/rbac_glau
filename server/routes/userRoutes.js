import {
  getAllUsers,
  createUser,
  deleteUser,
} from "../controllers/userController.js";
import express from "express";
import { verifyToken } from "../middleware/auth.js";
import authorize from "../middleware/authorize.js";

const router = express.Router();

router.use(verifyToken);

router.get("/", authorize("ADMIN", "FACULTY"), getAllUsers);

router.post("/create-user", authorize("ADMIN"), createUser);

router.delete("/:id", authorize("ADMIN"), deleteUser);

export default router;
