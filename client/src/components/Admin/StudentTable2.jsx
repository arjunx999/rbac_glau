import React, { useState } from "react";
import {
  Mail,
  GraduationCap,
  Edit2,
  Trash2,
  ClipboardCheck,
  Lock,
  Eye,
  EyeOff,
} from "lucide-react";

const studentTable2 = ({ students, onEdit, onDelete, onManageMarks }) => {
  const [showPasswords, setShowPasswords] = useState({});

  const togglePassword = (id) => {
    setShowPasswords((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead className="bg-gray-50 text-gray-500 text-xs uppercase font-bold tracking-wider">
            <tr>
              <th className="px-6 py-4">Student Info</th>
              <th className="px-6 py-4">Marks (Subject-wise)</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {students.length > 0 ? (
              students.map((s) => (
                <tr
                  key={s._id}
                  className="hover:bg-gray-50/50 transition group"
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-600 font-bold border border-indigo-100 group-hover:bg-indigo-600 group-hover:text-white transition-colors duration-300">
                        {s.name.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <p className="font-bold text-gray-900">{s.name}</p>
                        <div className="flex items-center gap-1.5 text-xs text-gray-500">
                          <Mail size={12} className="text-indigo-400" />
                          {s.email}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <button
                      onClick={() => onManageMarks(s)}
                      className="flex items-center gap-2 px-3 py-1.5 bg-green-50 text-green-700 rounded-lg hover:bg-green-100 transition text-xs font-bold border border-green-100"
                    >
                      <ClipboardCheck size={14} />
                      View/Edit Marks
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan="5"
                  className="px-6 py-12 text-center text-gray-500 italic"
                >
                  No students found in the database.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default studentTable2;
