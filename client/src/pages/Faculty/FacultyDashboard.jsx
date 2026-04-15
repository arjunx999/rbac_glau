import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { 
  BookOpen, 
  GraduationCap, 
  Plus, 
  Search, 
  Save, 
  CheckCircle2, 
  User as UserIcon,
  X,
  ClipboardCheck,
  ChevronRight,
  ShieldCheck,
  Activity,
  Layers
} from 'lucide-react';

const FacultyDashboard = () => {
  const { user } = useAuth();
  const location = useLocation();
  const currentPath = location.pathname;

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
        api.get('/subjects/get-all-subjects') 
      ]);
      
      const studentList = usersRes.data.users?.filter(u => u.role === 'STUDENT') || [];
      const allSubjects = subjectsRes.data.subjects || [];
      
      const assignedSubjects = allSubjects.filter(s => s.facultyId?._id === user?.id);
      
      setStudents(studentList);
      setSubjects(assignedSubjects);
    } catch (err) {
      console.error('Error fetching faculty data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateMarks = async (e) => {
    e.preventDefault();
    if (!marks.subject || !marks.score) return;
    
    setSaving(true);
    try {
      const studentMarksRes = await api.get(`/marks/get-marks/${selectedStudent._id}`);
      const existingMark = studentMarksRes.data.marks?.find(m => m.subjectId?._id === marks.subject);

      if (existingMark) {
        await api.patch(`/marks/update-marks/${existingMark._id}`, {
          marks: Number(marks.score)
        });
      } else {
        await api.post('/marks/upload-marks', {
          studentId: selectedStudent._id,
          subjectId: marks.subject,
          marks: Number(marks.score)
        });
      }
      setIsMarkModalOpen(false);
      alert('Marks processed successfully!');
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
    (s.name?.toLowerCase() || '').includes(searchTerm.toLowerCase()) || 
    (s.email?.toLowerCase() || '').includes(searchTerm.toLowerCase())
  );

  const renderContent = () => {
    // 1. PROFILE VIEW
    if (currentPath === '/faculty/profile') {
      return (
        <div className="max-w-3xl mx-auto space-y-8 animate-in zoom-in-95 duration-700">
          <div className="text-center">
            <h2 className="text-3xl font-black text-slate-900 tracking-tight">Faculty Identity</h2>
            <p className="text-slate-500 font-bold mt-1">Official professional records registered in the RBAC system.</p>
          </div>

          <div className="bg-white rounded-[2.5rem] shadow-xl shadow-slate-200/50 border border-slate-100 overflow-hidden">
            <div className="bg-indigo-600 h-32 relative">
              <div className="absolute -bottom-12 left-1/2 -translate-x-1/2">
                <div className="w-24 h-24 rounded-[2rem] bg-white p-1 shadow-xl">
                  <div className="w-full h-full rounded-[1.8rem] bg-slate-50 flex items-center justify-center text-indigo-600 text-3xl font-black border-2 border-slate-100">
                    {user?.name?.charAt(0).toUpperCase()}
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-16 pb-12 px-12 space-y-8">
              <div className="text-center mb-10">
                <h3 className="text-2xl font-black text-slate-900">{user?.name}</h3>
                <p className="text-indigo-600 font-black text-xs uppercase tracking-[0.2em] mt-1">Faculty ID: {user?.id?.substr(-8).toUpperCase()}</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="p-6 bg-slate-50 rounded-3xl border border-slate-100 space-y-1">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Email Address</p>
                  <p className="text-slate-900 font-black text-sm">{user?.email}</p>
                </div>
                <div className="p-6 bg-slate-50 rounded-3xl border border-slate-100 space-y-1">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Employment Status</p>
                  <div className="flex items-center gap-2 text-emerald-600 font-black text-sm">
                    <CheckCircle2 size={16} /> Verified Staff
                  </div>
                </div>
                <div className="p-6 bg-slate-50 rounded-3xl border border-slate-100 space-y-1">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Departmental Role</p>
                  <p className="text-slate-900 font-black text-sm uppercase tracking-tight">{user?.role}</p>
                </div>
                <div className="p-6 bg-slate-50 rounded-3xl border border-slate-100 space-y-1">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Total Subjects</p>
                  <p className="text-slate-900 font-black text-sm">{subjects.length} Assigned</p>
                </div>
              </div>

              <div className="pt-4 text-center">
                <p className="text-[10px] font-black text-slate-300 uppercase tracking-[0.3em]">GLAU Security Protocol Compliant</p>
              </div>
            </div>
          </div>
        </div>
      );
    }

    // 2. CONTENT FOR "MY SUBJECTS"
    if (currentPath === '/faculty/subjects') {
      return (
        <div className="space-y-8 animate-in slide-in-from-bottom-4 duration-500">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-3xl font-black text-slate-900 tracking-tight">Assigned Subjects</h2>
              <p className="text-slate-500 font-bold mt-1">Modules currently under your supervision.</p>
            </div>
            <div className="p-3 bg-indigo-50 rounded-2xl text-indigo-600 shadow-sm border border-indigo-100">
              <Layers size={24} />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {subjects.length > 0 ? subjects.map((sub) => (
              <div key={sub._id} className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm hover:shadow-xl hover:border-indigo-100 transition-all group">
                <div className="w-14 h-14 rounded-2xl bg-slate-50 flex items-center justify-center text-slate-400 mb-6 group-hover:bg-indigo-600 group-hover:text-white transition-all duration-500">
                  <BookOpen size={28} />
                </div>
                <h3 className="text-xl font-black text-slate-900 mb-2 group-hover:text-indigo-600 transition-colors">{sub.name}</h3>
                <div className="flex items-center gap-2 text-slate-400 font-bold text-xs uppercase tracking-widest">
                  <Activity size={14} className="text-indigo-400" />
                  <span>Subject Active</span>
                </div>
              </div>
            )) : (
              <div className="col-span-full p-20 bg-slate-50 rounded-[2.5rem] border-2 border-dashed border-slate-200 text-center">
                <ShieldCheck size={48} className="mx-auto text-slate-300 mb-4" />
                <p className="text-slate-500 font-bold">No subjects have been assigned to your profile yet.</p>
              </div>
            )}
          </div>
        </div>
      );
    }

    // DEFAULT CONTENT (DASHBOARD & MANAGE MARKS)
    return (
      <div className="space-y-8 animate-in fade-in duration-700">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <h1 className="text-3xl font-black text-slate-900 tracking-tight">
              {currentPath === '/faculty/marks' ? 'Manage Marks' : 'Faculty Dashboard'}
            </h1>
            <p className="text-slate-500 font-bold mt-1">Manage academic excellence and student progress.</p>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="bg-white px-6 py-4 rounded-3xl border border-slate-200 shadow-sm flex items-center gap-4 group hover:border-indigo-200 transition-colors">
              <div className="w-12 h-12 rounded-2xl bg-indigo-50 flex items-center justify-center text-indigo-600 group-hover:scale-110 transition-transform">
                <BookOpen size={24} />
              </div>
              <div>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">My Subjects</p>
                <h3 className="text-xl font-black text-slate-900 leading-none">{subjects.length}</h3>
              </div>
            </div>
            
            <div className="bg-white px-6 py-4 rounded-3xl border border-slate-200 shadow-sm flex items-center gap-4 group hover:border-emerald-200 transition-colors">
              <div className="w-12 h-12 rounded-2xl bg-emerald-50 flex items-center justify-center text-emerald-600 group-hover:scale-110 transition-transform">
                <GraduationCap size={24} />
              </div>
              <div>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Total Students</p>
                <h3 className="text-xl font-black text-slate-900 leading-none">{students.length}</h3>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.02)] border border-slate-100 overflow-hidden">
          <div className="p-8 border-b border-slate-50 flex flex-col md:flex-row md:items-center justify-between gap-6 bg-slate-50/30">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-indigo-600 rounded-2xl text-white shadow-lg shadow-indigo-200">
                <Activity size={20} />
              </div>
              <h2 className="text-xl font-black text-slate-900 tracking-tight">Active Students</h2>
            </div>
            
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-indigo-600 transition-colors">
                <Search size={18} />
              </div>
              <input 
                type="text" 
                placeholder="Search by name or email..."
                className="pl-11 pr-6 py-3.5 bg-white border border-slate-200 rounded-2xl text-sm font-bold focus:outline-none focus:ring-4 focus:ring-indigo-500/5 focus:border-indigo-600 w-full md:w-80 transition-all shadow-sm"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            {loading ? (
              <div className="p-24 text-center">
                <div className="animate-spin h-10 w-10 border-4 border-indigo-600 border-t-transparent rounded-full mx-auto shadow-sm"></div>
                <p className="mt-6 text-slate-500 font-bold tracking-tight">Synchronizing student records...</p>
              </div>
            ) : (
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50/50 text-slate-400 text-[11px] font-black uppercase tracking-[0.2em]">
                    <th className="px-8 py-5 border-b border-slate-100">Identity Details</th>
                    <th className="px-8 py-5 border-b border-slate-100">Contact Address</th>
                    <th className="px-8 py-5 border-b border-slate-100">Status</th>
                    <th className="px-8 py-5 border-b border-slate-100 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {filteredStudents.length > 0 ? filteredStudents.map((s) => (
                    <tr key={s._id} className="hover:bg-indigo-50/30 transition-colors group">
                      <td className="px-8 py-6">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 font-black text-lg shadow-sm group-hover:bg-indigo-600 group-hover:text-white transition-all duration-300">
                            {s.name?.charAt(0).toUpperCase() || 'S'}
                          </div>
                          <span className="font-black text-slate-900 tracking-tight">{s.name}</span>
                        </div>
                      </td>
                      <td className="px-8 py-6">
                        <span className="text-sm font-bold text-slate-500">{s.email}</span>
                      </td>
                      <td className="px-8 py-6">
                        <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest bg-emerald-50 text-emerald-600 border border-emerald-100 shadow-sm">
                          <CheckCircle2 size={12} /> Active
                        </span>
                      </td>
                      <td className="px-8 py-6 text-right">
                        <button 
                          onClick={() => handleOpenMarksModal(s)}
                          className="inline-flex items-center gap-2 px-5 py-2.5 bg-white border border-slate-200 text-indigo-600 rounded-xl hover:bg-indigo-600 hover:text-white hover:border-indigo-600 hover:shadow-lg hover:shadow-indigo-200 transition-all duration-300 text-xs font-black uppercase tracking-widest"
                        >
                          <Plus size={14} /> Update Marks
                        </button>
                      </td>
                    </tr>
                  )) : (
                    <tr>
                      <td colSpan="4" className="px-8 py-20 text-center">
                        <div className="max-w-xs mx-auto">
                          <ShieldCheck size={48} className="mx-auto text-slate-200 mb-4" />
                          <p className="text-slate-400 font-bold">No students found matching your current search parameters.</p>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="pb-12">
      {renderContent()}

      {/* Update Marks Modal */}
      {isMarkModalOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-6">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-md animate-in fade-in duration-300" onClick={() => !saving && setIsMarkModalOpen(false)}></div>
          
          <div className="relative bg-white w-full max-w-lg rounded-[2.5rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
            <div className="p-8 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-indigo-600 flex items-center justify-center text-white shadow-lg shadow-indigo-200">
                  <ClipboardCheck size={24} />
                </div>
                <div>
                  <h3 className="text-xl font-black text-slate-900 tracking-tight">Update Records</h3>
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">{selectedStudent?.name}</p>
                </div>
              </div>
              <button 
                onClick={() => setIsMarkModalOpen(false)}
                disabled={saving}
                className="p-2 text-slate-400 hover:text-slate-900 hover:bg-white rounded-xl transition-all"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleUpdateMarks} className="p-8 space-y-8">
              <div className="space-y-3">
                <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-2">Target Subject</label>
                <select 
                  className="w-full px-6 py-4.5 bg-slate-50 border-2 border-slate-100 rounded-[1.5rem] text-slate-900 text-sm font-bold focus:outline-none focus:border-indigo-600 transition-all appearance-none cursor-pointer"
                  value={marks.subject}
                  onChange={(e) => setMarks({ ...marks, subject: e.target.value })}
                  required
                >
                  <option value="">Select a subject...</option>
                  {subjects.map(sub => (
                    <option key={sub._id} value={sub._id}>{sub.name}</option>
                  ))}
                </select>
                {subjects.length === 0 && (
                  <p className="text-[10px] text-rose-500 font-bold ml-2 uppercase tracking-tighter">* No subjects assigned to you</p>
                )}
              </div>

              <div className="space-y-3">
                <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-2">Academic Score (0-100)</label>
                <input 
                  type="number"
                  min="0"
                  max="100"
                  placeholder="Enter numerical score..."
                  className="w-full px-6 py-4.5 bg-slate-50 border-2 border-slate-100 rounded-[1.5rem] text-slate-900 text-sm font-bold focus:outline-none focus:border-indigo-600 transition-all placeholder:text-slate-300"
                  value={marks.score}
                  onChange={(e) => setMarks({ ...marks, score: e.target.value })}
                  required
                />
              </div>

              <button 
                type="submit"
                disabled={saving || subjects.length === 0}
                className="w-full flex items-center justify-center gap-3 py-5 bg-slate-900 text-white rounded-[1.5rem] font-black text-sm uppercase tracking-[0.15em] hover:bg-indigo-600 active:scale-[0.98] transition-all shadow-xl shadow-indigo-100 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {saving ? (
                  <>
                    <div className="h-5 w-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    <span>Processing...</span>
                  </>
                ) : (
                  <>
                    <Save size={18} />
                    <span>Commit Changes</span>
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default FacultyDashboard;
