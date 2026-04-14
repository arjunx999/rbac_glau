import Subject from "../models/subject.js";
import User from "../models/user.js";
import Marks from "../models/marks.js";

// admin only
export const createSubject = async (req, res) => {
  try {
    const { name } = req.body;

    const subject = await Subject.create({ name });

    res.status(201).json({ message: "Subject created successfully", subject });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// admin + faculty only
export const getAllSubjects = async (req, res) => {
  try {
    const subjects = await Subject.find().populate("facultyId", "name email");

    res.status(200).json({ count: subjects.length, subjects });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// admin only
export const assignFaculty = async (req, res) => {
  try {
    const { facultyId } = req.body;

    const faculty = await User.findById(facultyId);
    if (!faculty) {
      return res.status(404).json({ message: "User not found" });
    }
    if (faculty.role !== "FACULTY") {
      return res.status(400).json({ message: "User is not a faculty" });
    }

    const subject = await Subject.findByIdAndUpdate(
      req.params.id,
      { facultyId },
      { new: true },
    ).populate("facultyId", "name email");

    if (!subject) {
      return res.status(404).json({ message: "Subject not found" });
    }

    const allStudents = await User.find({ role: "STUDENT" }).select("_id");
    const existingMarks = await Marks.find({ subjectId: subject._id }).select(
      "studentId",
    );
    const enrolledIds = new Set(
      existingMarks.map((m) => m.studentId.toString()),
    );

    const newEntries = allStudents
      .filter((s) => !enrolledIds.has(s._id.toString()))
      .map((s) => ({
        studentId: s._id,
        subjectId: subject._id,
        marks: 0,
        updatedBy: req.user.userId,
      }));

    if (newEntries.length > 0) {
      await Marks.insertMany(newEntries);
    }

    res.status(200).json({
      message: "Faculty assigned and students enrolled successfully",
      subject,
    });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// admin only
export const deleteSubject = async (req, res) => {
  try {
    const subject = await Subject.findByIdAndDelete(req.params.id);

    if (!subject) {
      return res.status(404).json({ message: "Subject not found" });
    }

    res.status(200).json({ message: "Subject deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};
