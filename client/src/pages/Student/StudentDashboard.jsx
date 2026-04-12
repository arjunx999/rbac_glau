import React, { useState, useEffect } from 'react';
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
  Clock,
  Layers,
  ChevronRight,
  TrendingUp,
  Percent,
  Edit,
} from 'lucide-react';
import { Link } from 'react-router-dom';

const StudentDashboard = () => {
  const { user } = useAuth();
  const [marks, setMarks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMarks = async () => {
      if (!user?.id) return;
      try {
        const response = await api.get(`/marks/${user.id}`);
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

  const stats = [
    { label: 'Overall Average', value: `${calculateAverage()}%`, icon: Percent, color: 'text-blue-600', bg: 'bg-blue-50', link: '/student/marks' },
    { label: 'Total Subjects', value: marks.length, icon: BookOpen, color: 'text-indigo-600', bg: 'bg-indigo-50', link: '/student/marks' },
    { label: 'Passed', value: marks.filter(m => m.marks >= 40).length, icon: CheckCircle2, color: 'text-green-600', bg: 'bg-green-50', link: '/student/marks' },
    { label: 'Attendance', value: '92%', icon: Clock, color: 'text-purple-600', bg: 'bg-purple-50', link: '/student' },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Welcome Section */}
      <header className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-indigo-600 via-indigo-700 to-purple-700 p-8 md:p-12 text-white shadow-2xl">
        <div className="absolute top-0 right-0 -mr-20 -mt-20 opacity-10">
          <GraduationCap size={320} className="transform -rotate-12" />
        </div>
        
        <div className="relative z-10 flex flex-col md:flex-row items-center gap-8">
          <Link to="/student/profile" className="relative group cursor-pointer">
            <div className="absolute -inset-1 rounded-full bg-white opacity-20 blur group-hover:opacity-40 transition duration-300"></div>
            <div className="relative w-32 h-32 rounded-full bg-white/10 backdrop-blur-xl flex items-center justify-center text-5xl font-bold border-4 border-white/30 shadow-inner group-hover:scale-105 transition-transform">
              {user?.name?.charAt(0).toUpperCase()}
            </div>
            <div className="absolute bottom-1 right-1 w-8 h-8 rounded-full bg-green-400 border-4 border-indigo-700 flex items-center justify-center">
              <div className="w-2 h-2 rounded-full bg-white animate-pulse"></div>
            </div>
          </Link>
          
          <div className="text-center md:text-left">
            <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-3">
              Hello, {user?.name}!
            </h1>
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 text-indigo-100">
              <span className="flex items-center gap-2 bg-white/10 px-4 py-2 rounded-full backdrop-blur-sm border border-white/10">
                <Mail size={18} />
                {user?.email}
              </span>
              <span className="flex items-center gap-2 bg-white/10 px-4 py-2 rounded-full backdrop-blur-sm border border-white/10">
                <Shield size={18} />
                Student ID: {user?.id?.slice(-6).toUpperCase()}
              </span>
            </div>
          </div>
        </div>
      </header>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <Link key={stat.label} to={stat.link} className="group bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md hover:-translate-y-1 transition-all duration-300">
            <div className="flex items-center justify-between mb-4">
              <div className={`${stat.bg} ${stat.color} p-3 rounded-xl`}>
                <stat.icon size={24} />
              </div>
              <span className="text-gray-400 group-hover:text-indigo-600 transition-colors">
                <ChevronRight size={20} />
              </span>
            </div>
            <p className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-1">{stat.label}</p>
            <h3 className="text-3xl font-bold text-gray-900">{stat.value}</h3>
          </Link>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: Student Profile & Quick Links */}
        <div className="space-y-8">
          {/* Profile Section */}
          <section className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden group hover:shadow-md transition-shadow">
            <div className="p-6 border-b border-gray-50 flex items-center justify-between">
              <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                <UserIcon size={24} className="text-indigo-600" />
                Student Profile
              </h2>
              <Link to="/student/profile" className="text-indigo-600 hover:text-indigo-800">
                <Edit size={18} />
              </Link>
            </div>
            <div className="p-6 space-y-6">
              <div className="flex flex-col gap-4">
                <div className="flex items-start gap-4 p-4 rounded-xl bg-gray-50 hover:bg-indigo-50 transition-colors">
                  <div className="p-2 bg-white rounded-lg shadow-sm">
                    <UserIcon size={20} className="text-indigo-600" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-400 font-bold uppercase tracking-widest">Full Name</p>
                    <p className="text-gray-900 font-semibold text-lg">{user?.name}</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-4 p-4 rounded-xl bg-gray-50 hover:bg-indigo-50 transition-colors">
                  <div className="p-2 bg-white rounded-lg shadow-sm">
                    <Mail size={20} className="text-indigo-600" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-400 font-bold uppercase tracking-widest">Email</p>
                    <p className="text-gray-900 font-semibold">{user?.email}</p>
                  </div>
                </div>

                <div className="flex items-start gap-4 p-4 rounded-xl bg-gray-50 hover:bg-indigo-50 transition-colors">
                  <div className="p-2 bg-white rounded-lg shadow-sm">
                    <Calendar size={20} className="text-indigo-600" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-400 font-bold uppercase tracking-widest">Enrolled Date</p>
                    <p className="text-gray-900 font-semibold">{new Date().toLocaleDateString()}</p>
                  </div>
                </div>
              </div>
              
              <div className="pt-4">
                <Link to="/student/profile" className="w-full py-3 px-4 bg-indigo-50 text-indigo-700 font-bold rounded-xl hover:bg-indigo-600 hover:text-white transition-all flex items-center justify-center gap-2 group/btn">
                  View Full Profile
                  <ChevronRight size={18} className="group-hover/btn:translate-x-1 transition-transform" />
                </Link>
              </div>
            </div>
          </section>

          {/* Performance Summary Section */}
          <Link to="/student/marks" className="block bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl p-8 text-white shadow-xl relative overflow-hidden group hover:shadow-2xl transition-all hover:-translate-y-1">
            <div className="absolute top-0 right-0 p-4 opacity-10 transform scale-150 group-hover:rotate-12 transition-transform duration-500">
              <TrendingUp size={100} />
            </div>
            <div className="relative z-10">
              <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                <Award size={24} />
                Academic Standing
              </h2>
              <div className="text-center mb-8">
                <div className="text-6xl font-black mb-2">{calculateAverage()}%</div>
                <p className="text-indigo-100 text-sm font-medium tracking-wide">Overall Performance Index</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 text-center border border-white/10 hover:bg-white/20 transition-colors">
                  <p className="text-3xl font-bold">{marks.filter(m => m.marks >= 40).length}</p>
                  <p className="text-xs text-indigo-100 font-bold uppercase mt-1">Cleared</p>
                </div>
                <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 text-center border border-white/10 hover:bg-white/20 transition-colors">
                  <p className="text-3xl font-bold">{marks.filter(m => m.marks < 40).length}</p>
                  <p className="text-xs text-indigo-100 font-bold uppercase mt-1">Pending</p>
                </div>
              </div>
            </div>
          </Link>
        </div>

        {/* Right Column: Marks & Attendance & Courses */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* Marks Section */}
          <section className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow">
            <div className="p-6 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
              <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                <BookOpen size={24} className="text-indigo-600" />
                Academic Marks
              </h2>
              <Link to="/student/marks" className="text-sm font-semibold text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full hover:bg-indigo-600 hover:text-white transition-all">
                View All
              </Link>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-gray-50 text-gray-400 text-xs font-bold uppercase tracking-widest">
                  <tr>
                    <th className="px-8 py-5">Course / Subject</th>
                    <th className="px-8 py-5">Marks</th>
                    <th className="px-8 py-5">Date</th>
                    <th className="px-8 py-5 text-right">Result</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {loading ? (
                    <tr>
                      <td colSpan="4" className="px-8 py-20 text-center">
                        <div className="flex flex-col items-center gap-4">
                          <div className="animate-spin h-8 w-8 border-4 border-indigo-600 border-t-transparent rounded-full" />
                          <p className="text-gray-400 font-medium animate-pulse">Loading academic data...</p>
                        </div>
                      </td>
                    </tr>
                  ) : marks.length > 0 ? (
                    marks.map((mark) => (
                      <tr key={mark._id} className="hover:bg-indigo-50/30 transition group">
                        <td className="px-8 py-6">
                          <div>
                            <p className="font-bold text-gray-900 group-hover:text-indigo-600 transition-colors">
                              {mark.subjectId?.name || 'N/A'}
                            </p>
                            <p className="text-xs text-gray-400 font-medium">SUB-{mark._id?.slice(-6).toUpperCase()}</p>
                          </div>
                        </td>
                        <td className="px-8 py-6">
                          <div className="flex flex-col gap-2">
                            <div className="flex items-center gap-2">
                              <span className={`text-lg font-black ${
                                mark.marks >= 80 ? 'text-green-600' :
                                mark.marks >= 40 ? 'text-orange-500' : 'text-red-600'
                              }`}>
                                {mark.marks}
                              </span>
                              <span className="text-gray-400 text-sm">/ 100</span>
                            </div>
                            <div className="w-24 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                              <div 
                                className={`h-full rounded-full transition-all duration-1000 ${
                                  mark.marks >= 80 ? 'bg-green-500' :
                                  mark.marks >= 40 ? 'bg-orange-500' : 'bg-red-500'
                                }`}
                                style={{ width: `${mark.marks}%` }}
                              />
                            </div>
                          </div>
                        </td>
                        <td className="px-8 py-6">
                          <div className="flex items-center gap-2 text-gray-500 text-sm font-medium">
                            <Calendar size={14} />
                            {new Date(mark.createdAt).toLocaleDateString()}
                          </div>
                        </td>
                        <td className="px-8 py-6 text-right">
                          <span className={`inline-flex items-center px-4 py-1.5 rounded-full text-xs font-bold shadow-sm ${
                            mark.marks >= 40 
                              ? 'bg-green-100 text-green-700 border border-green-200' 
                              : 'bg-red-100 text-red-700 border border-red-200'
                          }`}>
                            {mark.marks >= 40 ? 'Passed' : 'Failed'}
                          </span>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="4" className="px-8 py-20 text-center">
                        <div className="flex flex-col items-center gap-2">
                          <AlertCircle size={40} className="text-gray-200" />
                          <p className="text-gray-400 font-medium">No academic records found</p>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
            
            <div className="p-4 bg-indigo-50/50 border-t border-indigo-50 flex items-center gap-3 text-sm text-indigo-700 font-medium">
              <AlertCircle size={18} className="shrink-0" />
              <span>Contact faculty if you find any discrepancy in your marks.</span>
            </div>
          </section>

          {/* Bottom Grid: Attendance & Courses */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Attendance Section */}
            <section className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow group">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                  <Clock size={24} className="text-indigo-600" />
                  Attendance
                </h2>
                <div className="w-12 h-12 rounded-full border-4 border-indigo-100 border-t-indigo-600 flex items-center justify-center text-xs font-bold text-indigo-600">
                  92%
                </div>
              </div>
              <div className="space-y-4">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-gray-500 font-medium">Total Lectures</span>
                  <span className="text-gray-900 font-bold">120</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-gray-500 font-medium">Present</span>
                  <span className="text-green-600 font-bold">110</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-gray-500 font-medium">Absent</span>
                  <span className="text-red-500 font-bold">10</span>
                </div>
                <div className="w-full h-2 bg-gray-100 rounded-full mt-4 overflow-hidden">
                  <div className="h-full bg-indigo-600 rounded-full" style={{ width: '92%' }}></div>
                </div>
              </div>
            </section>

            {/* Enrolled Courses Section */}
            <section className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow group">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                  <Layers size={24} className="text-indigo-600" />
                  Courses
                </h2>
                <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Enrolled: {marks.length}</span>
              </div>
              <div className="space-y-3">
                {marks.length > 0 ? (
                  marks.slice(0, 3).map((mark) => (
                    <div key={mark._id} className="flex items-center gap-3 p-3 rounded-xl bg-gray-50 group-hover:bg-indigo-50 transition-colors">
                      <div className="w-10 h-10 rounded-lg bg-white shadow-sm flex items-center justify-center text-indigo-600 font-bold">
                        {mark.subjectId?.name?.charAt(0)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-bold text-gray-900 truncate">{mark.subjectId?.name}</p>
                        <p className="text-xs text-gray-400 font-medium">Regular Course</p>
                      </div>
                      <ChevronRight size={16} className="text-gray-300" />
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-gray-400 text-center py-4">No active courses</p>
                )}
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;