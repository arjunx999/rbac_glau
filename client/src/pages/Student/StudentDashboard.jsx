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
  AlertCircle
} from 'lucide-react';

const StudentDashboard = () => {
  const { user } = useAuth();
  const [marks, setMarks] = useState([]);
  const [loading, setLoading] = useState(true);

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

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      {/* Welcome Section */}
      <div className="bg-indigo-600 rounded-2xl p-8 text-white shadow-xl shadow-indigo-100 flex flex-col md:flex-row items-center gap-8 relative overflow-hidden">
        <div className="absolute top-0 right-0 p-8 opacity-10">
          <GraduationCap size={160} />
        </div>
        
        <div className="w-24 h-24 rounded-full bg-white bg-opacity-20 backdrop-blur-md flex items-center justify-center text-4xl font-bold border-4 border-white border-opacity-30">
          {user?.name?.charAt(0).toUpperCase() || 'S'}
        </div>
        
        <div className="text-center md:text-left z-10">
          <h1 className="text-3xl font-bold mb-2">Welcome, {user?.name || 'Student'}!</h1>
          <p className="text-indigo-100 flex items-center gap-2 justify-center md:justify-start">
            <Mail size={16} /> {user?.email}
          </p>
          <div className="mt-4 flex flex-wrap gap-2 justify-center md:justify-start">
            <span className="bg-white bg-opacity-20 px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1">
              <Shield size={14} /> Student Role
            </span>
            <span className="bg-green-400 bg-opacity-20 px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1 text-green-50">
              <CheckCircle2 size={14} /> Active Status
            </span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Profile Card */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
              <UserIcon size={20} className="text-indigo-600" />
              Profile Details
            </h3>
            <div className="space-y-4">
              <div>
                <p className="text-xs text-gray-400 uppercase font-bold tracking-wider">Full Name</p>
                <p className="text-gray-900 font-medium">{user?.name}</p>
              </div>
              <div>
                <p className="text-xs text-gray-400 uppercase font-bold tracking-wider">Email Address</p>
                <p className="text-gray-900 font-medium">{user?.email}</p>
              </div>
              <div>
                <p className="text-xs text-gray-400 uppercase font-bold tracking-wider">Member Since</p>
                <p className="text-gray-900 font-medium">{new Date().toLocaleDateString()}</p>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-indigo-500 to-purple-600 p-6 rounded-xl text-white shadow-lg">
            <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
              <Award size={20} />
              Performance
            </h3>
            <div className="text-center">
              <div className="text-4xl font-black mb-1">{calculateAverage()}%</div>
              <p className="text-indigo-100 text-sm">Overall Average</p>
            </div>
          </div>
        </div>

        {/* Marks Table */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center">
              <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                <BookOpen size={20} className="text-indigo-600" />
                Academic Performance
              </h3>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-gray-50 text-gray-500 text-sm font-bold">
                  <tr>
                    <th className="px-6 py-4">Subject</th>
                    <th className="px-6 py-4">Marks</th>
                    <th className="px-6 py-4">Date</th>
                    <th className="px-6 py-4 text-right">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {loading ? (
                    <tr>
                      <td colSpan="4" className="px-6 py-12 text-center">
                        <div className="animate-spin h-6 w-6 border-2 border-indigo-600 border-t-transparent rounded-full mx-auto"></div>
                      </td>
                    </tr>
                  ) : marks.length > 0 ? marks.map((mark) => (
                    <tr key={mark._id} className="hover:bg-gray-50 transition group">
                      <td className="px-6 py-4 font-medium text-gray-900">{mark.subjectId?.name || 'N/A'}</td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <span className={`font-bold ${mark.marks >= 80 ? 'text-green-600' : 'text-orange-600'}`}>
                            {mark.marks}
                          </span>
                          <span className="text-gray-400 text-sm">/ 100</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-gray-500 text-sm flex items-center gap-1.5">
                        <Calendar size={14} />
                        {new Date(mark.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <span className={`inline-flex items-center px-2 py-1 rounded text-xs font-bold ${
                          mark.marks >= 40 ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
                        }`}>
                          {mark.marks >= 40 ? 'Passed' : 'Failed'}
                        </span>
                      </td>
                    </tr>
                  )) : (
                    <tr>
                      <td colSpan="4" className="px-6 py-12 text-center text-gray-500">
                        No marks records found yet.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
            
            <div className="p-4 bg-gray-50 border-t border-gray-100 flex items-center gap-2 text-sm text-gray-500">
              <AlertCircle size={16} />
              <span>Contact faculty if you find any discrepancy in your marks.</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const GraduationCap = ({ size }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c3 3 9 3 12 0v-5"/>
  </svg>
);

export default StudentDashboard;
