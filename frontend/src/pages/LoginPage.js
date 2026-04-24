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
      setSuccessMsg("Registration successful! Please sign in.");
    }
    // Auto logout previous user when arriving at login
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
        navigate("/"); // Send to central dashboard
      } else {
        setLoading(false);
        setErrorStr("Invalid Admin Credentials. Please use username 'admin' and password 'admin123'.");
      }
    } else {
      const itRegex = /^IT\d+$/i;
      if (!itRegex.test(formData.itNumber)) {
        setLoading(false);
        setErrorStr("Invalid IT Number format. (e.g. IT21000000)");
        return;
      }

      try {
        const resp = await loginUser(formData);
        localStorage.setItem("currentUserId", resp.data.itNumber);
        localStorage.setItem("currentUserName", resp.data.name);
        setLoading(false);
        navigate("/"); // Send to central dashboard
      } catch (err) {
        setLoading(false);
        setErrorStr(err.response?.data?.error || "Unable to reach server.");
      }
    }
  };

  return (
    <div className="min-h-[80vh] flex justify-center items-center px-6">
      <div className="bg-white rounded-[3rem] p-10 md:p-16 w-full max-w-xl shadow-2xl shadow-slate-200/50 border border-slate-100 text-left relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 rounded-full -mr-16 -mt-16"></div>
        
        <div className="relative z-10 space-y-10">
            <div className="space-y-2">
                <h2 className="text-4xl font-black text-slate-900 tracking-tight leading-none">Welcome Back</h2>
                <p className="text-slate-500 font-medium italic">Sign in to the SLIIT Malabe Operations Hub.</p>
            </div>
            
            {successMsg && <div className="p-4 bg-emerald-50 border border-emerald-100 text-emerald-600 rounded-2xl text-sm font-bold">✅ {successMsg}</div>}
            {errorStr && <div className="p-4 bg-rose-50 border border-rose-100 text-rose-600 rounded-2xl text-sm font-bold">{errorStr}</div>}

            <form onSubmit={handleMainSubmit} className="space-y-8">
                <div className="flex items-center gap-6 p-2 bg-slate-50 rounded-2xl border border-slate-100 w-max">
                    {["student", "admin"].map(r => (
                        <label key={r} className={`px-6 py-2 rounded-xl cursor-pointer transition-all ${role === r ? 'bg-white shadow-md text-blue-600 font-black' : 'text-slate-400 font-bold'}`}>
                            <input type="radio" value={r} checked={role === r} onChange={(e) => setRole(e.target.value)} className="hidden" />
                            <span className="text-[10px] uppercase tracking-widest">{r} Login</span>
                        </label>
                    ))}
                </div>

                <div className="space-y-6">
                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 block">
                            {role === "admin" ? "Admin Identifier" : "IT Number"}
                        </label>
                        <input 
                            type="text" 
                            className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-4 px-6 text-slate-900 font-bold outline-none focus:bg-white focus:border-blue-500 transition-all"
                            value={formData.itNumber}
                            onChange={(e) => setFormData({...formData, itNumber: e.target.value})}
                            required 
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 block">Security Key</label>
                        <input 
                            type="password" 
                            className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-4 px-6 text-slate-900 font-bold outline-none focus:bg-white focus:border-blue-500 transition-all"
                            value={formData.password}
                            onChange={(e) => setFormData({...formData, password: e.target.value})}
                            required 
                        />
                    </div>
                </div>
                
                <button type="submit" disabled={loading} className="w-full py-5 rounded-2xl bg-slate-900 text-white font-black text-xs uppercase tracking-[0.2em] shadow-2xl shadow-slate-900/20 hover:bg-slate-800 transition-all active:scale-95">
                    {loading ? "Authenticating..." : "Authorize Access"}
                </button>
            </form>

            <p className="text-center text-sm font-medium text-slate-500">
                New to the system? <Link to="/register" className="text-blue-600 font-black hover:underline">Register Student Account</Link>
            </p>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
