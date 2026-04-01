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

router.get(
  "/",
  verifyToken,
  authorize("ADMIN", "FACULTY"),
  (_req, res) => {
    res.status(405).json({ message: "Use /api/marks/:studentId to fetch marks" });
  },
);

router.get(
  "/:studentId",
  verifyToken,
  authorize("ADMIN", "FACULTY", "STUDENT"),
  getMarksByStudent,
);

router.post("/", verifyToken, authorize("ADMIN", "FACULTY"), uploadMarks);

router.put("/:id", verifyToken, authorize("ADMIN", "FACULTY"), updateMark);

router.delete("/:id", verifyToken, authorize("ADMIN"), deleteMark);

router.get("/get-marks/:studentId", verifyToken, authorize("ADMIN", "FACULTY", "STUDENT"), getMarksByStudent);

router.post("/upload-marks", verifyToken, authorize("ADMIN", "FACULTY"), uploadMarks);

router.patch("/update-marks/:id", verifyToken, authorize("ADMIN", "FACULTY"), updateMark);

router.delete("/delete-marks/:id", verifyToken, authorize("ADMIN"), deleteMark);

export default router;
