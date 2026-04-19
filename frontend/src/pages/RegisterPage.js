import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { registerUser } from "../services/authService";

function RegisterPage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ name: "", itNumber: "", password: "" });
  const [errorStr, setErrorStr] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorStr("");
    
    try {
      await registerUser(formData);
      setLoading(false);
      navigate("/login?registered=true");
    } catch (err) {
      setLoading(false);
      setErrorStr(err.response?.data?.error || "Unable to reach server. Please restart backend!");
    }
  };

  return (
    <div className="w-full mx-auto px-5 pb-12 text-left flex-1 animate-[fadeInUp_0.5s_ease_both] max-w-[480px] mt-16">
      <div className="bg-white/55 backdrop-blur-md border border-white/85 rounded-3xl p-12 mb-6 shadow-[0_8px_32px_0_rgba(31,38,135,0.07)] transition-all duration-300 relative overflow-hidden text-center hover:bg-white/75 hover:border-white hover:-translate-y-1 hover:shadow-[0_12px_40px_0_rgba(31,38,135,0.1)]">
        
        <h2 className="font-['Sora',sans-serif] text-2xl font-bold text-[#0d1f4e] mb-2 tracking-[-0.02em] inline-block relative after:content-[''] after:absolute after:-bottom-1.5 after:left-[calc(50%-30px)] after:w-[60px] after:h-[3px] after:bg-gradient-to-r after:from-[#60a5fa] after:to-[#1e56c8] after:rounded-full">Student Registration</h2>
        <p className="text-[#3b5080] text-[0.92rem] mb-8">Create your account to start booking campus resources.</p>
        
        {errorStr && (
          <div className="bg-[#fee2e2] text-[#dc2626] p-3 rounded-xl mb-4 text-[0.9rem] font-semibold">
            {errorStr}
          </div>
        )}

        <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
          
          <div className="text-left">
            <label className="text-[0.85rem] font-semibold text-[#1a3270] mb-1.5 block">Full Name *</label>
            <input 
              type="text" 
              placeholder="e.g. John Doe"
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              className="w-full font-['Plus_Jakarta_Sans',sans-serif] text-[0.95rem] py-3 px-5 border-[1.5px] border-white/85 rounded-full bg-white/45 text-[#0d1f4e] transition-all duration-300 outline-none block placeholder-[#7a93c4] focus:border-[#1e56c8] focus:shadow-[0_0_0_4px_rgba(30,86,200,0.15)] focus:bg-white hover:not(:focus):border-[#7a93c4] hover:not(:focus):bg-white/65"
              required 
            />
          </div>

          <div className="text-left">
            <label className="text-[0.85rem] font-semibold text-[#1a3270] mb-1.5 block">IT Number *</label>
            <input 
              type="text" 
              placeholder="e.g. IT21000000"
              value={formData.itNumber}
              onChange={(e) => setFormData({...formData, itNumber: e.target.value})}
              className="w-full font-['Plus_Jakarta_Sans',sans-serif] text-[0.95rem] py-3 px-5 border-[1.5px] border-white/85 rounded-full bg-white/45 text-[#0d1f4e] transition-all duration-300 outline-none block placeholder-[#7a93c4] focus:border-[#1e56c8] focus:shadow-[0_0_0_4px_rgba(30,86,200,0.15)] focus:bg-white hover:not(:focus):border-[#7a93c4] hover:not(:focus):bg-white/65"
              required 
            />
          </div>

          <div className="text-left">
            <label className="text-[0.85rem] font-semibold text-[#1a3270] mb-1.5 block">Password *</label>
            <input 
              type="password" 
              placeholder="••••••••"
              value={formData.password}
              onChange={(e) => setFormData({...formData, password: e.target.value})}
              className="w-full font-['Plus_Jakarta_Sans',sans-serif] text-[0.95rem] py-3 px-5 border-[1.5px] border-white/85 rounded-full bg-white/45 text-[#0d1f4e] transition-all duration-300 outline-none block placeholder-[#7a93c4] focus:border-[#1e56c8] focus:shadow-[0_0_0_4px_rgba(30,86,200,0.15)] focus:bg-white hover:not(:focus):border-[#7a93c4] hover:not(:focus):bg-white/65"
              required 
            />
          </div>
          
          <button type="submit" disabled={loading} className="w-full p-3.5 text-[0.95rem] mt-5 bg-gradient-to-br from-[#60a5fa] to-[#3b82f6] shadow-[0_6px_16px_rgba(96,165,250,0.3)] hover:from-[#3b82f6] hover:to-[#1e56c8] hover:shadow-[0_10px_24px_rgba(96,165,250,0.45)] text-white font-bold rounded-full border-none cursor-pointer flex justify-center items-center transition-all duration-300 disabled:opacity-70 disabled:cursor-not-allowed">
            {loading ? "Registering..." : "Create Account"}
          </button>
        </form>

        <p className="mt-7 text-[0.9rem] text-[#3b5080]">
          Already have an account? <Link to="/login" className="text-[#1e56c8] font-bold no-underline hover:text-[#1a3270]">Sign In</Link>
        </p>

      </div>
    </div>
  );
}

export default RegisterPage;
