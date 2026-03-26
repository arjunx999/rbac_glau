import {
  createSubject,
  getAllSubjects,
  assignFaculty,
  deleteSubject,
} from "../controllers/subjectController.js";
import express from "express";
import { verifyToken } from "../middleware/auth.js";
import authorize from "../middleware/authorize.js";

const router = express.Router();

router.post("/create-subject", verifyToken, authorize("ADMIN"), createSubject);

router.get("/get-all-subjects", verifyToken, authorize("ADMIN", "FACULTY"), 
getAllSubjects);

router.patch("/:id/assign-faculty", verifyToken, authorize("ADMIN"), assignFaculty);

router.delete("/:id/delete-subject", verifyToken, authorize("ADMIN"), deleteSubject);

export default router;
