import User from "../models/user.js";
import bcrypt from "bcryptjs";

// admin only
export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({}).select("-password");

    res.status(200).json({ count: users.length, users });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// admin only
export const createUser = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;
    console.log("CreateUser payload:", { name, email, role });

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      console.log("User already exists with email:", email);
      return res.status(409).json({ message: "Email already in use" });
    }

    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role,
    });
    console.log("User created successfully in DB:", user._id);

    res.status(201).json({
      message: "User created successfully",
      user: {
        _id: user._id,
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (err) {
    console.error("Backend createUser error:", err.message);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// admin only
export const deleteUser = async (req, res) => {
  try {
    // admin should not accidently delete himself
    if (req.params.id === req.user.userId) {
      return res.status(403).json({ message: "Admin cannot be deleted" });
    }

    const user = await User.findByIdAndDelete(req.params.id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({ message: "User deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};
