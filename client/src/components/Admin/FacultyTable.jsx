import React, { useState } from 'react';
import { Mail, Shield, Edit2, Trash2, BookOpen, Lock, Eye, EyeOff } from 'lucide-react';

const FacultyTable = ({ faculty, onEdit, onDelete, onManageSubjects }) => {
  const [showPasswords, setShowPasswords] = useState({});

  const togglePassword = (id) => {
    setShowPasswords(prev => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead className="bg-gray-50 text-gray-500 text-xs uppercase font-bold tracking-wider">
            <tr>
              <th className="px-6 py-4">Faculty Info</th>
              <th className="px-6 py-4">Credentials</th>
              <th className="px-6 py-4">Password</th>
              <th className="px-6 py-4">Assigned Subjects</th>
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {faculty.length > 0 ? faculty.map((f) => (
              <tr key={f._id} className="hover:bg-gray-50/50 transition group">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 font-bold border border-blue-100 group-hover:bg-blue-600 group-hover:text-white transition-colors duration-300">
                      {f.name?.charAt(0).toUpperCase() || 'F'}
                    </div>
                    <div>
                      <p className="font-bold text-gray-900">{f.name}</p>
                      <div className="flex items-center gap-1.5 text-xs text-gray-500">
                        <Mail size={12} className="text-blue-400" />
                        {f.email}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex flex-col gap-1">
                    <div className="flex items-center gap-1.5 text-xs font-medium text-gray-600 bg-gray-100 px-2 py-1 rounded-md w-fit">
                      <Lock size={12} className="text-gray-400" />
                      ********
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-mono text-gray-600 bg-gray-50 px-2 py-1 rounded border border-gray-100 min-w-[100px] text-center">
                      {showPasswords[f._id] ? (f.password || 'password123') : '••••••••'}
                    </span>
                    <button 
                      onClick={() => togglePassword(f._id)}
                      className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition"
                      title={showPasswords[f._id] ? "Hide Password" : "Show Password"}
                    >
                      {showPasswords[f._id] ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <button 
                    onClick={() => onManageSubjects(f)}
                    className="flex items-center gap-2 px-3 py-1.5 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition text-xs font-bold border border-blue-100"
                  >
                    <BookOpen size={14} />
                    Manage Subjects
                  </button>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button 
                      onClick={() => onEdit(f)}
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition"
                      title="Edit Faculty"
                    >
                      <Edit2 size={18} />
                    </button>
                    <button 
                      onClick={() => onDelete(f._id)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition"
                      title="Delete Faculty"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </td>
              </tr>
            )) : (
              <tr>
                <td colSpan="5" className="px-6 py-12 text-center text-gray-500 italic">
                  No faculty found in the database.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default FacultyTable;
