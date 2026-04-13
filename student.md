# Student Page Summary & Technical Documentation

This document provides a comprehensive technical overview of the **Student**-related functionality in the RBAC (Role-Based Access Control) system, covering both frontend and backend architectures, the tech stack, and the end-to-end data flow.

---

## **1. Tech Stack Overview**

### **Frontend (Client)**
- **React 19**: Core UI library for building dynamic components.
- **Vite**: Modern build tool for fast development and bundling.
- **Tailwind CSS**: Utility-first CSS framework for responsive and modern styling.
- **Lucide React**: High-quality SVG icon library for visual representation.
- **Axios**: Promise-based HTTP client for API communication.
- **React Router Dom**: For client-side routing and protected navigation.
- **JWT-Decode**: To decode authentication tokens on the client side.

### **Backend (Server)**
- **Node.js & Express**: JavaScript runtime and web framework for the API.
- **MongoDB & Mongoose**: NoSQL database and Object Data Modeling (ODM) library.
- **JSON Web Tokens (JWT)**: For secure, stateless authentication and role-based authorization.
- **Bcryptjs**: For secure password hashing and comparison.
- **Dotenv**: For environment variable management.
- **CORS**: To enable cross-origin resource sharing between the client and server.

---

## **2. Frontend Architecture: The Student Experience**

The student functionality is split into two views: the **Student's Personal Dashboard** and the **Admin's Management Table**.

### **A. Student Dashboard (`StudentDashboard.jsx`)**
Located at `client/src/pages/Student/StudentDashboard.jsx`, this page is the central hub for logged-in students.
- **Dynamic Profile Rendering**: It displays a personalized welcome message using the user's name and email stored in the `AuthContext`.
- **Performance Analytics**: A dedicated section calculates the student's **Overall Average** in real-time by reducing the array of marks fetched from the API.
- **Academic Performance Table**:
    - Uses `useEffect` to trigger a data fetch from the `/marks/get-marks/:studentId` endpoint.
    - Renders a responsive table showing **Subject Name**, **Marks (out of 100)**, **Date Recorded**, and **Pass/Fail Status** (marks >= 40 is 'Passed').
- **Error & Loading States**: Includes an animated spinner for loading and fallback text if no records are found.

### **B. Admin's Student Management (`StudentTable.jsx`)**
Located at `client/src/components/Admin/StudentTable.jsx`, this component allows admins to manage student accounts.
- **Credential Visibility**: Admins can toggle password visibility for any student, which is helpful for troubleshooting login issues.
- **CRUD Integration**:
    - **Edit**: Opens a modal to update the student's profile (Name, Email, or Password).
    - **Delete**: Removes the student account from the system after confirmation.
    - **Manage Marks**: Links directly to the `MarksModal.jsx` for adding or updating academic records.

---

## **3. Backend Architecture: Data & Security**

The backend is structured to ensure that student data is secure and only accessible to authorized users.

### **A. Data Models (Mongoose Schemas)**
- **User Model (`user.js`)**:
    - Fields: `name`, `email`, `password` (hashed), `role` (enum: "STUDENT", "FACULTY", "ADMIN").
    - Indexing: `email` is unique and lowercased for efficient lookup.
- **Marks Model (`marks.js`)**:
    - Fields: `studentId` (ref: 'User'), `subjectId` (ref: 'Subject'), `marks` (number), `updatedBy` (ref: 'User').
    - This model links students to their scores across different subjects.

### **B. Controllers & Logic**
- **User Controller (`userController.js`)**:
    - `getAllUsers`: Fetches all users, which the frontend filters to display only those with the `STUDENT` role.
    - `updateUser`: Securely updates student details, including re-hashing the password if it's changed.
- **Marks Controller (`marksController.js`)**:
    - `getMarksByStudent`: Retrieves all mark records for a specific student and uses `.populate('subjectId')` to include subject names in the response.

### **C. API Routes & Security**
- **Routes**: Defined in `userRoutes.js` and `marksRoutes.js`.
- **Middleware**:
    - `verifyToken`: Validates the JWT in the request header.
    - `authorize('ADMIN', 'STUDENT')`: Ensures that only an Admin or the student themselves can access the `getMarksByStudent` route.

---

## **4. The Process: Data Flow & Interaction**

1.  **Authentication**: A student logs in via `Login.jsx`. The server issues a JWT containing their `userId` and `role`.
2.  **Authorization**: The frontend `ProtectedRoute` checks the role. If it's `STUDENT`, it allows navigation to `/student`.
3.  **API Communication**: The `StudentDashboard` calls the backend. The `api.js` interceptor automatically attaches the JWT to the request header.
4.  **Backend Processing**:
    - The server verifies the token and the student's role.
    - It queries the MongoDB database for marks matching the `studentId`.
    - It "populates" the subject data to provide human-readable names.
5.  **UI Rendering**: The frontend receives the JSON response, updates the state, and triggers a re-render to show the student's performance data.

---

## **5. Key File References**

- **Frontend Core**:
    - [StudentDashboard.jsx](file:///c:/Users/ARJUN%20SINGH/Desktop/p1/rbac_glau/client/src/pages/Student/StudentDashboard.jsx)
    - [StudentTable.jsx](file:///c:/Users/ARJUN%20SINGH/Desktop/p1/rbac_glau/client/src/components/Admin/StudentTable.jsx)
    - [AuthContext.jsx](file:///c:/Users/ARJUN%20SINGH/Desktop/p1/rbac_glau/client/src/context/AuthContext.jsx)
- **Backend Core**:
    - [userController.js](file:///c:/Users/ARJUN%20SINGH/Desktop/p1/rbac_glau/server/controllers/userController.js)
    - [marksController.js](file:///c:/Users/ARJUN%20SINGH/Desktop/p1/rbac_glau/server/controllers/marksController.js)
    - [userRoutes.js](file:///c:/Users/ARJUN%20SINGH/Desktop/p1/rbac_glau/server/routes/userRoutes.js)
    - [marksRoutes.js](file:///c:/Users/ARJUN%20SINGH/Desktop/p1/rbac_glau/server/routes/marksRoutes.js)
