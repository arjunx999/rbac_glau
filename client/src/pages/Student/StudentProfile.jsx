import React from 'react';
import { useAuth } from '../../context/AuthContext';
import {
  User as UserIcon,
  Mail,
  Shield,
  Calendar,
  ChevronLeft,
  Edit,
  Phone,
  MapPin,
  GraduationCap,
  Award,
  Hash,
} from 'lucide-react';
import { Link } from 'react-router-dom';

const StudentProfile = () => {
  const { user } = useAuth();

  // Mocking some additional profile data for completeness while keeping core functionality
  const profileDetails = [
    { label: 'Full Name', value: user?.name, icon: UserIcon, color: 'text-blue-600', bg: 'bg-blue-50' },
    { label: 'Email Address', value: user?.email, icon: Mail, color: 'text-indigo-600', bg: 'bg-indigo-50' },
    { label: 'Roll Number', value: user?.rollNumber || `2026-${user?.id?.slice(-3).toUpperCase() || '001'}`, icon: Hash, color: 'text-purple-600', bg: 'bg-purple-50' },
    { label: 'Student Role', value: 'RBAC Student', icon: Shield, color: 'text-green-600', bg: 'bg-green-50' },
    { label: 'Member Since', value: new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }), icon: Calendar, color: 'text-orange-600', bg: 'bg-orange-50' },
    { label: 'Department', value: 'Computer Science', icon: GraduationCap, color: 'text-red-600', bg: 'bg-red-50' },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex flex-col gap-2">
          <Link 
            to="/student" 
            className="inline-flex items-center text-indigo-600 hover:text-indigo-800 font-bold group transition-colors"
          >
            <ChevronLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
            Back to Dashboard
          </Link>
          <h1 className="text-4xl font-black text-gray-900 tracking-tight">Student Profile</h1>
        </div>
        
        <button className="flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-2xl font-bold shadow-lg shadow-indigo-200 transition-all hover:-translate-y-1">
          <Edit size={20} />
          Edit Profile
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column: Avatar & Quick Info */}
        <div className="lg:col-span-4 space-y-8">
          <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100 text-center relative overflow-hidden group">
            <div className="absolute top-0 left-0 w-full h-24 bg-gradient-to-r from-indigo-500 to-purple-600 opacity-10"></div>
            
            <div className="relative z-10">
              <div className="w-32 h-32 rounded-full bg-gradient-to-br from-indigo-100 to-purple-100 border-4 border-white shadow-xl mx-auto flex items-center justify-center text-5xl font-black text-indigo-600 mb-6 group-hover:scale-105 transition-transform">
                {user?.name?.charAt(0).toUpperCase()}
              </div>
              <h2 className="text-2xl font-black text-gray-900 mb-1">{user?.name}</h2>
              <p className="text-gray-400 font-bold text-xs uppercase tracking-widest mb-4">Undergraduate Student</p>
              
              <div className="flex justify-center gap-2">
                <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border border-green-200">
                  Active
                </span>
                <span className="bg-indigo-100 text-indigo-700 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border border-indigo-200">
                  Semester 1
                </span>
              </div>
            </div>

            <div className="mt-8 pt-8 border-t border-gray-50 grid grid-cols-2 gap-4">
              <div className="text-center">
                <p className="text-2xl font-black text-gray-900">92%</p>
                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Attendance</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-black text-gray-900">8.4</p>
                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Current CGPA</p>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-indigo-600 to-purple-700 rounded-3xl p-8 text-white shadow-xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:rotate-12 transition-transform">
              <Award size={100} />
            </div>
            <h3 className="text-xl font-bold mb-4 relative z-10 flex items-center gap-2">
              <Award size={24} />
              Achievements
            </h3>
            <ul className="space-y-4 relative z-10">
              <li className="flex items-start gap-3 bg-white/10 backdrop-blur-sm p-3 rounded-xl border border-white/10">
                <div className="p-2 bg-white/20 rounded-lg">⭐</div>
                <div>
                  <p className="text-sm font-bold">Top 5 in Class</p>
                  <p className="text-[10px] text-indigo-100 font-medium opacity-80 uppercase tracking-widest">Mathematics</p>
                </div>
              </li>
              <li className="flex items-start gap-3 bg-white/10 backdrop-blur-sm p-3 rounded-xl border border-white/10">
                <div className="p-2 bg-white/20 rounded-lg">🏅</div>
                <div>
                  <p className="text-sm font-bold">Hackathon Runner Up</p>
                  <p className="text-[10px] text-indigo-100 font-medium opacity-80 uppercase tracking-widest">Tech Fest 2026</p>
                </div>
              </li>
            </ul>
          </div>
        </div>

        {/* Right Column: Detailed Info */}
        <div className="lg:col-span-8 space-y-8">
          <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-8 border-b border-gray-50 flex items-center justify-between bg-gray-50/30">
              <h3 className="text-xl font-bold text-gray-900 flex items-center gap-3">
                <UserIcon size={24} className="text-indigo-600" />
                Personal Information
              </h3>
            </div>
            
            <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-8">
              {profileDetails.map((detail) => (
                <div key={detail.label} className="group flex items-start gap-4 p-4 rounded-2xl hover:bg-indigo-50/50 transition-all border border-transparent hover:border-indigo-100">
                  <div className={`${detail.bg} ${detail.color} p-3 rounded-xl shadow-sm group-hover:scale-110 transition-transform`}>
                    <detail.icon size={20} />
                  </div>
                  <div>
                    <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest mb-1">{detail.label}</p>
                    <p className="text-gray-900 font-bold text-lg">{detail.value}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-8 border-b border-gray-50 flex items-center justify-between bg-gray-50/30">
              <h3 className="text-xl font-bold text-gray-900 flex items-center gap-3">
                <Phone size={24} className="text-indigo-600" />
                Contact & Address
              </h3>
            </div>
            
            <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="group flex items-start gap-4 p-4 rounded-2xl hover:bg-indigo-50/50 transition-all border border-transparent hover:border-indigo-100">
                <div className="bg-blue-50 text-blue-600 p-3 rounded-xl shadow-sm group-hover:scale-110 transition-transform">
                  <Phone size={20} />
                </div>
                <div>
                  <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest mb-1">Mobile Number</p>
                  <p className="text-gray-900 font-bold text-lg">+91 98765 43210</p>
                </div>
              </div>
              
              <div className="group flex items-start gap-4 p-4 rounded-2xl hover:bg-indigo-50/50 transition-all border border-transparent hover:border-indigo-100">
                <div className="bg-orange-50 text-orange-600 p-3 rounded-xl shadow-sm group-hover:scale-110 transition-transform">
                  <MapPin size={20} />
                </div>
                <div>
                  <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest mb-1">Residential Address</p>
                  <p className="text-gray-900 font-bold text-lg">Mathura, Uttar Pradesh</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentProfile;
