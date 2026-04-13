import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { LogOut, User, Shield, Menu } from 'lucide-react';

const Navbar = () => {
  const { user, logout } = useAuth();

  return (
    <nav className="bg-white/80 backdrop-blur-md border-b border-slate-200/60 h-16 flex items-center justify-between px-4 md:px-8 fixed top-0 left-0 right-0 z-40 shadow-[0_1px_3px_rgba(0,0,0,0.02)] transition-all duration-300">
      <div className="flex items-center gap-4">
        <div className="lg:hidden p-2 text-slate-500 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer">
          <Menu size={20} />
        </div>
        <div className="flex items-center gap-2.5 group cursor-default">
          <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-indigo-200 transform group-hover:scale-105 transition-all duration-300">
            <Shield size={20} />
          </div>
          <div className="flex flex-col">
            <span className="text-lg font-black tracking-tighter text-slate-900 leading-tight">RBAC <span className="text-indigo-600">GLAU</span></span>
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">Security Portal</span>
          </div>
        </div>
      </div>
      
      <div className="flex items-center gap-4 md:gap-6">
        <div className="flex items-center gap-3 pl-4 md:pl-6 border-l border-slate-100">
          <div className="text-right hidden sm:block">
            <p className="text-sm font-black text-slate-900 leading-tight">{user?.name || 'User'}</p>
            <p className="text-[10px] font-black text-indigo-600 uppercase tracking-tighter mt-0.5">{user?.role?.toLowerCase()}</p>
          </div>
          
          <div className="relative group">
            <div className="w-10 h-10 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-400 group-hover:bg-indigo-50 group-hover:text-indigo-600 group-hover:border-indigo-100 transition-all duration-300 shadow-sm cursor-pointer">
              <User size={20} />
            </div>
            {/* Online Status Indicator */}
            <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 border-2 border-white rounded-full"></span>
          </div>

          <button 
            onClick={logout}
            className="w-10 h-10 flex items-center justify-center text-slate-400 hover:bg-rose-50 hover:text-rose-600 rounded-xl transition-all duration-300 group"
            title="Secure Logout"
          >
            <LogOut size={20} className="group-hover:translate-x-0.5 transition-transform" />
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
