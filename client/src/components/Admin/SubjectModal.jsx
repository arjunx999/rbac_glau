import React, { useState, useEffect } from 'react';
import { X, BookOpen, UserCheck, Save, PlusCircle, Trash2 } from 'lucide-react';
import api from '../../services/api';

const SubjectModal = ({ isOpen, onClose, faculty }) => {
  const [subjects, setSubjects] = useState([]);
  const [allSubjects, setAllSubjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // New subject form state
  const [newSubjectName, setNewSubjectName] = useState('');

  useEffect(() => {
    if (isOpen && faculty) {
      fetchData();
    }
  }, [isOpen, faculty]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await api.get('/subjects/get-all-subjects');
      setAllSubjects(response.data.subjects || []);
      // Filter subjects assigned to this faculty
      setSubjects(response.data.subjects?.filter(s => s.facultyId?._id === faculty._id) || []);
      setError('');
    } catch (err) {
      setError('Failed to load subjects');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateSubject = async (e) => {
    e.preventDefault();
    if (!newSubjectName) return;
    try {
      await api.post('/subjects/create-subject', { name: newSubjectName });
      setNewSubjectName('');
      await fetchData();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to create subject');
    }
  };

  const handleAssignFaculty = async (subjectId) => {
    try {
      await api.patch(`/subjects/${subjectId}/assign-faculty`, { facultyId: faculty._id });
      await fetchData();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to assign faculty');
    }
  };

  const handleUnassignFaculty = async (subjectId) => {
    if (!window.confirm('Are you sure you want to unassign this subject?')) return;
    try {
      // In the backend, we don't have an unassign route, but we can assign to null if the API allows it
      // Or we can just delete the subject and recreate it, or better, we can assign to another faculty.
      // Since I can't change the backend, I'll see if I can assign to null.
      await api.patch(`/subjects/${subjectId}/assign-faculty`, { facultyId: null });
      await fetchData();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to unassign faculty');
    }
  };

  const handleDeleteSubject = async (subjectId) => {
    if (!window.confirm('Are you sure you want to delete this subject?')) return;
    try {
      await api.delete(`/subjects/${subjectId}/delete-subject`);
      await fetchData();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to delete subject');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden transform transition-all max-h-[90vh] flex flex-col">
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-indigo-50">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-indigo-100 text-indigo-600 rounded-lg">
              <BookOpen size={24} />
            </div>
            <div>
              <h3 className="text-xl font-bold text-indigo-900">{faculty.name}'s Subjects</h3>
              <p className="text-sm text-indigo-600 font-medium">{faculty.email}</p>
            </div>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition">
            <X size={24} />
          </button>
        </div>

        <div className="p-6 overflow-y-auto flex-1">
          {error && (
            <div className="mb-4 p-3 bg-red-50 text-red-600 rounded-xl text-sm border border-red-100 flex items-center gap-2">
              <X size={16} />
              {error}
            </div>
          )}

          {/* Create New Subject Form */}
          <form onSubmit={handleCreateSubject} className="mb-8 bg-gray-50 p-4 rounded-xl border border-gray-100 flex gap-4 items-end">
            <div className="flex-1">
              <label className="block text-xs font-bold text-gray-500 uppercase mb-1">New Subject Name</label>
              <input
                type="text"
                required
                placeholder="e.g., Mathematics"
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none transition"
                value={newSubjectName}
                onChange={(e) => setNewSubjectName(e.target.value)}
              />
            </div>
            <button
              type="submit"
              className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition font-semibold flex items-center gap-2"
            >
              <PlusCircle size={18} />
              Create & Add
            </button>
          </form>

          {/* Assigned Subjects */}
          <div className="space-y-3 mb-8">
            <h4 className="text-sm font-bold text-gray-700 flex items-center gap-2 mb-4">
              <UserCheck size={18} className="text-indigo-600" />
              Assigned Subjects
            </h4>
            
            {loading ? (
              <div className="text-center py-8">
                <div className="animate-spin h-6 w-6 border-2 border-indigo-600 border-t-transparent rounded-full mx-auto"></div>
              </div>
            ) : subjects.length === 0 ? (
              <div className="text-center py-8 text-gray-500 bg-gray-50 rounded-xl border border-dashed border-gray-200">
                No subjects assigned yet.
              </div>
            ) : (
              <div className="divide-y divide-gray-100 border border-gray-100 rounded-xl overflow-hidden shadow-sm">
                {subjects.map((s) => (
                  <div key={s._id} className="flex items-center justify-between p-4 bg-white hover:bg-gray-50 transition">
                    <span className="font-semibold text-gray-900">{s.name}</span>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleUnassignFaculty(s._id)}
                        className="px-3 py-1 text-xs font-bold text-red-600 bg-red-50 hover:bg-red-100 rounded-lg transition"
                      >
                        Unassign
                      </button>
                      <button
                        onClick={() => handleDeleteSubject(s._id)}
                        className="p-2 text-gray-400 hover:text-red-600 transition"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Available Subjects to Assign */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold text-gray-700 flex items-center gap-2 mb-4">
              <PlusCircle size={18} className="text-indigo-600" />
              Available Subjects
            </h4>
            
            <div className="flex flex-wrap gap-2">
              {allSubjects
                .filter(s => !s.facultyId)
                .map(s => (
                  <button
                    key={s._id}
                    onClick={() => handleAssignFaculty(s._id)}
                    className="px-4 py-2 bg-white border border-indigo-200 text-indigo-700 rounded-full text-sm font-medium hover:bg-indigo-50 transition flex items-center gap-2"
                  >
                    <PlusCircle size={14} />
                    {s.name}
                  </button>
                ))}
              {allSubjects.filter(s => !s.facultyId).length === 0 && (
                <p className="text-xs text-gray-500 italic">No unassigned subjects available.</p>
              )}
            </div>
          </div>
        </div>

        <div className="px-6 py-4 border-t border-gray-100 bg-gray-50 flex justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2 bg-white border border-gray-200 text-gray-600 rounded-xl hover:bg-gray-50 transition font-semibold"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default SubjectModal;
