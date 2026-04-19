import React from "react";
import { Link } from "react-router-dom";

function HomePage() {
  return (
    <div className="max-w-[800px] w-full mx-auto px-5 pb-12 text-left flex-1 animate-[fadeInUp_0.5s_ease_both]">
      <div className="text-center mb-10">
        <h2 className="text-[2.2rem] mb-2 font-['Sora',sans-serif] font-bold text-[#0d1f4e] tracking-[-0.02em] inline-block relative after:content-[''] after:absolute after:-bottom-1.5 after:left-1/2 after:-translate-x-1/2 after:w-[60%] after:h-[3px] after:bg-gradient-to-r after:from-[#60a5fa] after:to-[#1e56c8] after:rounded-full">Welcome to SLIIT Operations Hub</h2>
        <p className="text-[#3b5080] text-[1.1rem] max-w-[600px] mx-auto mt-7">
          Centralized management for all campus operations. Select a module below to get started.
        </p>
      </div>

      <div className="grid grid-cols-[repeat(auto-fit,minmax(300px,1fr))] gap-6">
        
        {/* Booking System (Highlighted) */}
        <Link to="/create-booking" className="no-underline">
          <div className="bg-[linear-gradient(135deg,rgba(255,255,255,0.7),rgba(219,234,254,0.4))] backdrop-blur-md border border-[#60a5fa] border-b-[4px] border-b-[#1e56c8] rounded-[24px] p-10 mb-6 shadow-[0_8px_32px_0_rgba(31,38,135,0.07)] transition-all duration-300 relative overflow-hidden animate-[fadeInUp_0.4s_ease_both] hover:bg-[linear-gradient(135deg,rgba(255,255,255,0.9),rgba(219,234,254,0.6))] hover:-translate-y-1 hover:shadow-[0_12px_40px_0_rgba(31,38,135,0.1)] h-full flex flex-col items-center text-center">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#1e56c8] to-[#3b82f6] flex justify-center items-center mb-6 shadow-[0_8px_16px_rgba(30,86,200,0.25)]">
              <svg viewBox="0 0 24 24" className="w-8 h-8 fill-none stroke-white stroke-2 stroke-linecap-round stroke-linejoin-round">
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
            <h3 className="font-['Sora',sans-serif] text-[1.3rem] text-[#0d1f4e] mb-2 font-bold select-none">Resource Booking</h3>
            <p className="text-[#3b5080] m-0 p-0 text-[0.92rem]">
              Reserve lecture halls, auditoriums, and labs.
            </p>
          </div>
        </Link>

        {/* Facilities & Assets */}
        <div className="bg-white/55 backdrop-blur-md border border-white/85 rounded-[24px] p-10 mb-6 shadow-[0_8px_32px_0_rgba(31,38,135,0.07)] relative overflow-hidden animate-[fadeInUp_0.4s_ease_both] h-full flex flex-col items-center text-center cursor-not-allowed opacity-85">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#10b981] to-[#34d399] flex justify-center items-center mb-6 shadow-[0_8px_16px_rgba(16,185,129,0.25)]">
            <svg viewBox="0 0 24 24" className="w-8 h-8 fill-none stroke-white stroke-2 stroke-linecap-round stroke-linejoin-round">
              <rect x="4" y="2" width="16" height="20" rx="2" ry="2"></rect>
              <path d="M9 22v-4h6v4"></path>
              <path d="M8 6h.01"></path>
              <path d="M16 6h.01"></path>
              <path d="M12 6h.01"></path>
              <path d="M12 10h.01"></path>
              <path d="M12 14h.01"></path>
              <path d="M16 10h.01"></path>
              <path d="M16 14h.01"></path>
              <path d="M8 10h.01"></path>
              <path d="M8 14h.01"></path>
            </svg>
          </div>
          <h3 className="font-['Sora',sans-serif] text-[1.3rem] text-[#0d1f4e] mb-2 font-bold select-none">Facilities & Assets</h3>
          <p className="text-[#3b5080] m-0 p-0 text-[0.92rem]">
            Manage campus infrastructure and physical assets.
          </p>
          <div className="mt-4"><span className="inline-flex items-center text-xs font-bold uppercase tracking-[0.08em] px-[0.85rem] py-[0.35rem] rounded-full shadow-[0_2px_6px_rgba(0,0,0,0.05)] bg-white/80 text-[#3b5080]">Coming Soon</span></div>
        </div>

        {/* Maintenance Tickets */}
        <div className="bg-white/55 backdrop-blur-md border border-white/85 rounded-[24px] p-10 mb-6 shadow-[0_8px_32px_0_rgba(31,38,135,0.07)] relative overflow-hidden animate-[fadeInUp_0.4s_ease_both] h-full flex flex-col items-center text-center cursor-not-allowed opacity-85">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#f59e0b] to-[#fbbf24] flex justify-center items-center mb-6 shadow-[0_8px_16px_rgba(245,158,11,0.25)]">
            <svg viewBox="0 0 24 24" className="w-8 h-8 fill-none stroke-white stroke-2 stroke-linecap-round stroke-linejoin-round">
              <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"></path>
            </svg>
          </div>
          <h3 className="font-['Sora',sans-serif] text-[1.3rem] text-[#0d1f4e] mb-2 font-bold select-none">Maintenance Tickets</h3>
          <p className="text-[#3b5080] m-0 p-0 text-[0.92rem]">
            Report issues and track maintenance progress.
          </p>
          <div className="mt-4"><span className="inline-flex items-center text-xs font-bold uppercase tracking-[0.08em] px-[0.85rem] py-[0.35rem] rounded-full shadow-[0_2px_6px_rgba(0,0,0,0.05)] bg-white/80 text-[#3b5080]">Coming Soon</span></div>
        </div>

        {/* Notifications */}
        <div className="bg-white/55 backdrop-blur-md border border-white/85 rounded-[24px] p-10 mb-6 shadow-[0_8px_32px_0_rgba(31,38,135,0.07)] relative overflow-hidden animate-[fadeInUp_0.4s_ease_both] h-full flex flex-col items-center text-center cursor-not-allowed opacity-85">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#8b5cf6] to-[#a78bfa] flex justify-center items-center mb-6 shadow-[0_8px_16px_rgba(139,92,246,0.25)]">
            <svg viewBox="0 0 24 24" className="w-8 h-8 fill-none stroke-white stroke-2 stroke-linecap-round stroke-linejoin-round">
              <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
              <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
            </svg>
          </div>
          <h3 className="font-['Sora',sans-serif] text-[1.3rem] text-[#0d1f4e] mb-2 font-bold select-none">Notifications</h3>
          <p className="text-[#3b5080] m-0 p-0 text-[0.92rem]">
            Announcements, alerts, and system messages.
          </p>
          <div className="mt-4"><span className="inline-flex items-center text-xs font-bold uppercase tracking-[0.08em] px-[0.85rem] py-[0.35rem] rounded-full shadow-[0_2px_6px_rgba(0,0,0,0.05)] bg-white/80 text-[#3b5080]">Coming Soon</span></div>
        </div>

      </div>
    </div>
  );
}

export default HomePage;
