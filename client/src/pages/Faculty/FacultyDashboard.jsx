import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { 
  BookOpen, 
  GraduationCap, 
  Plus, 
  Search, 
  Save, 
  CheckCircle2, 
  AlertTriangle,
  User as UserIcon,
  X
} from 'lucide-react';

const FacultyDashboard = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isMarkModalOpen, setIsMarkModalOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [marks, setMarks] = useState({ subject: '', score: '' });
  const [saving, setSaving] = useState(false);

  const [subjects, setSubjects] = useState([]);

  useEffect(() => {
    fetchInitialData();
  }, []);

  const fetchInitialData = async () => {
    setLoading(true);
    try {
      const [usersRes, subjectsRes] = await Promise.all([
        api.get('/users'),
        api.get('/subjects') 
      ]);
      
      const studentList = usersRes.data.users?.filter(u => u.role === 'STUDENT') || [];
      const subjectList = subjectsRes.data.subjects || [];
      
      setStudents(studentList);
      setSubjects(subjectList);
      
      console.log('Students fetched:', studentList.length);
      console.log('Subjects fetched:', subjectList.length);
    } catch (err) {
      console.error('Error fetching faculty data:', err);
      // Fallback if subjects endpoint fails but users work
      try {
        const usersRes = await api.get('/users');
        setStudents(usersRes.data.users?.filter(u => u.role === 'STUDENT') || []);
      } catch (e) {
        console.error('Critical fetch error:', e);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateMarks = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      // First, try to fetch if marks already exist for this student and subject
      const studentMarksRes = await api.get(`/marks/${selectedStudent._id}`);
      const existingMark = studentMarksRes.data.marks?.find(m => m.subjectId?._id === marks.subject);

      if (existingMark) {
        // Update existing marks
        await api.put(`/marks/${existingMark._id}`, {
          marks: Number(marks.score)
        });
        alert(`Marks updated successfully for ${selectedStudent.name}!`);
      } else {
        // Create new marks
        await api.post('/marks', {
          studentId: selectedStudent._id,
          subjectId: marks.subject,
          marks: Number(marks.score)
        });
        alert(`New marks added successfully for ${selectedStudent.name}!`);
      }
      setIsMarkModalOpen(false);
    } catch (err) {
      console.error('Error saving marks:', err);
      alert(err.response?.data?.message || 'Failed to save marks');
    } finally {
      setSaving(false);
    }
  };

  const handleOpenMarksModal = (student) => {
    setSelectedStudent(student);
    setIsMarkModalOpen(true);
    setMarks({ subject: '', score: '' });
  };

  const filteredStudents = students.filter(s => 
    s.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    s.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Faculty Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center gap-4">
          <div className="bg-blue-100 p-3 rounded-lg text-blue-600">
            <BookOpen size={24} />
          </div>
          <div>
            <p className="text-sm text-gray-500 font-medium">My Subjects</p>
            <h3 className="text-2xl font-bold">4</h3>
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center gap-4">
          <div className="bg-green-100 p-3 rounded-lg text-green-600">
            <GraduationCap size={24} />
          </div>
          <div>
            <p className="text-sm text-gray-500 font-medium">Total Students</p>
            <h3 className="text-2xl font-bold">{students.length}</h3>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-6 border-b border-gray-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <h2 className="text-xl font-bold text-gray-800">Student Management</h2>
          
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input 
              type="text" 
              placeholder="Search students..."
              className="pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 w-full md:w-64"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          {loading ? (
            <div className="p-12 text-center">
              <div className="animate-spin h-8 w-8 border-4 border-indigo-600 border-t-transparent rounded-full mx-auto"></div>
              <p className="mt-4 text-gray-500">Loading student list...</p>
            </div>
          ) : (
            <table className="w-full text-left">
              <thead className="bg-gray-50 text-gray-500 text-sm uppercase font-semibold">
                <tr>
                  <th className="px-6 py-4">Student</th>
                  <th className="px-6 py-4">Email</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredStudents.length > 0 ? filteredStudents.map((s) => (
                  <tr key={s._id} className="hover:bg-gray-50 transition">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 font-bold text-xs">
                          {s.name.charAt(0).toUpperCase()}
                        </div>
                        <span className="font-medium text-gray-900">{s.name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-gray-600">{s.email}</td>
                    <td className="px-6 py-4">
                      <span className="flex items-center gap-1.5 text-xs font-semibold text-green-600 bg-green-50 px-2 py-1 rounded-full">
                        <CheckCircle2 size={14} /> Active
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button 
                        onClick={() => handleOpenMarksModal(s)}
                        className="flex items-center gap-1.5 ml-auto px-3 py-1.5 bg-indigo-50 text-indigo-600 rounded-lg hover:bg-indigo-100 transition text-sm font-medium"
                      >
                        <Plus size={16} /> Add Marks
                      </button>
                    </td>
                  </tr>
                )) : (
                  <tr>
                    <td colSpan="4" className="px-6 py-12 text-center text-gray-500">
                      No students found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Update Marks Modal */}
      {isMarkModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-indigo-600 text-white">
              <h3 className="text-xl font-bold">Update Marks</h3>
              <button onClick={() => setIsMarkModalOpen(false)} className="hover:text-indigo-200 transition">
                <X size={20} />
              </button>
            </div>
            
            <form onSubmit={handleUpdateMarks} className="p-6 space-y-4">
              <div className="bg-gray-50 p-3 rounded-lg flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold">
                  {selectedStudent?.name.charAt(0).toUpperCase()}
                </div>
                <div>
                  <p className="font-bold text-gray-900">{selectedStudent?.name}</p>
                  <p className="text-xs text-gray-500">{selectedStudent?.email}</p>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-sm font-medium text-gray-700">Select Subject</label>
                <select 
                  required
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
                  value={marks.subject}
                  onChange={(e) => setMarks({...marks, subject: e.target.value})}
                >
                  <option value="">Choose Subject...</option>
                  {subjects.map(subj => (
                    <option key={subj._id} value={subj._id}>{subj.name}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-sm font-medium text-gray-700">Enter Marks (0-100)</label>
                <input 
                  required
                  type="number" 
                  min="0"
                  max="100"
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="e.g. 85"
                  value={marks.score}
                  onChange={(e) => setMarks({...marks, score: e.target.value})}
                />
              </div>

              <div className="pt-4 flex gap-3">
                <button 
                  type="button"
                  onClick={() => setIsMarkModalOpen(false)}
                  className="flex-1 px-4 py-2 border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50 transition"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  disabled={saving}
                  className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition shadow-lg shadow-indigo-100 disabled:opacity-70 flex items-center justify-center gap-2"
                >
                  {saving ? (
                    <div className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  ) : (
                    <>
                      <Save size={18} />
                      Save Marks
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default FacultyDashboard;
