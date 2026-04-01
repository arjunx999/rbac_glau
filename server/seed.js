import mongoose from 'mongoose';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import User from './models/user.js';
import './models/subject.js';
import './models/marks.js';

dotenv.config();

const seedUsers = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to database for seeding...");

    // Clear existing users
    await User.deleteMany({});
    console.log("Cleared existing users.");

    const salt = await bcrypt.genSalt(10);
    
    const demoUsers = [
      {
        name: 'Admin User',
        email: 'admin@test.com',
        password: await bcrypt.hash('admin123', salt),
        role: 'ADMIN'
      },
      {
        name: 'Faculty User',
        email: 'faculty@test.com',
        password: await bcrypt.hash('faculty123', salt),
        role: 'FACULTY'
      },
      {
        name: 'Student User',
        email: 'student@test.com',
        password: await bcrypt.hash('student123', salt),
        role: 'STUDENT'
      }
    ];

    const insertedUsers = await User.insertMany(demoUsers);
    console.log("Demo users seeded successfully!");

    const admin = insertedUsers.find(u => u.role === 'ADMIN');
    const faculty = insertedUsers.find(u => u.role === 'FACULTY');
    const student = insertedUsers.find(u => u.role === 'STUDENT');

    // Create a Subject and assign to Faculty
    const Subject = mongoose.model('Subject');
    const subject = await Subject.create({
      name: 'Computer Science',
      facultyId: faculty._id
    });
    console.log("Subject 'Computer Science' created and assigned to Faculty.");

    // Create Marks for Student in that Subject
    const Marks = mongoose.model('Marks');
    await Marks.create({
      studentId: student._id,
      subjectId: subject._id,
      marks: 85,
      updatedBy: faculty._id
    });
    console.log("Initial marks (85) seeded for Student.");
    
    process.exit(0);
  } catch (error) {
    console.error("Error seeding database:", error);
    process.exit(1);
  }
};

seedUsers();
