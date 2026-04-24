import React from "react";
import { Link } from "react-router-dom";

function HomePage() {
  const isAdmin = localStorage.getItem("currentUserId") === "admin";

  return (
    <div className="max-w-[900px] w-full mx-auto px-5 pb-16 flex flex-col items-center">
      
      {/* Main Branding Header */}
      <div className="text-center mb-12 mt-8 animate-[fadeInUp_0.5s_ease_both]">
        <h1 className="text-[3.5rem] font-bold text-[#1e56c8] tracking-tight leading-tight mb-4 drop-shadow-[0_4px_10px_rgba(30,86,200,0.25)] font-['Sora',sans-serif]">
          Smart Campus Booking System
        </h1>
        
        <div className="inline-block relative mb-6">
          <h2 className="text-[2rem] font-bold text-[#0d1f4e] font-['Sora',sans-serif] m-0">
            Welcome to SLIIT Operations Hub
          </h2>
          <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-1/2 h-[3px] bg-[#3b82f6] rounded-full"></div>
        </div>

        <p className="text-[#3b5080] text-[1.15rem] max-w-[600px] mx-auto mt-6 font-medium leading-relaxed">
          Centralized management for all campus operations. Select a module below to get started.
        </p>
      </div>

      {/* Modules Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-[850px]">

        {/* Module 1: Resource Booking */}
        <Link to="/create-booking" className="group no-underline">
          <div className="bg-white/60 backdrop-blur-xl border-2 border-blue-500 rounded-[32px] p-10 h-full flex flex-col items-center text-center shadow-[0_20px_50px_rgba(31,38,135,0.08)] transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_30px_60px_rgba(31,38,135,0.12)] group-hover:bg-white/80 relative overflow-hidden">
            <div className="w-20 h-20 rounded-2xl bg-[#3b82f6] flex justify-center items-center mb-8 shadow-[0_10px_20px_rgba(59,130,246,0.3)] transition-transform duration-500 group-hover:scale-110">
              <svg viewBox="0 0 24 24" className="w-10 h-10 fill-none stroke-white stroke-2 stroke-linecap-round stroke-linejoin-round">
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                <line x1="16" y1="2" x2="16" y2="6"></line>
                <line x1="8" y1="2" x2="8" y2="6"></line>
                <line x1="3" y1="10" x2="21" y2="10"></line>
                <path d="M8 14h.01"></path>
                <path d="M12 14h.01"></path>
                <path d="M16 14h.01"></path>
                <path d="M8 18h.01"></path>
                <path d="M12 18h.01"></path>
                <path d="M16 18h.01"></path>
              </svg>
            </div>
            <h3 className="font-['Sora',sans-serif] text-[1.5rem] text-[#0d1f4e] mb-3 font-bold">Resource Booking</h3>
            <p className="text-[#3b5080] text-[0.95rem] leading-relaxed px-4">
              Reserve lecture halls, auditoriums, and labs.
            </p>
            {/* Active Indicator */}
            <div className="absolute top-4 right-4 w-2 h-2 rounded-full bg-blue-500 animate-pulse"></div>
          </div>
        </Link>

        {/* Module 2: Facilities & Assets */}
        <div className="bg-white/60 backdrop-blur-xl border border-white/80 rounded-[32px] p-10 h-full flex flex-col items-center text-center shadow-[0_20px_50px_rgba(31,38,135,0.05)] opacity-80 cursor-default relative overflow-hidden">
          <div className="w-20 h-20 rounded-2xl bg-[#34d399] flex justify-center items-center mb-8 shadow-[0_10px_20px_rgba(52,211,153,0.3)]">
            <svg viewBox="0 0 24 24" className="w-10 h-10 fill-none stroke-white stroke-2 stroke-linecap-round stroke-linejoin-round">
              <rect x="4" y="2" width="16" height="20" rx="2" ry="2"></rect>
              <path d="M12 18h.01"></path>
            </svg>
          </div>
          <h3 className="font-['Sora',sans-serif] text-[1.5rem] text-[#0d1f4e] mb-3 font-bold">Facilities & Assets</h3>
          <p className="text-[#3b5080] text-[0.95rem] leading-relaxed px-4">
            Manage campus infrastructure and physical assets.
          </p>
          <div className="mt-6">
            <span className="inline-flex items-center text-[0.7rem] font-bold uppercase tracking-widest px-4 py-1.5 rounded-full bg-slate-100 text-slate-500 border border-slate-200 shadow-sm">
              Coming Soon
            </span>
          </div>
        </div>

        {/* Module 3: Maintenance Tickets */}
        <div className="bg-white/60 backdrop-blur-xl border border-white/80 rounded-[32px] p-10 h-full flex flex-col items-center text-center shadow-[0_20px_50px_rgba(31,38,135,0.05)] opacity-80 cursor-default relative overflow-hidden">
          <div className="w-20 h-20 rounded-2xl bg-[#fbbf24] flex justify-center items-center mb-8 shadow-[0_10px_20px_rgba(251,191,36,0.3)]">
            <svg viewBox="0 0 24 24" className="w-10 h-10 fill-none stroke-white stroke-2 stroke-linecap-round stroke-linejoin-round">
              <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"></path>
            </svg>
          </div>
          <h3 className="font-['Sora',sans-serif] text-[1.5rem] text-[#0d1f4e] mb-3 font-bold">Maintenance Tickets</h3>
          <p className="text-[#3b5080] text-[0.95rem] leading-relaxed px-4">
            Report issues and track maintenance progress.
          </p>
          <div className="mt-6">
            <span className="inline-flex items-center text-[0.7rem] font-bold uppercase tracking-widest px-4 py-1.5 rounded-full bg-slate-100 text-slate-500 border border-slate-200 shadow-sm">
              Coming Soon
            </span>
          </div>
        </div>

        {/* Module 4: Notifications (Now Active) */}
        <Link to={isAdmin ? "/admin-notifications" : "/my-notifications"} className="group no-underline">
          <div className="bg-white/60 backdrop-blur-xl border border-white/80 rounded-[32px] p-10 h-full flex flex-col items-center text-center shadow-[0_20px_50px_rgba(31,38,135,0.08)] transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_30px_60px_rgba(31,38,135,0.12)] group-hover:bg-white/80 relative overflow-hidden">
            <div className="w-20 h-20 rounded-2xl bg-[#a78bfa] flex justify-center items-center mb-8 shadow-[0_10px_20px_rgba(167,139,250,0.3)] transition-transform duration-500 group-hover:scale-110">
              <svg viewBox="0 0 24 24" className="w-10 h-10 fill-none stroke-white stroke-2 stroke-linecap-round stroke-linejoin-round">
                <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
                <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
              </svg>
            </div>
            <h3 className="font-['Sora',sans-serif] text-[1.5rem] text-[#0d1f4e] mb-3 font-bold">Notifications</h3>
            <p className="text-[#3b5080] text-[0.95rem] leading-relaxed px-4">
              Announcements, alerts, and system messages.
            </p>
            {/* Active Indicator for Notifications */}
            <div className="absolute top-4 right-4 w-2 h-2 rounded-full bg-purple-500 animate-pulse"></div>
          </div>
        </Link>

      </div>
    </div>
  );
}

export default HomePage;
