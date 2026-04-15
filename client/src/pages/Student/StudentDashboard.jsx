import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';
import { 
  User as UserIcon, 
  Mail, 
  Shield, 
  Award, 
  BookOpen, 
  Calendar,
  CheckCircle2,
  AlertCircle,
  GraduationCap,
  Activity,
  ChevronRight,
  TrendingUp,
  Clock,
  ShieldCheck
} from 'lucide-react';

const StudentDashboard = () => {
  const { user } = useAuth();
  const location = useLocation();
  const currentPath = location.pathname;

  const [marks, setMarks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchMarks = async () => {
      if (!user?.id) return;
      try {
        const response = await api.get(`/marks/get-marks/${user.id}`);
        setMarks(response.data.marks || []);
      } catch (err) {
        console.error('Error fetching marks:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchMarks();
  }, [user]);

  const calculateAverage = () => {
    if (marks.length === 0) return 0;
    const total = marks.reduce((acc, curr) => acc + curr.marks, 0);
    return (total / marks.length).toFixed(1);
  };

  const filteredMarks = marks.filter(m => 
    (m.subjectId?.name?.toLowerCase() || '').includes(searchTerm.toLowerCase())
  );

  const renderContent = () => {
    // 1. MARKS VIEW
    if (currentPath === '/student/marks') {
      return (
        <div className="space-y-8 animate-in slide-in-from-bottom-4 duration-700">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <h2 className="text-3xl font-black text-slate-900 tracking-tight">Academic Transcripts</h2>
              <p className="text-slate-500 font-bold mt-1">Detailed record of your subject-wise performance.</p>
            </div>
            <div className="relative group w-full md:w-80">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-indigo-600 transition-colors">
                <BookOpen size={18} />
              </div>
              <input 
                type="text" 
                placeholder="Filter by subject name..."
                className="w-full pl-11 pr-6 py-3.5 bg-white border border-slate-200 rounded-2xl text-sm font-bold focus:outline-none focus:ring-4 focus:ring-indigo-500/5 focus:border-indigo-600 transition-all shadow-sm"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          <div className="bg-white rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.02)] border border-slate-100 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50/50 text-slate-400 text-[11px] font-black uppercase tracking-[0.2em]">
                    <th className="px-8 py-5 border-b border-slate-100">Subject Name</th>
                    <th className="px-8 py-5 border-b border-slate-100">Score</th>
                    <th className="px-8 py-5 border-b border-slate-100">Date Recorded</th>
                    <th className="px-8 py-5 border-b border-slate-100 text-right">Result</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {loading ? (
                    <tr>
                      <td colSpan="4" className="px-8 py-20 text-center">
                        <div className="animate-spin h-10 w-10 border-4 border-indigo-600 border-t-transparent rounded-full mx-auto"></div>
                      </td>
                    </tr>
                  ) : filteredMarks.length > 0 ? filteredMarks.map((mark) => (
                    <tr key={mark._id} className="hover:bg-indigo-50/30 transition-colors group">
                      <td className="px-8 py-6">
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400 group-hover:bg-indigo-600 group-hover:text-white transition-all duration-300">
                            <BookOpen size={18} />
                          </div>
                          <span className="font-black text-slate-900 tracking-tight">{mark.subjectId?.name || 'N/A'}</span>
                        </div>
                      </td>
                      <td className="px-8 py-6">
                        <div className="flex items-center gap-2">
                          <span className={`text-lg font-black ${mark.marks >= 80 ? 'text-emerald-600' : mark.marks >= 40 ? 'text-indigo-600' : 'text-rose-600'}`}>
                            {mark.marks}
                          </span>
                          <span className="text-slate-400 text-xs font-bold">/ 100</span>
                        </div>
                      </td>
                      <td className="px-8 py-6">
                        <div className="flex items-center gap-2 text-slate-400 text-sm font-bold">
                          <Clock size={14} />
                          {new Date(mark.createdAt).toLocaleDateString()}
                        </div>
                      </td>
                      <td className="px-8 py-6 text-right">
                        <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest ${
                          mark.marks >= 40 ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' : 'bg-rose-50 text-rose-600 border border-rose-100'
                        }`}>
                          {mark.marks >= 40 ? <CheckCircle2 size={12} /> : <AlertCircle size={12} />}
                          {mark.marks >= 40 ? 'Passed' : 'Failed'}
                        </span>
                      </td>
                    </tr>
                  )) : (
                    <tr>
                      <td colSpan="4" className="px-8 py-20 text-center">
                        <div className="max-w-xs mx-auto">
                          <ShieldCheck size={48} className="mx-auto text-slate-200 mb-4" />
                          <p className="text-slate-400 font-bold">No academic records matching your current filter.</p>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      );
    }

    // 2. PROFILE VIEW
    if (currentPath === '/student/profile') {
      return (
        <div className="max-w-3xl mx-auto space-y-8 animate-in zoom-in-95 duration-700">
          <div className="text-center">
            <h2 className="text-3xl font-black text-slate-900 tracking-tight">Personal Identity</h2>
            <p className="text-slate-500 font-bold mt-1">Official records registered in the RBAC system.</p>
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
                <p className="text-indigo-600 font-black text-xs uppercase tracking-[0.2em] mt-1">Student ID: {user?.id?.substr(-8).toUpperCase()}</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="p-6 bg-slate-50 rounded-3xl border border-slate-100 space-y-1">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Email Address</p>
                  <p className="text-slate-900 font-black text-sm">{user?.email}</p>
                </div>
                <div className="p-6 bg-slate-50 rounded-3xl border border-slate-100 space-y-1">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Account Status</p>
                  <div className="flex items-center gap-2 text-emerald-600 font-black text-sm">
                    <CheckCircle2 size={16} /> Verified Active
                  </div>
                </div>
                <div className="p-6 bg-slate-50 rounded-3xl border border-slate-100 space-y-1">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Assigned Role</p>
                  <p className="text-slate-900 font-black text-sm uppercase tracking-tight">{user?.role}</p>
                </div>
                <div className="p-6 bg-slate-50 rounded-3xl border border-slate-100 space-y-1">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Registration Date</p>
                  <p className="text-slate-900 font-black text-sm">{new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</p>
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

    // 3. DEFAULT DASHBOARD VIEW
    return (
      <div className="space-y-8 animate-in fade-in duration-700">
        {/* Welcome Banner */}
        <div className="bg-[#0f172a] rounded-[2.5rem] p-10 text-white shadow-2xl shadow-indigo-200/20 flex flex-col md:flex-row items-center gap-10 relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-10 opacity-5 group-hover:opacity-10 transition-opacity duration-700">
            <GraduationCap size={240} />
          </div>
          
          <div className="w-28 h-28 rounded-[2rem] bg-indigo-600 flex items-center justify-center text-4xl font-black shadow-2xl shadow-indigo-500/30 transform group-hover:rotate-6 transition-transform duration-500">
            {user?.name?.charAt(0).toUpperCase() || 'S'}
          </div>
          
          <div className="text-center md:text-left z-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/10 rounded-full text-[10px] font-black uppercase tracking-widest mb-4">
              <Activity size={12} className="text-indigo-400" />
              <span>Academic Session 2026-27</span>
            </div>
            <h1 className="text-4xl font-black mb-2 tracking-tight">Welcome back, <span className="text-indigo-400">{user?.name?.split(' ')[0]}!</span></h1>
            <p className="text-slate-400 font-bold flex items-center gap-2 justify-center md:justify-start">
              <Mail size={16} className="text-indigo-400" /> {user?.email}
            </p>
          </div>

          <div className="md:ml-auto flex flex-col gap-3">
             <div className="bg-white/5 backdrop-blur-xl px-6 py-4 rounded-3xl border border-white/10 flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-indigo-500/20 flex items-center justify-center text-indigo-400">
                  <TrendingUp size={20} />
                </div>
                <div>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Average Performance</p>
                  <h3 className="text-2xl font-black text-white leading-none">{calculateAverage()}%</h3>
                </div>
             </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Quick Stats */}
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm hover:shadow-xl transition-all group">
              <h3 className="text-xl font-black text-slate-900 mb-6 flex items-center gap-3">
                <div className="p-2.5 bg-indigo-50 rounded-2xl text-indigo-600">
                  <Shield size={20} />
                </div>
                Portal Summary
              </h3>
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-emerald-50 flex items-center justify-center text-emerald-600">
                      <BookOpen size={16} />
                    </div>
                    <span className="text-sm font-bold text-slate-500">Subjects Enrolled</span>
                  </div>
                  <span className="font-black text-slate-900">{marks.length}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-600">
                      <Award size={16} />
                    </div>
                    <span className="text-sm font-bold text-slate-500">Overall Grade</span>
                  </div>
                  <span className="font-black text-slate-900">{calculateAverage() >= 80 ? 'A+' : calculateAverage() >= 60 ? 'B' : 'C'}</span>
                </div>
              </div>
              
              <button 
                onClick={() => window.location.href = '/student/profile'}
                className="w-full mt-8 py-4 bg-slate-50 hover:bg-indigo-50 text-indigo-600 text-xs font-black uppercase tracking-widest rounded-2xl transition-all flex items-center justify-center gap-2 group/btn"
              >
                View Full Profile
                <ChevronRight size={14} className="group-hover/btn:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>

          {/* Recent Performance Preview */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-[2rem] border border-slate-100 shadow-sm overflow-hidden">
              <div className="p-8 border-b border-slate-50 flex justify-between items-center bg-slate-50/30">
                <h3 className="text-xl font-black text-slate-900 flex items-center gap-3">
                  <div className="p-2.5 bg-indigo-600 rounded-2xl text-white shadow-lg shadow-indigo-200">
                    <Activity size={20} />
                  </div>
                  Recent Performance
                </h3>
                <button 
                  onClick={() => window.location.href = '/student/marks'}
                  className="text-xs font-black text-indigo-600 uppercase tracking-widest hover:text-indigo-800 transition-colors"
                >
                  View All
                </button>
              </div>
              
              <div className="p-4">
                {loading ? (
                  <div className="p-12 text-center">
                    <div className="animate-spin h-8 w-8 border-3 border-indigo-600 border-t-transparent rounded-full mx-auto"></div>
                  </div>
                ) : marks.length > 0 ? (
                  <div className="space-y-2">
                    {marks.slice(0, 3).map((mark) => (
                      <div key={mark._id} className="flex items-center justify-between p-4 hover:bg-slate-50 rounded-2xl transition-colors group">
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-600 font-black">
                            {mark.subjectId?.name?.charAt(0)}
                          </div>
                          <div>
                            <h4 className="font-black text-slate-900 text-sm tracking-tight">{mark.subjectId?.name}</h4>
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{new Date(mark.createdAt).toLocaleDateString()}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className={`font-black ${mark.marks >= 40 ? 'text-emerald-600' : 'text-rose-600'}`}>{mark.marks}%</p>
                          <p className="text-[10px] font-black text-slate-300 uppercase tracking-tighter">Score</p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="p-12 text-center text-slate-400 font-bold">
                    No recent records to display.
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="pb-12 max-w-6xl mx-auto px-4">
      {renderContent()}
    </div>
  );
};

export default StudentDashboard;
