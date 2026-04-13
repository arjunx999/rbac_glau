import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Mail, Lock, LogIn, AlertCircle, ChevronRight, ShieldCheck } from 'lucide-react';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const result = await login(email, password);
    
    if (result.success) {
      const from = location.state?.from?.pathname || `/${result.role.toLowerCase()}`;
      navigate(from, { replace: true });
    } else {
      setError(result.message);
    }
    
    setLoading(false);
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-slate-50 relative overflow-hidden font-sans">
      {/* Premium Background Mesh Gradients */}
      <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] bg-indigo-100/40 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-[-20%] right-[-10%] w-[60%] h-[60%] bg-blue-100/30 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute top-[30%] left-[40%] w-[30%] h-[30%] bg-purple-100/20 rounded-full blur-[100px] pointer-events-none"></div>

      {/* Main Login Card */}
      <div className="w-full max-w-[480px] px-6 z-10">
        <div className="bg-white border border-slate-200/60 p-10 md:p-12 rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.05)] backdrop-blur-sm transition-all duration-500">
          
          {/* Header Area */}
          <div className="text-center mb-10">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-indigo-600 text-white shadow-2xl shadow-indigo-200 mb-6 group transition-all duration-300 hover:scale-105 active:scale-95">
              <LogIn size={36} className="group-hover:rotate-6 transition-transform" />
            </div>
            <h1 className="text-3xl font-black text-slate-900 tracking-tight leading-tight mb-2">
              RBAC <span className="text-indigo-600">GLAU</span>
            </h1>
            <p className="text-slate-500 font-bold text-lg">Identity Access Management</p>
          </div>

          {/* Error Message Container */}
          {error && (
            <div className="mb-8 animate-in slide-in-from-top-4 duration-500">
              <div className="bg-rose-50 border border-rose-100 p-5 rounded-3xl flex items-start gap-4 shadow-sm ring-1 ring-rose-200/50">
                <div className="flex-shrink-0 w-10 h-10 bg-rose-100 rounded-2xl flex items-center justify-center">
                  <AlertCircle className="text-rose-600" size={20} />
                </div>
                <div className="flex-1 min-w-0">
                  <h5 className="text-sm font-black text-rose-900 leading-tight">Authentication Error</h5>
                  <p className="text-xs font-bold text-rose-700 mt-1 leading-relaxed opacity-90">{error}</p>
                </div>
              </div>
            </div>
          )}

          {/* Login Form */}
          <form className="space-y-8" onSubmit={handleSubmit}>
            {/* Email Field */}
            <div className="space-y-3">
              <label className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] ml-2" htmlFor="email">
                Email Address
              </label>
              <div className="relative group/input">
                <div className="absolute inset-y-0 left-0 pl-6 flex items-center pointer-events-none text-slate-300 group-focus-within/input:text-indigo-600 transition-colors duration-300">
                  <Mail size={20} />
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  placeholder="name@university.edu"
                  className="w-full pl-16 pr-6 py-5 bg-slate-50/50 border border-slate-200 rounded-[1.8rem] text-slate-900 text-sm font-bold focus:outline-none focus:ring-4 focus:ring-indigo-600/5 focus:border-indigo-600 focus:bg-white transition-all duration-300 placeholder:text-slate-300 shadow-sm hover:border-slate-300"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-3">
              <div className="flex items-center justify-between px-2">
                <label className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em]" htmlFor="password">
                  Security Code
                </label>
                <button type="button" className="text-[10px] font-black text-indigo-600 uppercase tracking-tighter hover:text-indigo-800 transition-colors">
                  Forgot Password?
                </button>
              </div>
              <div className="relative group/input">
                <div className="absolute inset-y-0 left-0 pl-6 flex items-center pointer-events-none text-slate-300 group-focus-within/input:text-indigo-600 transition-colors duration-300">
                  <Lock size={20} />
                </div>
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  placeholder="••••••••••••"
                  className="w-full pl-16 pr-6 py-5 bg-slate-50/50 border border-slate-200 rounded-[1.8rem] text-slate-900 text-sm font-bold focus:outline-none focus:ring-4 focus:ring-indigo-600/5 focus:border-indigo-600 focus:bg-white transition-all duration-300 placeholder:text-slate-300 shadow-sm hover:border-slate-300"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full group/btn relative flex items-center justify-center py-5 px-8 bg-slate-900 text-white text-sm font-black rounded-[1.8rem] hover:bg-indigo-600 active:scale-[0.98] transition-all duration-300 shadow-2xl shadow-indigo-100 disabled:opacity-50 disabled:cursor-not-allowed overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent translate-x-[-100%] group-hover/btn:translate-x-[100%] transition-transform duration-1000"></div>
              
              {loading ? (
                <div className="flex items-center gap-4">
                  <div className="h-5 w-5 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
                  <span className="uppercase tracking-[0.2em] text-[10px]">Processing...</span>
                </div>
              ) : (
                <div className="flex items-center gap-3">
                  <span className="uppercase tracking-[0.15em]">Authorize Access</span>
                  <ChevronRight size={20} className="group-hover/btn:translate-x-1.5 transition-transform" />
                </div>
              )}
            </button>
          </form>

          {/* Security Footer Info */}
          <div className="mt-12 flex flex-col items-center gap-6">
            <div className="h-px w-full bg-slate-100 relative">
              <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 px-4 bg-white text-[9px] font-black text-slate-300 uppercase tracking-[0.4em] whitespace-nowrap">
                End-to-End Encryption
              </div>
            </div>
            
            <div className="flex items-center gap-2 text-slate-400 font-bold text-xs group cursor-default">
              <ShieldCheck size={16} className="text-indigo-400/60 group-hover:text-indigo-500 transition-colors" />
              <span>GLAU Global Security Standard Compliance</span>
            </div>
          </div>
        </div>

        {/* Support Link */}
        <p className="text-center mt-10 text-slate-400 text-sm font-bold">
          Technical assistance needed? <span className="text-indigo-600 hover:text-indigo-700 cursor-pointer transition-colors border-b-2 border-indigo-100 hover:border-indigo-600 pb-0.5">Contact Support</span>
        </p>
      </div>
    </div>
  );
};

export default Login;
