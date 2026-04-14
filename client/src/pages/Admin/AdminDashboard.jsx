import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import api from "../../services/api";
import {
  Users,
  UserPlus,
  RefreshCcw,
  Search,
  ShieldCheck,
  User as UserIcon,
  GraduationCap,
  LayoutDashboard,
} from "lucide-react";

// Import New Components
import StudentTable from "../../components/Admin/StudentTable";
import FacultyTable from "../../components/Admin/FacultyTable";
import UserModal from "../../components/Admin/UserModal";
import MarksModal from "../../components/Admin/MarksModal";
import SubjectModal from "../../components/Admin/SubjectModal";

const AdminDashboard = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  // Modals State
  const [userModal, setUserModal] = useState({
    open: false,
    mode: "student",
    user: null,
  });
  const [marksModal, setMarksModal] = useState({ open: false, student: null });
  const [subjectModal, setSubjectModal] = useState({
    open: false,
    faculty: null,
  });

  const currentPath = location.pathname;

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const response = await api.get("/users");
      setUsers(response.data.users || []);
      setError("");
    } catch (err) {
      setError("Failed to fetch users");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteUser = async (userId) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;
    try {
      await api.delete(`/users/${userId}`);
      await fetchUsers();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to delete user");
    }
  };

  const handleUserSubmit = async (formData) => {
    try {
      if (userModal.user) {
        // Backend lacks specific update route in userRoutes.js, but user insisted on calling existing UPDATE API.
        // We'll use PATCH /users/:id as a standard practice.
        await api.patch(`/users/${userModal.user._id}`, formData);
        alert("User updated successfully!");
      } else {
        await api.post("/users/create-user", formData);
        alert("User created successfully!");
      }
      await fetchUsers();
      setUserModal({ ...userModal, open: false, user: null });
    } catch (err) {
      console.error("Submit error:", err);
      alert(
        err.response?.data?.message ||
          "Failed to process user request. Note: The backend update route might be missing.",
      );
    }
  };

  const filteredUsers = users.filter(
    (u) =>
      u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.email.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const students = filteredUsers.filter((u) => u.role === "STUDENT");
  const faculty = filteredUsers.filter((u) => u.role === "FACULTY");

  const renderContent = () => {
    if (currentPath === "/admin/students") {
      return (
        <div className="space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
            <div>
              <h2 className="text-3xl font-black text-gray-900 tracking-tight flex items-center gap-2">
                <GraduationCap className="text-indigo-600" size={32} />
                Student Management
              </h2>
              <p className="text-gray-500 font-medium">
                View and manage student records and marks.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <div className="relative">
                <Search
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                  size={18}
                />
                <input
                  type="text"
                  placeholder="Search students..."
                  className="pl-10 pr-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none w-full md:w-64 transition shadow-sm"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <button
                onClick={() =>
                  setUserModal({ open: true, mode: "student", user: null })
                }
                className="px-4 py-2 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition shadow-lg shadow-indigo-200 flex items-center gap-2 font-semibold whitespace-nowrap"
              >
                <UserPlus size={18} />
                Add Student
              </button>
              <button
                onClick={fetchUsers}
                className="p-2.5 text-gray-500 hover:bg-gray-100 bg-white border border-gray-200 rounded-xl transition shadow-sm"
                title="Refresh Data"
              >
                <RefreshCcw
                  size={20}
                  className={loading ? "animate-spin" : ""}
                />
              </button>
            </div>
          </div>
          <StudentTable
            students={students}
            onEdit={(u) => setUserModal({ open: true, mode: "edit", user: u })}
            onDelete={handleDeleteUser}
            onManageMarks={(u) => setMarksModal({ open: true, student: u })}
          />
        </div>
      );
    }

    if (currentPath === "/admin/faculty") {
      return (
        <div className="space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
            <div>
              <h2 className="text-3xl font-black text-gray-900 tracking-tight flex items-center gap-2">
                <ShieldCheck className="text-blue-600" size={32} />
                Faculty Management
              </h2>
              <p className="text-gray-500 font-medium">
                Manage faculty assignments and subjects.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <div className="relative">
                <Search
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                  size={18}
                />
                <input
                  type="text"
                  placeholder="Search faculty..."
                  className="pl-10 pr-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none w-full md:w-64 transition shadow-sm"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <button
                onClick={() =>
                  setUserModal({ open: true, mode: "faculty", user: null })
                }
                className="px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition shadow-lg shadow-blue-200 flex items-center gap-2 font-semibold whitespace-nowrap"
              >
                <UserPlus size={18} />
                Add Faculty
              </button>
              <button
                onClick={fetchUsers}
                className="p-2.5 text-gray-500 hover:bg-gray-100 bg-white border border-gray-200 rounded-xl transition shadow-sm"
                title="Refresh Data"
              >
                <RefreshCcw
                  size={20}
                  className={loading ? "animate-spin" : ""}
                />
              </button>
            </div>
          </div>
          <FacultyTable
            faculty={faculty}
            onEdit={(u) => setUserModal({ open: true, mode: "edit", user: u })}
            onDelete={handleDeleteUser}
            onManageSubjects={(u) =>
              setSubjectModal({ open: true, faculty: u })
            }
          />
        </div>
      );
    }

    // Default: Overview Dashboard
    return (
      <div className="space-y-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-black text-gray-900 tracking-tight">
              Admin Dashboard
            </h1>
            <p className="text-gray-500 font-medium">
              Manage your educational ecosystem efficiently.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="relative">
              <Search
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                size={18}
              />
              <input
                type="text"
                placeholder="Search across all users..."
                className="pl-10 pr-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none w-full md:w-64 transition shadow-sm"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <button
              onClick={fetchUsers}
              className="p-2.5 text-gray-500 hover:bg-gray-100 bg-white border border-gray-200 rounded-xl transition shadow-sm"
              title="Refresh Data"
            >
              <RefreshCcw size={20} className={loading ? "animate-spin" : ""} />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div
            onClick={() => navigate("/admin/students")}
            className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 hover:shadow-xl transition-all cursor-pointer group"
          >
            <div className="bg-indigo-50 w-16 h-16 rounded-2xl flex items-center justify-center text-indigo-600 mb-4 group-hover:scale-110 transition-transform">
              <GraduationCap size={32} />
            </div>
            <h3 className="text-xl font-bold text-gray-800">Students</h3>
            <p className="text-3xl font-black text-indigo-600 mt-2">
              {users.filter((u) => u.role === "STUDENT").length}
            </p>
            <p className="text-sm text-gray-400 mt-1 font-medium">
              Manage records and marks
            </p>
          </div>

          <div
            onClick={() => navigate("/admin/faculty")}
            className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 hover:shadow-xl transition-all cursor-pointer group"
          >
            <div className="bg-blue-50 w-16 h-16 rounded-2xl flex items-center justify-center text-blue-600 mb-4 group-hover:scale-110 transition-transform">
              <ShieldCheck size={32} />
            </div>
            <h3 className="text-xl font-bold text-gray-800">Faculty</h3>
            <p className="text-3xl font-black text-blue-600 mt-2">
              {users.filter((u) => u.role === "FACULTY").length}
            </p>
            <p className="text-sm text-gray-400 mt-1 font-medium">
              Assign subjects and roles
            </p>
          </div>

          <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 hover:shadow-xl transition-all group">
            <div className="bg-purple-50 w-16 h-16 rounded-2xl flex items-center justify-center text-purple-600 mb-4 group-hover:scale-110 transition-transform">
              <ShieldCheck size={32} />
            </div>
            <h3 className="text-xl font-bold text-gray-800">Admins</h3>
            <p className="text-3xl font-black text-purple-600 mt-2">
              {users.filter((u) => u.role === "ADMIN").length}
            </p>
            <p className="text-sm text-gray-400 mt-1 font-medium">
              System administrators
            </p>
          </div>
        </div>

        {/* Recent Activity or Summary could go here */}
        <div className="bg-white rounded-2xl p-8 border border-gray-100 shadow-sm">
          <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
            <LayoutDashboard className="text-indigo-600" size={24} />
            Welcome to Admin Control Center
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <div
                className="flex items-start gap-4 p-4 rounded-xl bg-gray-50 border border-gray-100 hover:bg-indigo-50 transition-colors cursor-pointer"
                onClick={() => navigate("/admin/students")}
              >
                <div className="p-2 bg-white rounded-lg shadow-sm text-indigo-600">
                  <UserPlus size={20} />
                </div>
                <div>
                  <h4 className="font-bold text-gray-800">Quick Add Student</h4>
                  <p className="text-sm text-gray-500">
                    Register new students to the system.
                  </p>
                </div>
              </div>
              <div
                className="flex items-start gap-4 p-4 rounded-xl bg-gray-50 border border-gray-100 hover:bg-blue-50 transition-colors cursor-pointer"
                onClick={() => navigate("/admin/faculty")}
              >
                <div className="p-2 bg-white rounded-lg shadow-sm text-blue-600">
                  <UserPlus size={20} />
                </div>
                <div>
                  <h4 className="font-bold text-gray-800">Manage Faculty</h4>
                  <p className="text-sm text-gray-500">
                    View and update faculty subject assignments.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="pb-12">
      {loading && users.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24">
          <div className="animate-spin h-12 w-12 border-4 border-indigo-600 border-t-transparent rounded-full"></div>
          <p className="mt-6 text-gray-500 font-bold text-lg">
            Synchronizing data...
          </p>
        </div>
      ) : error ? (
        <div className="bg-red-50 border border-red-100 text-red-600 p-8 rounded-2xl text-center shadow-sm">
          <ShieldCheck size={48} className="mx-auto mb-4 opacity-50" />
          <p className="text-lg font-bold">{error}</p>
          <button
            onClick={fetchUsers}
            className="mt-4 px-6 py-2 bg-red-600 text-white rounded-xl font-bold hover:bg-red-700 transition"
          >
            Try Again
          </button>
        </div>
      ) : (
        renderContent()
      )}

      {/* Modals */}
      <UserModal
        isOpen={userModal.open}
        onClose={() => setUserModal({ ...userModal, open: false })}
        onSubmit={handleUserSubmit}
        user={userModal.user}
        mode={userModal.mode}
      />

      {/* ✅ FIXED */}
      {marksModal.open && (
        <MarksModal
          isOpen={marksModal.open}
          onClose={() => setMarksModal({ open: false, student: null })}
          student={marksModal.student}
        />
      )}

      {/* ✅ FIXED */}
      {subjectModal.open && (
        <SubjectModal
          isOpen={subjectModal.open}
          onClose={() => setSubjectModal({ open: false, faculty: null })}
          faculty={subjectModal.faculty}
        />
      )}
    </div>
  );
};

export default AdminDashboard;
