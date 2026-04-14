import React, { useState, useEffect } from "react";
import api from "../../services/api";
import { GraduationCap } from "lucide-react";

import StudentTable2 from "../../components/Admin/StudentTable2";
import MarksModal2 from "../../components/Admin/marksModal2";

const FacultyDashboard = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [marksModal, setMarksModal] = useState({
    open: false,
    student: null,
  });

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    try {
      setLoading(true);
      const res = await api.get("/users");
      const stu = res.data.users.filter((u) => u.role === "STUDENT");
      setStudents(stu || []);
      setError("");
    } catch (err) {
      console.error(err);
      setError("Failed to fetch students");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-800">Students</h1>
        <p className="text-sm text-gray-500">Manage student marks</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-xl border flex items-center gap-4">
          <div className="bg-green-100 p-3 rounded-lg text-green-600">
            <GraduationCap size={22} />
          </div>
          <div>
            <p className="text-sm text-gray-500">Total Students</p>
            <h3 className="text-xl font-bold">{students.length}</h3>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border shadow-sm">
        <div className="p-4 border-b">
          <h2 className="text-lg font-semibold text-gray-700">Student List</h2>
        </div>

        {loading ? (
          <p className="p-4 text-gray-500">Loading...</p>
        ) : error ? (
          <p className="p-4 text-red-500">{error}</p>
        ) : (
          <StudentTable2
            students={students}
            onManageMarks={(u) => setMarksModal({ open: true, student: u })}
          />
        )}
      </div>

      {/* Modal */}
      {marksModal.open && (
        <MarksModal2
          isOpen={marksModal.open}
          onClose={() => setMarksModal({ open: false, student: null })}
          student={marksModal.student}
        />
      )}
    </div>
  );
};

export default FacultyDashboard;
