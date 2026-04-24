import React from "react";
import { Link } from "react-router-dom";

function HomePage() {
  const userId = localStorage.getItem("currentUserId");
  const userName = localStorage.getItem("currentUserName");
  const isAdmin = userId === "admin";

  // --- LOGGED IN DASHBOARD VIEW ---
  if (userId) {
    return (
      <div className="max-w-6xl mx-auto space-y-12 pb-24 text-left animate-in fade-in slide-in-from-bottom-4 duration-1000">
        
        {/* Welcome Hero */}
        <div className="relative group rounded-[3rem] overflow-hidden bg-slate-900 p-10 md:p-20 text-white shadow-2xl shadow-slate-950/40">
          <div className="absolute top-0 right-0 -mr-32 -mt-32 w-96 h-96 bg-blue-500/20 rounded-full blur-[120px]"></div>
          <div className="absolute bottom-0 left-0 -ml-32 -mb-32 w-96 h-96 bg-indigo-500/10 rounded-full blur-[100px]"></div>
          
          <div className="relative z-10 space-y-8">
            <div className="inline-flex items-center gap-3 px-5 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/10">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-blue-100">Authenticated Access</span>
            </div>
            
            <div className="space-y-4">
              <h1 className="text-4xl md:text-7xl font-black tracking-tight leading-[1.1]">
                Welcome to <br/>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-300">SLIIT Operations Hub</span>
              </h1>
              <p className="text-slate-400 text-lg md:text-xl font-medium leading-relaxed max-w-2xl">
                Hello, <span className="text-white font-bold">{userName}</span>! Malabe Campus operations are at your fingertips. Choose a module below to proceed.
              </p>
            </div>
          </div>
        </div>

        {/* Modules Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          
          {/* Booking Module */}
          <Link to="/create-booking" className="group bg-white border border-slate-100 rounded-[2.5rem] p-10 transition-all duration-500 hover:shadow-2xl hover:shadow-blue-500/10 hover:-translate-y-2 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-50 rounded-full -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-700"></div>
            <div className="relative z-10 space-y-6">
              <div className="w-16 h-16 rounded-2xl bg-blue-600 text-white flex items-center justify-center shadow-lg shadow-blue-600/20 group-hover:rotate-6 transition-transform">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
              </div>
              <div className="space-y-2">
                <h3 className="text-2xl font-black text-slate-900 tracking-tight">Resource Booking</h3>
                <p className="text-slate-500 text-sm font-medium leading-relaxed">Reserve lecture halls, labs, and auditoriums instantly.</p>
              </div>
              <div className="flex items-center gap-2 text-blue-600 font-black text-[10px] uppercase tracking-widest pt-4">
                Enter Module <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M13 7l5 5m0 0l-5 5m5-5H6" /></svg>
              </div>
            </div>
          </Link>

          {/* Notifications Module */}
          <Link to={isAdmin ? "/admin-notifications" : "/my-notifications"} className="group bg-white border border-slate-100 rounded-[2.5rem] p-10 transition-all duration-500 hover:shadow-2xl hover:shadow-indigo-500/10 hover:-translate-y-2 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-50 rounded-full -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-700"></div>
            <div className="relative z-10 space-y-6">
              <div className="w-16 h-16 rounded-2xl bg-indigo-600 text-white flex items-center justify-center shadow-lg shadow-indigo-600/20 group-hover:-rotate-6 transition-transform">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" /></svg>
              </div>
              <div className="space-y-2">
                <h3 className="text-2xl font-black text-slate-900 tracking-tight">Notification Hub</h3>
                <p className="text-slate-500 text-sm font-medium leading-relaxed">Stay updated with approvals, system alerts, and news.</p>
              </div>
              <div className="flex items-center gap-2 text-indigo-600 font-black text-[10px] uppercase tracking-widest pt-4">
                View Alerts <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M13 7l5 5m0 0l-5 5m5-5H6" /></svg>
              </div>
            </div>
          </Link>

          {/* Maintenance Module (Coming Soon) */}
          <div className="bg-slate-50/50 border border-slate-100 rounded-[2.5rem] p-10 opacity-60 relative overflow-hidden flex flex-col justify-between">
            <div className="space-y-6">
              <div className="w-16 h-16 rounded-2xl bg-amber-500 text-white flex items-center justify-center shadow-lg shadow-amber-500/10">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" /></svg>
              </div>
              <div className="space-y-2">
                <h3 className="text-2xl font-black text-slate-900 tracking-tight">Asset Maintenance</h3>
                <p className="text-slate-500 text-sm font-medium leading-relaxed">Report technical issues or resource damages.</p>
              </div>
            </div>
            <div className="mt-8">
                <span className="inline-flex items-center text-[8px] font-black uppercase tracking-[0.3em] px-4 py-2 rounded-full bg-slate-200 text-slate-500 border border-slate-300">
                    Coming Soon
                </span>
            </div>
          </div>

        </div>
      </div>
    );
  }

  // --- PUBLIC LANDING VIEW ---
  return (
    <div className="space-y-24 pb-32 animate-in fade-in duration-1000">
      
      {/* Hero Section */}
      <section className="relative min-h-[85vh] flex items-center justify-center overflow-hidden bg-slate-950">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,_rgba(30,58,138,0.2),_transparent_70%)]"></div>
        <div className="absolute top-0 left-0 w-full h-full opacity-20 pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle, #3b82f6 1px, transparent 1px)', backgroundSize: '40px 40px' }}></div>
        
        <div className="relative z-10 max-w-5xl mx-auto px-6 text-center space-y-12">
            <div className="inline-flex items-center gap-3 px-6 py-2.5 rounded-full bg-white/5 backdrop-blur-xl border border-white/10">
                <span className="w-2 h-2 rounded-full bg-blue-500 animate-ping"></span>
                <span className="text-[10px] font-black uppercase tracking-[0.3em] text-blue-200">Malabe Campus Hub</span>
            </div>
            
            <h1 className="text-5xl md:text-8xl font-black text-white tracking-tight leading-[0.95]">
                Smart Campus <br/>
                <span className="text-transparent bg-clip-text bg-gradient-to-tr from-blue-400 via-indigo-400 to-white">Operations</span>
            </h1>

            <p className="text-slate-400 text-lg md:text-2xl font-medium leading-relaxed max-w-3xl mx-auto">
                The unified management ecosystem for SLIIT students and staff. Reserve resources, manage facilities, and stay notified across Malabe Campus.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-6 pt-8">
                <Link to="/register" className="group w-full sm:w-auto px-12 py-6 rounded-[2.5rem] bg-blue-600 text-white font-black text-sm uppercase tracking-[0.2em] shadow-2xl shadow-blue-600/30 hover:bg-blue-500 transition-all hover:scale-105 active:scale-95 flex items-center justify-center gap-4">
                    Get Started Now
                    <svg className="w-5 h-5 group-hover:translate-x-2 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M13 7l5 5m0 0l-5 5m5-5H6" /></svg>
                </Link>
                <Link to="/login" className="w-full sm:w-auto px-12 py-6 rounded-[2.5rem] bg-white/5 backdrop-blur-md border border-white/10 text-white font-black text-sm uppercase tracking-[0.2em] hover:bg-white/10 transition-all active:scale-95">
                    Member Login
                </Link>
            </div>
        </div>

        {/* Floating Shapes */}
        <div className="absolute top-1/4 -left-20 w-64 h-64 bg-blue-600/20 rounded-full blur-[100px] animate-pulse"></div>
        <div className="absolute bottom-1/4 -right-20 w-80 h-80 bg-indigo-600/10 rounded-full blur-[120px]"></div>
      </section>

      {/* Features Section */}
      <section className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {[
                { title: "Smart Booking", desc: "Advanced algorithm to prevent overlapping sessions in all SLIIT auditoriums.", icon: "M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" },
                { title: "Live Monitor", desc: "Real-time session tracking with automated notifications for students.", icon: "M13 10V3L4 14h7v7l9-11h-7z" },
                { title: "Centralized Hub", desc: "One account for all your campus operations, from bookings to support tickets.", icon: "M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2 2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" }
            ].map((f, i) => (
                <div key={i} className="space-y-6 text-left group">
                    <div className="w-16 h-16 rounded-3xl bg-slate-100 flex items-center justify-center text-slate-900 group-hover:bg-blue-600 group-hover:text-white transition-all duration-500 shadow-sm group-hover:shadow-xl group-hover:shadow-blue-600/20">
                        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={f.icon} /></svg>
                    </div>
                    <div className="space-y-3">
                        <h3 className="text-2xl font-black text-slate-900 tracking-tight">{f.title}</h3>
                        <p className="text-slate-500 font-medium leading-relaxed">{f.desc}</p>
                    </div>
                </div>
            ))}
        </div>
      </section>

      {/* Campus Highlight */}
      <section className="max-w-7xl mx-auto px-6">
        <div className="bg-slate-900 rounded-[4rem] p-12 md:p-24 overflow-hidden relative">
            <div className="absolute top-0 right-0 w-1/2 h-full bg-blue-600/10 skew-x-12 translate-x-20"></div>
            <div className="relative z-10 flex flex-col lg:flex-row items-center gap-20">
                <div className="lg:w-1/2 space-y-8 text-left">
                    <h2 className="text-4xl md:text-6xl font-black text-white tracking-tight leading-tight">
                        Powering <br/>
                        <span className="text-blue-500">Malabe Campus</span>
                    </h2>
                    <p className="text-slate-400 text-lg font-medium leading-relaxed">
                        Designed specifically for the SLIIT flagship campus, our system handles thousands of monthly requests with zero downtime. From the Computing Labs to the Grand Auditorium, every space is just a click away.
                    </p>
                    <div className="grid grid-cols-2 gap-8 pt-4">
                        <div>
                            <div className="text-3xl font-black text-white">50+</div>
                            <div className="text-[10px] font-bold text-blue-500 uppercase tracking-widest mt-1">Resources</div>
                        </div>
                        <div>
                            <div className="text-3xl font-black text-white">10k+</div>
                            <div className="text-[10px] font-bold text-blue-500 uppercase tracking-widest mt-1">Active Students</div>
                        </div>
                    </div>
                </div>
                <div className="lg:w-1/2 relative group">
                    <div className="w-full aspect-video rounded-[3rem] bg-slate-800 border border-white/5 overflow-hidden shadow-2xl transition-transform group-hover:scale-[1.02] duration-700">
                        <img src="https://www.sliit.lk/wp-content/uploads/2017/11/SLIIT-Malabe-Campus.jpg" alt="SLIIT Malabe" className="w-full h-full object-cover opacity-60 group-hover:opacity-100 transition-opacity duration-700" />
                    </div>
                    <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-blue-600 rounded-full blur-[80px] opacity-40"></div>
                </div>
            </div>
        </div>
      </section>

    </div>
  );
}

export default HomePage;
