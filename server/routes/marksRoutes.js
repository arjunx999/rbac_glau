import {
  getMarksByStudent,
  uploadMarks,
  updateMark,
  deleteMark,
} from "../controllers/marksController.js";
import express from "express";
import { verifyToken } from "../middleware/auth.js";
import authorize from "../middleware/authorize.js";

const router = express.Router();

router.get("/get-marks/:studentId", verifyToken, authorize("ADMIN", "STUDENT"), getMarksByStudent);

router.post("/upload-marks", verifyToken, authorize("ADMIN", "FACULTY"), uploadMarks);

router.patch("/update-marks/:id", verifyToken, authorize("ADMIN", "FACULTY"), updateMark);

router.delete("/delete-marks/:id", verifyToken, authorize("ADMIN"), deleteMark);

export default router;