import React from "react";
import { Link } from "react-router-dom";

function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen bg-[#f8fafc] text-left font-['Plus_Jakarta_Sans',sans-serif]">
      {/* Header */}
      <header className="fixed top-0 w-full z-50 bg-white/70 backdrop-blur-xl border-b border-slate-200/60">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-600/20">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
            </div>
            <span className="text-xl font-black text-slate-900 tracking-tight">SLIIT <span className="text-blue-600">SmartCampus</span></span>
          </div>

          <div className="flex items-center gap-4">
            <Link to="/login" className="px-6 py-2.5 text-sm font-bold text-slate-600 hover:text-blue-600 transition-colors">
              Log in
            </Link>
            <Link to="/register" className="px-6 py-2.5 bg-slate-900 text-white rounded-full text-sm font-bold shadow-xl shadow-slate-950/10 hover:bg-slate-800 transition-all active:scale-95">
              Register
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex-grow pt-20">
        <section className="relative overflow-hidden pt-24 pb-32">
          {/* Background Elements */}
          <div className="absolute top-0 right-0 -mr-64 -mt-64 w-[600px] h-[600px] bg-blue-500/10 rounded-full blur-[120px]"></div>
          <div className="absolute bottom-0 left-0 -ml-64 -mb-64 w-[600px] h-[600px] bg-indigo-500/10 rounded-full blur-[120px]"></div>
          
          <div className="max-w-7xl mx-auto px-6 relative z-10">
            <div className="max-w-3xl space-y-8">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-50 border border-blue-100">
                <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></span>
                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-blue-600">Official SLIIT Malabe Portal</span>
              </div>
              
              <h1 className="text-5xl md:text-7xl font-black text-slate-900 tracking-tight leading-[1.1]">
                Smart Resource <br/>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-500">Management Hub</span>
              </h1>
              
              <p className="text-lg md:text-xl text-slate-500 font-medium leading-relaxed max-w-2xl">
                Streamlining the Malabe campus experience. Book lecture halls, track your sessions, and manage resources with the next-generation Smart Campus platform.
              </p>

              <div className="flex flex-wrap gap-5 pt-4">
                <Link to="/register" className="px-10 py-5 bg-blue-600 text-white rounded-[2rem] font-black shadow-2xl shadow-blue-600/20 hover:bg-blue-700 transition-all hover:-translate-y-1 active:translate-y-0 flex items-center gap-4">
                  <span>Get Started Now</span>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </Link>
                <Link to="/login" className="px-10 py-5 bg-white text-slate-900 border border-slate-200 rounded-[2rem] font-black hover:bg-slate-50 transition-all">
                  Sign In to Dashboard
                </Link>
              </div>

              <div className="flex items-center gap-12 pt-12">
                <div className="space-y-1">
                  <div className="text-3xl font-black text-slate-900 tracking-tighter">50+</div>
                  <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Campus Resources</div>
                </div>
                <div className="w-px h-10 bg-slate-200"></div>
                <div className="space-y-1">
                  <div className="text-3xl font-black text-slate-900 tracking-tighter">1k+</div>
                  <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Monthly Bookings</div>
                </div>
                <div className="w-px h-10 bg-slate-200"></div>
                <div className="space-y-1">
                  <div className="text-3xl font-black text-slate-900 tracking-tighter">24/7</div>
                  <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">System Availability</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Feature Section */}
        <section className="py-24 bg-white">
          <div className="max-w-7xl mx-auto px-6">
            <div className="grid md:grid-cols-3 gap-12">
              {[
                {
                  title: "Instant Booking",
                  desc: "Reserve auditoriums and labs in Malabe with real-time availability checks.",
                  icon: "M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                },
                {
                  title: "Live Monitoring",
                  desc: "Track your active sessions with live countdown timers and status alerts.",
                  icon: "M13 10V3L4 14h7v7l9-11h-7z"
                },
                {
                  title: "Smart Notifications",
                  desc: "Get instant feedback on your requests with direct action links.",
                  icon: "M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                }
              ].map((f, i) => (
                <div key={i} className="group p-8 rounded-[2.5rem] bg-slate-50 border border-slate-100 transition-all hover:bg-white hover:shadow-2xl hover:shadow-slate-200/50 hover:-translate-y-2">
                  <div className="w-14 h-14 rounded-2xl bg-white shadow-lg flex items-center justify-center text-blue-600 mb-8 transition-transform group-hover:scale-110">
                    <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={f.icon} />
                    </svg>
                  </div>
                  <h3 className="text-xl font-black text-slate-900 mb-4">{f.title}</h3>
                  <p className="text-slate-500 font-medium leading-relaxed">{f.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-slate-900 py-20 text-white overflow-hidden relative">
        <div className="absolute top-0 right-0 -mr-32 -mt-32 w-96 h-96 bg-blue-500/10 rounded-full blur-[100px]"></div>
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="grid md:grid-cols-4 gap-12 pb-16 border-b border-white/5">
            <div className="col-span-2 space-y-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center">
                  <svg className="w-6 h-6 text-slate-950" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2-2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                </div>
                <span className="text-xl font-black tracking-tight">SLIIT <span className="text-blue-400">SmartCampus</span></span>
              </div>
              <p className="text-slate-400 font-medium leading-relaxed max-w-sm">
                The integrated operations management system for the Malabe campus environment. Built for students, managed by staff.
              </p>
            </div>
            
            <div className="space-y-6">
              <h4 className="text-xs font-black uppercase tracking-[0.2em] text-white">Platform</h4>
              <ul className="space-y-4 text-slate-400 font-bold text-sm">
                <li><Link to="/register" className="hover:text-blue-400 transition-colors">Booking System</Link></li>
                <li><Link to="/login" className="hover:text-blue-400 transition-colors">Student Dashboard</Link></li>
                <li><Link to="/admin-bookings" className="hover:text-blue-400 transition-colors">Staff Portal</Link></li>
              </ul>
            </div>

            <div className="space-y-6">
              <h4 className="text-xs font-black uppercase tracking-[0.2em] text-white">Location</h4>
              <p className="text-slate-400 font-bold text-sm leading-relaxed">
                SLIIT Malabe Campus,<br/>
                New Kandy Road,<br/>
                Malabe.
              </p>
            </div>
          </div>
          
          <div className="pt-10 flex flex-col md:flex-row justify-between items-center gap-6">
            <p className="text-slate-500 text-xs font-black uppercase tracking-widest">
              © 2026 SLIIT SMART CAMPUS OPERATIONS HUB. ALL RIGHTS RESERVED.
            </p>
            <div className="flex gap-8 text-slate-500 font-black text-[10px] uppercase tracking-widest">
              <Link to="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link>
              <Link to="/terms" className="hover:text-white transition-colors">Terms of Service</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default LandingPage;
