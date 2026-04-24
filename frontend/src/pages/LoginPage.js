import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { loginUser } from "../services/authService";

function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [formData, setFormData] = useState({ itNumber: "", password: "" });
  const [role, setRole] = useState("student");
  const [errorStr, setErrorStr] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    if (params.get("registered") === "true") {
      setSuccessMsg("Registration successful! Your credentials have been auto-filled.");
      const it = params.get("it");
      const pw = params.get("pw");
      if (it && pw) {
        setFormData({ itNumber: it, password: pw });
      }
    }
    localStorage.removeItem("currentUserId");
    localStorage.removeItem("currentUserName");
  }, [location.search]);

  const handleMainSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorStr("");
    setSuccessMsg("");

    if (role === "admin") {
      if (formData.itNumber === "admin" && formData.password === "admin123") {
        localStorage.setItem("currentUserId", "admin");
        localStorage.setItem("currentUserName", "Admin Controller");
        setLoading(false);
        navigate("/admin-bookings");
      } else {
        setLoading(false);
        setErrorStr("Invalid Admin Credentials.");
      }
    } else {
      const itRegex = /^IT\d+$/i;
      if (!itRegex.test(formData.itNumber)) {
        setLoading(false);
        setErrorStr("Invalid IT Number format.");
        return;
      }
      try {
        const resp = await loginUser(formData);
        localStorage.setItem("currentUserId", resp.data.itNumber);
        localStorage.setItem("currentUserName", resp.data.name);
        setLoading(false);
        navigate("/dashboard");
      } catch (err) {
        setLoading(false);
        setErrorStr(err.response?.data?.error || "Unable to reach server.");
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f8fafc] p-6 font-['Plus_Jakarta_Sans',sans-serif]">
      <div className="w-full max-w-6xl bg-white rounded-[3rem] shadow-2xl overflow-hidden flex flex-col md:flex-row min-h-[700px] animate-in fade-in zoom-in-95 duration-700">
        
        {/* Left Side: Brand/Visual */}
        <div className="md:w-1/2 bg-slate-900 relative p-12 flex flex-col justify-between overflow-hidden">
          <div className="absolute top-0 right-0 -mr-32 -mt-32 w-96 h-96 bg-blue-600/20 rounded-full blur-[100px]"></div>
          <div className="absolute bottom-0 left-0 -ml-32 -mb-32 w-96 h-96 bg-indigo-600/20 rounded-full blur-[100px]"></div>
          <div className="absolute inset-0 opacity-[0.05]" style={{ backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)', backgroundSize: '40px 40px' }}></div>
          
          <div className="relative z-10">
             <div className="flex items-center gap-3 mb-16">
                <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2-2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                </div>
                <span className="text-xl font-black text-white tracking-tight">SLIIT <span className="text-blue-400">SmartCampus</span></span>
              </div>
              
              <div className="space-y-6">
                <h1 className="text-5xl font-black text-white leading-[1.1] tracking-tight">
                  Connect to your <br/>
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-300">Campus Hub</span>
                </h1>
                <p className="text-slate-400 text-lg font-medium leading-relaxed max-w-md">
                  Experience the next generation of campus resource management. Fast, secure, and always available.
                </p>
              </div>
          </div>

          <div className="relative z-10 pt-12 border-t border-white/5">
            <div className="flex gap-8">
              <div>
                <div className="text-white font-black text-2xl tracking-tighter">50+</div>
                <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Resources</div>
              </div>
              <div>
                <div className="text-white font-black text-2xl tracking-tighter">10k+</div>
                <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Students</div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side: Form */}
        <div className="md:w-1/2 p-12 md:p-20 flex flex-col justify-center bg-white">
          <div className="max-w-md mx-auto w-full space-y-10">
            <div className="text-center md:text-left space-y-2">
              <h2 className="text-3xl font-black text-slate-900 tracking-tight">Welcome Back</h2>
              <p className="text-slate-500 font-medium">Please enter your credentials to continue.</p>
            </div>

            {successMsg && (
              <div className="p-4 bg-emerald-50 border border-emerald-100 rounded-2xl text-emerald-600 text-sm font-bold animate-in fade-in slide-in-from-top-2">
                {successMsg}
              </div>
            )}

            {errorStr && (
              <div className="p-4 bg-rose-50 border border-rose-100 rounded-2xl text-rose-600 text-sm font-bold animate-in fade-in slide-in-from-top-2">
                {errorStr}
              </div>
            )}

            <form onSubmit={handleMainSubmit} className="space-y-6">
              <div className="flex p-1 bg-slate-100 rounded-2xl">
                <button
                  type="button"
                  onClick={() => setRole("student")}
                  className={`flex-1 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${role === "student" ? "bg-white text-blue-600 shadow-sm" : "text-slate-500 hover:text-slate-700"}`}
                >
                  Student
                </button>
                <button
                  type="button"
                  onClick={() => setRole("admin")}
                  className={`flex-1 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${role === "admin" ? "bg-white text-blue-600 shadow-sm" : "text-slate-500 hover:text-slate-700"}`}
                >
                  Administrator
                </button>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">{role === "admin" ? "Admin ID" : "IT Number"}</label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-5 flex items-center text-slate-400 group-focus-within:text-blue-600 transition-colors">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                  <input
                    type="text"
                    value={formData.itNumber}
                    onChange={(e) => setFormData({...formData, itNumber: e.target.value})}
                    placeholder={role === "admin" ? "Username" : "IT21000000"}
                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-4 pl-14 pr-6 font-bold text-slate-900 outline-none focus:bg-white focus:border-blue-500 focus:shadow-2xl focus:shadow-blue-500/5 transition-all"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Password</label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-5 flex items-center text-slate-400 group-focus-within:text-blue-600 transition-colors">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                  </div>
                  <input
                    type="password"
                    value={formData.password}
                    onChange={(e) => setFormData({...formData, password: e.target.value})}
                    placeholder="••••••••"
                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-4 pl-14 pr-6 font-bold text-slate-900 outline-none focus:bg-white focus:border-blue-500 focus:shadow-2xl focus:shadow-blue-500/5 transition-all"
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-5 bg-blue-600 text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-blue-600/20 hover:bg-blue-700 transition-all active:scale-[0.98] disabled:opacity-50 flex items-center justify-center gap-3"
              >
                {loading ? "Authenticating..." : (
                  <>
                    <span>Sign In</span>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                  </>
                )}
              </button>
            </form>

            <div className="pt-8 text-center border-t border-slate-100">
              <p className="text-slate-500 text-sm font-medium">
                New student? <Link to="/register" className="text-blue-600 font-black hover:underline underline-offset-4">Create an Account</Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
