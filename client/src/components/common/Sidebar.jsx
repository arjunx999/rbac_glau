import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { 
  Users, 
  LayoutDashboard, 
  UserPlus, 
  BookOpen, 
  ClipboardCheck, 
  UserCircle,
  ChevronRight
} from 'lucide-react';

const Sidebar = ({ isOpen, onClose }) => {
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
          { to: '/faculty/profile', label: 'My Profile', icon: <UserCircle size={20} /> },
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
    <>
      {/* Mobile Backdrop */}
      <div 
        onClick={onClose}
        className={`fixed inset-0 bg-black/50 backdrop-blur-sm z-20 lg:hidden transition-opacity duration-500 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
      ></div>

      <aside className={`w-72 bg-[#0f172a] text-slate-400 min-h-screen fixed left-0 top-16 pt-8 flex flex-col transition-all duration-500 z-30 border-r border-slate-800/50 shadow-2xl ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="px-6 mb-8">
          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 ml-1">Main Menu</p>
        </div>
        
        <nav className="flex-1 px-4 space-y-1.5">
          {links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              onClick={() => window.innerWidth < 1024 && onClose()}
              end={link.label === 'Dashboard'}
              className={({ isActive }) => 
                `group flex items-center justify-between px-4 py-3.5 rounded-2xl transition-all duration-300 ${
                  isActive 
                    ? 'bg-indigo-600/10 text-indigo-400 font-bold shadow-inner' 
                    : 'hover:bg-slate-800/50 hover:text-slate-200'
                }`
              }
            >
              <div className="flex items-center gap-3.5">
                <div className={({ isActive }) => 
                  `transition-colors duration-300 ${isActive ? 'text-indigo-400' : 'group-hover:text-slate-200'}`
                }>
                  {link.icon}
                </div>
                <span className="text-sm tracking-tight">{link.label}</span>
              </div>
              
              <ChevronRight size={14} className="opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all" />
            </NavLink>
          ))}
        </nav>
        
        <div className="p-8 mt-auto">
          <div className="p-5 bg-slate-800/40 rounded-3xl border border-slate-700/30 backdrop-blur-sm">
            <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Session ID</p>
            <p className="text-[11px] font-mono text-indigo-400/80 break-all">{Math.random().toString(36).substr(2, 9).toUpperCase()}</p>
          </div>
          <p className="mt-6 text-[10px] font-bold text-slate-600 text-center uppercase tracking-tighter">&copy; 2026 RBAC Security Protocol</p>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
