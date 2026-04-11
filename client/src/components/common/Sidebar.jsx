import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { 
  Users, 
  LayoutDashboard, 
  UserPlus, 
  BookOpen, 
  ClipboardCheck, 
  UserCircle 
} from 'lucide-react';

const Sidebar = () => {
  const { user } = useAuth();

  const getLinks = () => {
    switch (user?.role) {
      case 'ADMIN':
        return [
          { to: '/admin', label: 'Dashboard', icon: <LayoutDashboard size={20} /> },
          { to: '/admin/students', label: 'Students', icon: <Users size={20} /> },
          { to: '/admin/faculty', label: 'Faculty', icon: <UserPlus size={20} /> },
        ];
      case 'FACULTY':
        return [
          { to: '/faculty', label: 'Dashboard', icon: <LayoutDashboard size={20} /> },
          { to: '/faculty/subjects', label: 'My Subjects', icon: <BookOpen size={20} /> },
          { to: '/faculty/marks', label: 'Manage Marks', icon: <ClipboardCheck size={20} /> },
        ];
      case 'STUDENT':
        return [
          { to: '/student', label: 'Dashboard', icon: <LayoutDashboard size={20} /> },
          { to: '/student/marks', label: 'My Marks', icon: <ClipboardCheck size={20} /> },
          { to: '/student/profile', label: 'My Profile', icon: <UserCircle size={20} /> },
        ];
      default:
        return [];
    }
  };

  const links = getLinks();

  return (
    <aside className="w-64 bg-gray-900 text-white min-h-screen fixed left-0 top-16 pt-4 flex flex-col transition-all z-20 shadow-xl">
      <div className="flex-1 px-4 space-y-2">
        {links.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            end={link.label === 'Dashboard'}
            className={({ isActive }) => 
              `flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                isActive 
                  ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-900/20' 
                  : 'text-gray-400 hover:bg-gray-800 hover:text-white'
              }`
            }
          >
            {link.icon}
            <span className="font-medium">{link.label}</span>
          </NavLink>
        ))}
      </div>
      
      <div className="p-6 border-t border-gray-800 text-gray-400 text-sm">
        <p>&copy; 2026 RBAC System</p>
      </div>
    </aside>
  );
};

export default Sidebar;
