import React, { useState, useEffect } from 'react';
import { X, BookOpen, Plus, Trash2, Save, GraduationCap } from 'lucide-react';
import api from '../../services/api';

const MarksModal = ({ isOpen, onClose, student }) => {
  const [marks, setMarks] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // New mark form state
  const [newMark, setNewMark] = useState({
    subjectId: '',
    marks: ''
  });

  useEffect(() => {
    if (isOpen && student) {
      fetchData();
    }
  }, [isOpen, student]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [marksRes, subjectsRes] = await Promise.all([
        api.get(`/marks/get-marks/${student._id}`),
        api.get('/subjects/get-all-subjects')
      ]);
      setMarks(marksRes.data.marks || []);
      setSubjects(subjectsRes.data.subjects || []);
      setError('');
    } catch (err) {
      setError('Failed to load marks or subjects');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddMark = async (e) => {
    e.preventDefault();
    if (!newMark.subjectId || !newMark.marks) return;

    try {
      await api.post('/marks/upload-marks', {
        studentId: student._id,
        subjectId: newMark.subjectId,
        marks: Number(newMark.marks)
      });
      setNewMark({ subjectId: '', marks: '' });
      await fetchData(); // Refresh marks
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to add marks');
    }
  };

  const handleUpdateMark = async (markId, newScore) => {
    try {
      await api.patch(`/marks/update-marks/${markId}`, {
        marks: Number(newScore)
      });
      await fetchData(); // Refresh marks
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to update marks');
    }
  };

  const handleDeleteMark = async (markId) => {
    if (!window.confirm('Are you sure you want to delete this mark record?')) return;
    try {
      await api.delete(`/marks/delete-marks/${markId}`);
      await fetchData(); // Refresh marks
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to delete marks');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden transform transition-all max-h-[90vh] flex flex-col">
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-indigo-50">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-indigo-100 text-indigo-600 rounded-lg">
              <GraduationCap size={24} />
            </div>
            <div>
              <h3 className="text-xl font-bold text-indigo-900">{student.name}'s Marks</h3>
              <p className="text-sm text-indigo-600 font-medium">{student.email}</p>
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

          {/* Add New Mark Form */}
          <form onSubmit={handleAddMark} className="mb-8 bg-gray-50 p-4 rounded-xl border border-gray-100 grid grid-cols-1 sm:grid-cols-3 gap-4 items-end">
            <div className="sm:col-span-1">
              <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Subject</label>
              <select
                required
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none transition bg-white text-gray-900 shadow-sm"
                value={newMark.subjectId}
                onChange={(e) => setNewMark({ ...newMark, subjectId: e.target.value })}
              >
                <option value="" className="bg-white text-gray-500">Select Subject</option>
                {subjects.map(sub => (
                  <option key={sub._id} value={sub._id} className="bg-white text-gray-900">{sub.name}</option>
                ))}
              </select>
            </div>
            <div className="sm:col-span-1">
              <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Score</label>
              <input
                type="number"
                required
                min="0"
                max="100"
                placeholder="0-100"
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none transition"
                value={newMark.marks}
                onChange={(e) => setNewMark({ ...newMark, marks: e.target.value })}
              />
            </div>
            <button
              type="submit"
              className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition font-semibold flex items-center justify-center gap-2"
            >
              <Plus size={18} />
              Add Mark
            </button>
          </form>

          {/* Marks Table */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold text-gray-700 flex items-center gap-2 mb-4">
              <BookOpen size={18} className="text-indigo-600" />
              Existing Records
            </h4>
            
            {loading ? (
              <div className="text-center py-8">
                <div className="animate-spin h-6 w-6 border-2 border-indigo-600 border-t-transparent rounded-full mx-auto"></div>
              </div>
            ) : marks.length === 0 ? (
              <div className="text-center py-8 text-gray-500 bg-gray-50 rounded-xl border border-dashed border-gray-200">
                No marks recorded yet.
              </div>
            ) : (
              <div className="divide-y divide-gray-100 border border-gray-100 rounded-xl overflow-hidden shadow-sm">
                {marks.map((m) => (
                  <div key={m._id} className="flex items-center justify-between p-4 bg-white hover:bg-gray-50 transition">
                    <div className="flex-1">
                      <p className="font-semibold text-gray-900">{m.subjectId?.name || 'Unknown Subject'}</p>
                      <p className="text-xs text-gray-400">Updated by: {m.updatedBy?.name || 'Admin'}</p>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="relative">
                        <input
                          type="number"
                          className="w-20 px-2 py-1 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none transition text-center font-bold text-indigo-600"
                          value={m.marks}
                          onChange={(e) => handleUpdateMark(m._id, e.target.value)}
                        />
                        <span className="absolute -right-6 top-1/2 -translate-y-1/2 text-xs font-bold text-gray-400">/100</span>
                      </div>
                      <button
                        onClick={() => handleDeleteMark(m._id)}
                        className="p-2 text-gray-400 hover:text-red-600 transition hover:bg-red-50 rounded-lg"
                        title="Delete record"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
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

export default MarksModal;
