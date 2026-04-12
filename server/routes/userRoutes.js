import {
  getAllUsers,
  createUser,
  deleteUser,
  updateUser,
} from "../controllers/userController.js";
import express from "express";
import { verifyToken } from "../middleware/auth.js";
import authorize from "../middleware/authorize.js";

const router = express.Router();

router.use(verifyToken, authorize("ADMIN"));

router.get("/", getAllUsers);

router.post("/create-user", createUser);

router.patch("/:id", updateUser);

router.delete("/:id", deleteUser);

export default router;
