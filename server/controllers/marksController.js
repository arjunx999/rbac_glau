import Marks from "../models/marks.js";
import Subject from "../models/subject.js";
import User from "../models/user.js";

const isFacultyAssigned = async (facultyId, subjectId) => {
  const subject = await Subject.findById(subjectId);
  if (!subject) {
    return null;
  }
  return subject.facultyId?.toString() === facultyId.toString();
};

// admin + faculty + student
export const getMarksByStudent = async (req, res) => {
  try {
    const { studentId } = req.params;

    // student can only view their own marks
    if (req.user.role === "STUDENT" && req.user.userId !== studentId) {
      return res
        .status(403)
        .json({ message: "Access denied: not your records" });
    }

    const student = await User.findById(studentId);
    if (!student || student.role !== "STUDENT") {
      return res.status(404).json({ message: "Student not found" });
    }

    const marks = await Marks.find({ studentId })
      .populate("subjectId", "name")
      .populate("updatedBy", "name role");

    res.status(200).json({ count: marks.length, marks });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// admin + faculty
export const uploadMarks = async (req, res) => {
  try {
    const { studentId, subjectId, marks } = req.body;

    if (req.user.role === "FACULTY") {
      const assigned = await isFacultyAssigned(req.user.userId, subjectId);
      if (assigned === null) {
        return res.status(404).json({ message: "Subject not found" });
      }
      if (!assigned) {
        return res
          .status(403)
          .json({ message: "Access denied: not your subject" });
      }
    }

    const student = await User.findById(studentId);
    if (!student || student.role !== "STUDENT") {
      return res.status(404).json({ message: "Student not found" });
    }

    const mark = await Marks.create({
      studentId,
      subjectId,
      marks,
      updatedBy: req.user.userId,
    });

    res.status(201).json({ message: "Marks created successfully", mark });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

export const updateMark = async (req, res) => {
  try {
    const { marks } = req.body;

    const existing = await Marks.findById(req.params.id);
    if (!existing) {
      return res.status(404).json({ message: "Mark record not found" });
    }

    if (req.user.role === "FACULTY") {
      const assigned = await isFacultyAssigned(
        req.user.userId,
        existing.subjectId,
      );
      if (!assigned) {
        return res
          .status(403)
          .json({ message: "Access denied: not your subject" });
      }
    }

    existing.marks = marks;
    existing.updatedBy = req.user.userId;
    await existing.save();

    res
      .status(200)
      .json({ message: "Marks updated successfully", mark: existing });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// admin + faculty
export const deleteMark = async (req, res) => {
  try {
    const mark = await Marks.findByIdAndDelete(req.params.id);
    if (!mark) {
      return res.status(404).json({ message: "Mark record not found" });
    }

    res.status(200).json({ message: "Mark deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};
