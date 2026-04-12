import React, { useState, useEffect } from 'react';
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
  Save,
  X,
  Loader2,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import api from '../../services/api';

const StudentProfile = () => {
  const { user, setUser } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '+91 98765 43210',
    address: user?.address || 'Mathura, Uttar Pradesh',
  });

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || '+91 98765 43210',
        address: user.address || 'Mathura, Uttar Pradesh',
      });
    }
  }, [user]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      // Simulating API call delay as backend might not have update route yet
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Update local context
      const updatedUser = { ...user, ...formData };
      localStorage.setItem('user', JSON.stringify(updatedUser));
      if (setUser) setUser(updatedUser);
      
      setIsEditing(false);
      alert('Profile updated successfully!');
    } catch (err) {
      console.error('Error updating profile:', err);
      alert('Failed to update profile.');
    } finally {
      setLoading(false);
    }
  };

  const profileDetails = [
    { label: 'Full Name', value: formData.name, name: 'name', icon: UserIcon, color: 'text-blue-600', bg: 'bg-blue-50' },
    { label: 'Email Address', value: formData.email, name: 'email', icon: Mail, color: 'text-indigo-600', bg: 'bg-indigo-50', readOnly: true },
    { label: 'Roll Number', value: user?.rollNumber || `2026-${user?.id?.slice(-3).toUpperCase() || '001'}`, icon: Hash, color: 'text-purple-600', bg: 'bg-purple-50', readOnly: true },
    { label: 'Student Role', value: 'RBAC Student', icon: Shield, color: 'text-green-600', bg: 'bg-green-50', readOnly: true },
    { label: 'Member Since', value: new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }), icon: Calendar, color: 'text-orange-600', bg: 'bg-orange-50', readOnly: true },
    { label: 'Department', value: 'Computer Science', icon: GraduationCap, color: 'text-red-600', bg: 'bg-red-50', readOnly: true },
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
        
        <div className="flex gap-3">
          {isEditing ? (
            <>
              <button 
                onClick={() => setIsEditing(false)}
                className="flex items-center justify-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-700 px-6 py-3 rounded-2xl font-bold transition-all"
              >
                <X size={20} />
                Cancel
              </button>
              <button 
                onClick={handleSave}
                disabled={loading}
                className="flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-2xl font-bold shadow-lg shadow-indigo-200 transition-all hover:-translate-y-1 disabled:opacity-50 disabled:translate-y-0"
              >
                {loading ? <Loader2 size={20} className="animate-spin" /> : <Save size={20} />}
                Save Changes
              </button>
            </>
          ) : (
            <button 
              onClick={() => setIsEditing(true)}
              className="flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-2xl font-bold shadow-lg shadow-indigo-200 transition-all hover:-translate-y-1"
            >
              <Edit size={20} />
              Edit Profile
            </button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column: Avatar & Quick Info */}
        <div className="lg:col-span-4 space-y-8">
          <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100 text-center relative overflow-hidden group">
            <div className="absolute top-0 left-0 w-full h-24 bg-gradient-to-r from-indigo-500 to-purple-600 opacity-10"></div>
            
            <div className="relative z-10">
              <div className="w-32 h-32 rounded-full bg-gradient-to-br from-indigo-100 to-purple-100 border-4 border-white shadow-xl mx-auto flex items-center justify-center text-5xl font-black text-indigo-600 mb-6 group-hover:scale-105 transition-transform">
                {formData.name?.charAt(0).toUpperCase()}
              </div>
              <h2 className="text-2xl font-black text-gray-900 mb-1">{formData.name}</h2>
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
                  <div className="flex-1">
                    <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest mb-1">{detail.label}</p>
                    {isEditing && !detail.readOnly ? (
                      <input 
                        type="text"
                        name={detail.name}
                        value={detail.value}
                        onChange={handleInputChange}
                        className="w-full bg-white border border-gray-200 rounded-lg px-3 py-2 text-gray-900 font-bold text-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
                      />
                    ) : (
                      <p className="text-gray-900 font-bold text-lg">{detail.value}</p>
                    )}
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
                <div className="flex-1">
                  <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest mb-1">Mobile Number</p>
                  {isEditing ? (
                    <input 
                      type="text"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className="w-full bg-white border border-gray-200 rounded-lg px-3 py-2 text-gray-900 font-bold text-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
                    />
                  ) : (
                    <p className="text-gray-900 font-bold text-lg">{formData.phone}</p>
                  )}
                </div>
              </div>
              
              <div className="group flex items-start gap-4 p-4 rounded-2xl hover:bg-indigo-50/50 transition-all border border-transparent hover:border-indigo-100">
                <div className="bg-orange-50 text-orange-600 p-3 rounded-xl shadow-sm group-hover:scale-110 transition-transform">
                  <MapPin size={20} />
                </div>
                <div className="flex-1">
                  <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest mb-1">Residential Address</p>
                  {isEditing ? (
                    <input 
                      type="text"
                      name="address"
                      value={formData.address}
                      onChange={handleInputChange}
                      className="w-full bg-white border border-gray-200 rounded-lg px-3 py-2 text-gray-900 font-bold text-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
                    />
                  ) : (
                    <p className="text-gray-900 font-bold text-lg">{formData.address}</p>
                  )}
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
