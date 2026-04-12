import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';
import {
  BookOpen,
  Calendar,
  AlertCircle,
  TrendingUp,
  CheckCircle2,
  XCircle,
  ChevronLeft,
  Search,
  Filter,
} from 'lucide-react';
import { Link } from 'react-router-dom';

const MyMarks = () => {
  const { user } = useAuth();
  const [marks, setMarks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMarks = async () => {
      if (!user?.id) return;
      try {
        const response = await api.get(`/marks/${user.id}`);
        setMarks(response.data.marks || []);
      } catch (err) {
        console.error('Error fetching marks:', err);
        setError('Failed to load marks. Please try again.');
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

  const highestMark = marks.length > 0 ? Math.max(...marks.map(m => m.marks)) : 0;
  const passedCount = marks.filter(m => m.marks >= 40).length;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Header with Navigation Back */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <Link 
            to="/student" 
            className="inline-flex items-center text-indigo-600 hover:text-indigo-800 font-bold mb-4 group transition-colors"
          >
            <ChevronLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
            Back to Dashboard
          </Link>
          <h1 className="text-4xl font-black text-gray-900 flex items-center gap-3 tracking-tight">
            <BookOpen size={32} className="text-indigo-600" />
            My Academic Marks
          </h1>
          <p className="text-gray-500 mt-2 font-medium">Detailed breakdown of your performance across all subjects.</p>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="bg-indigo-50 px-6 py-3 rounded-2xl border border-indigo-100 shadow-sm">
            <p className="text-xs text-indigo-400 font-bold uppercase tracking-widest">Average Score</p>
            <p className="text-2xl font-black text-indigo-700">{calculateAverage()}%</p>
          </div>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4">
          <div className="p-4 bg-green-50 text-green-600 rounded-xl">
            <CheckCircle2 size={24} />
          </div>
          <div>
            <p className="text-sm font-bold text-gray-400 uppercase tracking-widest">Subjects Cleared</p>
            <p className="text-2xl font-black text-gray-900">{passedCount} / {marks.length}</p>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4">
          <div className="p-4 bg-blue-50 text-blue-600 rounded-xl">
            <TrendingUp size={24} />
          </div>
          <div>
            <p className="text-sm font-bold text-gray-400 uppercase tracking-widest">Highest Marks</p>
            <p className="text-2xl font-black text-gray-900">{highestMark} / 100</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4">
          <div className="p-4 bg-purple-50 text-purple-600 rounded-xl">
            <Calendar size={24} />
          </div>
          <div>
            <p className="text-sm font-bold text-gray-400 uppercase tracking-widest">Semester</p>
            <p className="text-2xl font-black text-gray-900">Semester 1</p>
          </div>
        </div>
      </div>

      {/* Main Content: Table Section */}
      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-8 border-b border-gray-50 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-gray-50/30">
          <h2 className="text-xl font-bold text-gray-900">Performance Breakdown</h2>
          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input 
                type="text" 
                placeholder="Search subject..." 
                className="pl-10 pr-4 py-2 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all w-full sm:w-64"
              />
            </div>
            <button className="p-2 bg-white border border-gray-200 rounded-xl text-gray-500 hover:bg-gray-50 transition-colors">
              <Filter size={18} />
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50/50 text-gray-400 text-xs font-bold uppercase tracking-widest">
                <th className="px-8 py-5">Subject Details</th>
                <th className="px-8 py-5">Faculty</th>
                <th className="px-8 py-5">Score Analysis</th>
                <th className="px-8 py-5">Assessment Date</th>
                <th className="px-8 py-5 text-right">Result Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {loading ? (
                <tr>
                  <td colSpan="5" className="px-8 py-20 text-center">
                    <div className="flex flex-col items-center gap-4">
                      <div className="animate-spin h-10 w-10 border-4 border-indigo-600 border-t-transparent rounded-full shadow-lg shadow-indigo-100" />
                      <p className="text-gray-400 font-bold animate-pulse uppercase tracking-widest">Fetching Academic Records...</p>
                    </div>
                  </td>
                </tr>
              ) : error ? (
                <tr>
                  <td colSpan="5" className="px-8 py-20 text-center text-red-500 font-bold">
                    <AlertCircle size={40} className="mx-auto mb-4 opacity-20" />
                    {error}
                  </td>
                </tr>
              ) : marks.length > 0 ? (
                marks.map((mark) => (
                  <tr key={mark._id} className="hover:bg-indigo-50/30 transition-all group">
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-black shadow-sm group-hover:scale-110 transition-transform">
                          {mark.subjectId?.name?.charAt(0)}
                        </div>
                        <div>
                          <p className="font-bold text-gray-900 group-hover:text-indigo-600 transition-colors">
                            {mark.subjectId?.name || 'N/A'}
                          </p>
                          <p className="text-xs text-gray-400 font-bold">CODE: {mark._id?.slice(-6).toUpperCase()}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-xs font-bold text-gray-500 border border-white">
                          {mark.facultyId?.name?.charAt(0)}
                        </div>
                        <span className="text-gray-600 font-medium text-sm">{mark.facultyId?.name || 'Assigned Faculty'}</span>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex flex-col gap-2">
                        <div className="flex items-center justify-between mb-1">
                          <span className={`text-lg font-black ${
                            mark.marks >= 80 ? 'text-green-600' :
                            mark.marks >= 40 ? 'text-orange-500' : 'text-red-600'
                          }`}>
                            {mark.marks}
                            <span className="text-gray-400 text-xs font-bold ml-1">/ 100</span>
                          </span>
                          <span className="text-[10px] font-black text-gray-400 uppercase tracking-tighter">Percentile</span>
                        </div>
                        <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden shadow-inner">
                          <div 
                            className={`h-full rounded-full transition-all duration-1000 ease-out shadow-sm ${
                              mark.marks >= 80 ? 'bg-gradient-to-r from-green-400 to-green-600' :
                              mark.marks >= 40 ? 'bg-gradient-to-r from-orange-400 to-orange-600' : 'bg-gradient-to-r from-red-400 to-red-600'
                            }`}
                            style={{ width: `${mark.marks}%` }}
                          />
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-2 text-gray-500 text-sm font-bold">
                        <Calendar size={14} className="text-indigo-400" />
                        {new Date(mark.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                      </div>
                    </td>
                    <td className="px-8 py-6 text-right">
                      <div className="inline-flex flex-col items-end">
                        <span className={`inline-flex items-center px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest shadow-sm border ${
                          mark.marks >= 40 
                            ? 'bg-green-100 text-green-700 border-green-200' 
                            : 'bg-red-100 text-red-700 border-red-200'
                        }`}>
                          {mark.marks >= 40 ? 'Cleared' : 'Failed'}
                        </span>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="px-8 py-32 text-center">
                    <div className="flex flex-col items-center gap-3">
                      <div className="p-6 bg-gray-50 rounded-full">
                        <BookOpen size={64} className="text-gray-200" />
                      </div>
                      <h3 className="text-xl font-bold text-gray-400">No Academic Records</h3>
                      <p className="text-gray-400 max-w-xs mx-auto">Your marks will appear here once they are updated by the faculty.</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        
        <div className="p-6 bg-indigo-50/50 border-t border-indigo-100 flex items-center gap-3 text-sm text-indigo-700 font-bold">
          <AlertCircle size={20} className="shrink-0 animate-pulse" />
          <span>Need clarification? Contact your respective faculty or the academic coordinator.</span>
        </div>
      </div>
    </div>
  );
};

export default MyMarks;
