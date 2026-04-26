import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { registerUser, socialLogin } from "../services/authService";
import { useClerk } from '@clerk/clerk-react';

function RegisterPage() {
  const { authenticateWithRedirect } = useClerk();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    itNumber: "",
    password: "",
  });
  const [errorStr, setErrorStr] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorStr("");

    const nameRegex = /^[A-Za-z\s]+$/;
    if (!nameRegex.test(formData.name)) {
      setLoading(false);
      setErrorStr("Name can only contain letters and spaces.");
      return;
    }

    const itRegex = /^IT\d+$/i;
    if (!itRegex.test(formData.itNumber)) {
      setLoading(false);
      setErrorStr("Invalid IT Number format. (e.g. IT21000000)");
      return;
    }

    if (formData.password.length < 4 || formData.password.length > 6) {
      setLoading(false);
      setErrorStr("Password must be between 4 and 6 characters.");
      return;
    }

    try {
      await registerUser(formData);
      setLoading(false);
      // Pass IT Number and Password to login page for auto-fill
      navigate(`/login?registered=true&it=${formData.itNumber}&pw=${formData.password}`);
    } catch (err) {
      setLoading(false);
      setErrorStr(err.response?.data?.error || "Unable to reach server.");
    }
  };

  const handleSocialRegister = async (strategy) => {
    try {
      setLoading(true);
      await authenticateWithRedirect({
        strategy: strategy,
        redirectUrl: "/dashboard",
        redirectUrlComplete: "/dashboard"
      });
    } catch (err) {
      setErrorStr(`${strategy} registration failed. Please try again.`);
      setLoading(false);
    }
  };

  const handleGoogleClick = () => {
    handleSocialRegister("oauth_google");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f8fafc] p-6 font-['Plus_Jakarta_Sans',sans-serif]">
      <div className="w-full max-w-6xl bg-white rounded-[3rem] shadow-2xl overflow-hidden flex flex-col md:flex-row-reverse min-h-[700px] animate-in fade-in zoom-in-95 duration-700">
        
        {/* Right Side: Brand/Visual (Swapped for variety) */}
        <div className="md:w-1/2 bg-slate-950 relative p-12 flex flex-col justify-between overflow-hidden">
          <div className="absolute top-0 left-0 -ml-32 -mt-32 w-96 h-96 bg-blue-600/20 rounded-full blur-[100px]"></div>
          <div className="absolute bottom-0 right-0 -mr-32 -mb-32 w-96 h-96 bg-emerald-600/20 rounded-full blur-[100px]"></div>
          
          <div className="relative z-10">
             <div className="flex items-center gap-3 mb-16">
                <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2-2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                </div>
                <span className="text-xl font-black text-white tracking-tight">SLIIT <span className="text-blue-400">SmartCampus</span></span>
              </div>
              
              <div className="space-y-6 text-left">
                <h1 className="text-5xl font-black text-white leading-[1.1] tracking-tight">
                  Join the <br/>
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-emerald-400">Community</span>
                </h1>
                <p className="text-slate-400 text-lg font-medium leading-relaxed max-w-md">
                  Unlock access to all campus facilities. Fast registration for all SLIIT Malabe students.
                </p>
              </div>
          </div>

          <div className="relative z-10 pt-12 text-left">
            <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-3xl p-6 space-y-4">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-emerald-500/20 text-emerald-400 rounded-xl flex items-center justify-center">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div className="text-sm font-bold text-white tracking-tight">Instant Approval Logic</div>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-blue-500/20 text-blue-400 rounded-xl flex items-center justify-center">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
                <div className="text-sm font-bold text-white tracking-tight">Secure Data Protection</div>
              </div>
            </div>
          </div>
        </div>

        {/* Left Side: Form */}
        <div className="md:w-1/2 p-12 md:p-20 flex flex-col justify-center bg-white text-left">
          <div className="max-w-md mx-auto w-full space-y-10">
            <div className="space-y-2">
              <h2 className="text-3xl font-black text-slate-900 tracking-tight">Create Account</h2>
              <p className="text-slate-500 font-medium">Get started with your student portal.</p>
            </div>

            {errorStr && (
              <div className="p-4 bg-rose-50 border border-rose-100 rounded-2xl text-rose-600 text-sm font-bold animate-in fade-in slide-in-from-top-2">
                {errorStr}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Full Name</label>
                {/* Dummy hidden input to catch browser auto-fill */}
                <input type="text" style={{ display: 'none' }} aria-hidden="true" />
                
                <input
                  type="text"
                  id="student_full_name_field_unique"
                  name="student_full_name_field_unique"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  placeholder="Your Full Name"
                  autoComplete="new-off"
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-4 px-6 font-bold text-slate-900 outline-none focus:bg-white focus:border-blue-500 transition-all"
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">IT Number</label>
                {/* Second Trap */}
                <input type="text" style={{ display: 'none' }} aria-hidden="true" />
                <input
                  type="text"
                  id="unique_reg_it_id_v2"
                  name="unique_reg_it_id_v2"
                  value={formData.itNumber}
                  onChange={(e) => setFormData({...formData, itNumber: e.target.value})}
                  placeholder="IT21000000"
                  autoComplete="off-random-string"
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-4 px-6 font-bold text-slate-900 outline-none focus:bg-white focus:border-blue-500 transition-all"
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Password</label>
                {/* Password Trap */}
                <input type="password" style={{ display: 'none' }} aria-hidden="true" />
                <input
                  type="password"
                  id="unique_reg_pass_field_v2"
                  name="unique_reg_pass_field_v2"
                  value={formData.password}
                  onChange={(e) => setFormData({...formData, password: e.target.value})}
                  placeholder="4-6 characters only"
                  autoComplete="new-password"
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-4 px-6 font-bold text-slate-900 outline-none focus:bg-white focus:border-blue-500 transition-all"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-5 bg-blue-600 text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-blue-600/20 hover:bg-blue-700 transition-all active:scale-[0.98] disabled:opacity-50"
              >
                {loading ? "Creating Account..." : "Create Account"}
              </button>

              <div className="relative flex items-center gap-4 py-2">
                <div className="flex-1 h-px bg-slate-100"></div>
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Or Register with</span>
                <div className="flex-1 h-px bg-slate-100"></div>
              </div>

              <button
                type="button"
                onClick={handleGoogleClick}
                disabled={loading}
                className="w-full flex items-center justify-center gap-3 py-4 bg-white border border-slate-200 rounded-2xl font-bold text-slate-700 hover:bg-slate-50 transition-all active:scale-[0.98] disabled:opacity-50"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-1 .67-2.26 1.07-3.71 1.07-2.87 0-5.3-1.94-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.04c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.01H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.99l3.66-2.95z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.01l3.66 2.95c.86-2.59 3.3-4.53 6.16-4.53z"/>
                </svg>
                <span className="text-xs uppercase tracking-widest">Register with Google</span>
              </button>
            </form>

            <div className="pt-8 text-center border-t border-slate-100">
              <p className="text-slate-500 text-sm font-medium">
                Already have an account? <Link to="/login" className="text-blue-600 font-black hover:underline underline-offset-4">Sign In</Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default RegisterPage;
