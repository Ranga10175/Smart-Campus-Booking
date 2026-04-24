import React from "react";
import { Link, useNavigate } from "react-router-dom";

function Navbar() {
  const navigate = useNavigate();
  const userId = localStorage.getItem("currentUserId");
  const userName = localStorage.getItem("currentUserName");

  const handleLogout = () => {
    localStorage.removeItem("currentUserId");
    localStorage.removeItem("currentUserName");
    navigate("/");
  };

  return (
    <nav className="sticky top-0 z-[100] bg-white/80 backdrop-blur-2xl border-b border-slate-200 px-6 py-4">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        
        {/* Left Side: Auth Buttons (As requested by user) */}
        <div className="flex items-center gap-4">
          {!userId ? (
            <>
              <Link 
                to="/login" 
                className="px-6 py-2.5 rounded-xl bg-slate-900 text-white font-black text-[11px] uppercase tracking-widest shadow-lg shadow-slate-900/20 hover:bg-slate-800 transition-all active:scale-95"
              >
                Login
              </Link>
              <Link 
                to="/register" 
                className="px-6 py-2.5 rounded-xl bg-white text-slate-900 font-black text-[11px] uppercase tracking-widest border border-slate-200 hover:bg-slate-50 transition-all active:scale-95"
              >
                Register
              </Link>
            </>
          ) : (
            <button 
              onClick={handleLogout}
              className="px-6 py-2.5 rounded-xl bg-rose-50 text-rose-600 font-black text-[11px] uppercase tracking-widest border border-rose-100 hover:bg-rose-500 hover:text-white transition-all active:scale-95"
            >
              Logout
            </button>
          )}
        </div>

        {/* Center/Right: Logo & Brand */}
        <Link to="/" className="flex items-center gap-3 group">
          <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center shadow-lg shadow-blue-600/30 group-hover:rotate-12 transition-transform">
            <span className="text-white font-black text-xl">S</span>
          </div>
          <div className="flex flex-col">
            <span className="text-slate-900 font-black text-sm uppercase tracking-tighter leading-none">SLIIT Malabe</span>
            <span className="text-blue-500 font-bold text-[9px] uppercase tracking-[0.2em] leading-none mt-1">Operations Hub</span>
          </div>
        </Link>

        {/* Desktop Menu */}
        {userId && (
            <div className="hidden md:flex items-center gap-8 ml-12">
                <Link to="/home" className="text-[11px] font-black text-slate-400 uppercase tracking-widest hover:text-blue-600 transition-colors">Dashboard</Link>
                <Link to="/create-booking" className="text-[11px] font-black text-slate-400 uppercase tracking-widest hover:text-blue-600 transition-colors">Bookings</Link>
                <Link to="/my-notifications" className="text-[11px] font-black text-slate-400 uppercase tracking-widest hover:text-blue-600 transition-colors">Alerts</Link>
            </div>
        )}

        {/* User Profile Info */}
        {userId && (
            <div className="flex items-center gap-3 pl-6 border-l border-slate-100">
                <div className="text-right hidden sm:block">
                    <div className="text-[10px] font-black text-slate-900 uppercase leading-none">{userName}</div>
                    <div className="text-[8px] font-bold text-blue-500 uppercase tracking-widest mt-1">{userId === 'admin' ? 'Administrator' : 'Student'}</div>
                </div>
                <div className="w-10 h-10 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-400">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                </div>
            </div>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
