import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { registerUser } from "../services/authService";

function RegisterPage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ name: "", itNumber: "", password: "" });
  const [errorStr, setErrorStr] = useState("");
  const [loading, setLoading] = useState(false);

  const validateForm = () => {
    if (formData.name.trim().length < 2) {
      setErrorStr("Name must be at least 2 characters long.");
      return false;
    }
    
    const itRegex = /^IT\d+$/i;
    if (!itRegex.test(formData.itNumber)) {
      setErrorStr("IT Number must start with 'IT' followed by numbers (e.g. IT21000000).");
      return false;
    }

    if (formData.password.length < 6) {
      setErrorStr("Password must be at least 6 characters long.");
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    setErrorStr("");
    
    try {
      await registerUser(formData);
      setLoading(false);
      navigate("/login?registered=true");
    } catch (err) {
      setLoading(false);
      setErrorStr(err.response?.data?.error || "Unable to reach server.");
    }
  };

  return (
    <div className="min-h-[80vh] flex justify-center items-center px-6">
      <div className="bg-white rounded-[3rem] p-10 md:p-16 w-full max-w-xl shadow-2xl shadow-slate-200/50 border border-slate-100 text-left relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 rounded-full -mr-16 -mt-16"></div>
        
        <div className="relative z-10 space-y-10">
            <div className="space-y-2">
                <h2 className="text-4xl font-black text-slate-900 tracking-tight leading-none">Join the Hub</h2>
                <p className="text-slate-500 font-medium italic">Create your student account for SLIIT Malabe Campus.</p>
            </div>
            
            {errorStr && <div className="p-4 bg-rose-50 border border-rose-100 text-rose-600 rounded-2xl text-sm font-bold">{errorStr}</div>}

            <form onSubmit={handleSubmit} className="space-y-8">
                <div className="space-y-6">
                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 block">Full Name</label>
                        <input 
                            type="text" 
                            placeholder="e.g. Malith Perera"
                            className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-4 px-6 text-slate-900 font-bold outline-none focus:bg-white focus:border-blue-500 transition-all"
                            value={formData.name}
                            onChange={(e) => setFormData({...formData, name: e.target.value})}
                            required 
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 block">IT Number</label>
                        <input 
                            type="text" 
                            placeholder="IT21000000"
                            className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-4 px-6 text-slate-900 font-bold outline-none focus:bg-white focus:border-blue-500 transition-all"
                            value={formData.itNumber}
                            onChange={(e) => setFormData({...formData, itNumber: e.target.value})}
                            required 
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 block">Create Password</label>
                        <input 
                            type="password" 
                            className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-4 px-6 text-slate-900 font-bold outline-none focus:bg-white focus:border-blue-500 transition-all"
                            value={formData.password}
                            onChange={(e) => setFormData({...formData, password: e.target.value})}
                            required 
                        />
                    </div>
                </div>
                
                <button type="submit" disabled={loading} className="w-full py-5 rounded-2xl bg-blue-600 text-white font-black text-xs uppercase tracking-[0.2em] shadow-2xl shadow-blue-600/20 hover:bg-blue-700 transition-all active:scale-95">
                    {loading ? "Creating Account..." : "Confirm Registration"}
                </button>
            </form>

            <p className="text-center text-sm font-medium text-slate-500">
                Already have an account? <Link to="/login" className="text-blue-600 font-black hover:underline">Sign In Here</Link>
            </p>
        </div>
      </div>
    </div>
  );
}

export default RegisterPage;
