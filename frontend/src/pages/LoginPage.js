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
    // Check if redirected from registration successful
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
        navigate("/admin-bookings");
      } else {
        setLoading(false);
        setErrorStr("Invalid Admin Credentials. Please use username 'admin' and password 'admin123'.");
      }
    } else {
      try {
        const resp = await loginUser(formData);
        // Validated user! Set their IT Number directly into storage for forms
        localStorage.setItem("currentUserId", resp.data.itNumber);
        localStorage.setItem("currentUserName", resp.data.name);
        setLoading(false);
        navigate("/"); // Send to Create Booking form
      } catch (err) {
        setLoading(false);
        setErrorStr(err.response?.data?.error || "Unable to reach server. Is the Java backend running after the update?");
      }
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen">
      <div className="bg-[#fdfdfd] rounded-[28px] py-12 px-10 w-full max-w-[400px] shadow-[0_20px_50px_rgba(0,0,0,0.05)] text-center">
        <h2 className="m-0 mb-2 text-[1.6rem] text-slate-900 relative inline-block font-extrabold after:content-[''] after:absolute after:-bottom-1.5 after:left-1/2 after:-translate-x-1/2 after:w-[60px] after:h-[3px] after:bg-blue-500 after:rounded-[2px]">Welcome Back</h2>
        <p className="text-slate-500 text-[0.9rem] mb-10">Sign in to the Student Resource Portal.</p>
        
        {successMsg && (
          <div className="bg-emerald-100 text-emerald-800 p-3 rounded-xl mb-6 text-[0.9rem] font-semibold">
            ✅ {successMsg}
          </div>
        )}

        {errorStr && (
          <div className="bg-red-100 text-red-800 p-3 rounded-xl mb-6 text-[0.9rem] font-semibold">
            {errorStr}
          </div>
        )}

        <form onSubmit={handleMainSubmit}>
          <div className="flex justify-center gap-8 mb-8">
            <label className="flex items-center gap-2 cursor-pointer text-slate-600 text-[0.85rem] text-left leading-[1.3]">
              <input 
                type="radio" 
                name="role" 
                value="student" 
                checked={role === "student"}
                onChange={(e) => setRole(e.target.value)}
                className="accent-fuchsia-600 w-[1.1rem] h-[1.1rem] cursor-pointer m-0"
              />
              <span>Student<br/>Login</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer text-slate-600 text-[0.85rem] text-left leading-[1.3]">
              <input 
                type="radio" 
                name="role" 
                value="admin" 
                checked={role === "admin"}
                onChange={(e) => setRole(e.target.value)}
                className="accent-fuchsia-600 w-[1.1rem] h-[1.1rem] cursor-pointer m-0"
              />
              <span>Admin<br/>Login</span>
            </label>
          </div>

          <div className="text-left mb-5">
            <label className="block mb-1.5 text-[0.8rem] font-bold text-slate-900">
              {role === "admin" ? "Admin Username" : "IT Number"}
            </label>
            <input 
              type="text" 
              className="w-full bg-[#f0f4f8] border border-transparent rounded-full py-[0.85rem] px-5 text-[0.95rem] text-slate-800 box-border outline-none transition-all duration-200 focus:bg-white focus:border-blue-500 focus:shadow-[0_0_0_3px_rgba(59,130,246,0.15)]"
              value={formData.itNumber}
              onChange={(e) => setFormData({...formData, itNumber: e.target.value})}
              required 
            />
          </div>

          <div className="text-left mb-5">
            <label className="block mb-1.5 text-[0.8rem] font-bold text-slate-900">Password</label>
            <input 
              type="password" 
              className="w-full bg-[#f0f4f8] border border-transparent rounded-full py-[0.85rem] px-5 text-[0.95rem] text-slate-800 box-border outline-none transition-all duration-200 focus:bg-white focus:border-blue-500 focus:shadow-[0_0_0_3px_rgba(59,130,246,0.15)]"
              value={formData.password}
              onChange={(e) => setFormData({...formData, password: e.target.value})}
              required 
            />
          </div>
          
          <button type="submit" className="w-full bg-blue-500 text-white font-bold py-4 rounded-full border-none text-base cursor-pointer mt-4 transition-all duration-200 shadow-[0_4px_14px_rgba(59,130,246,0.3)] hover:bg-blue-600 hover:-translate-y-0.5" disabled={loading}>
            {loading ? "AUTHENTICATING..." : "SIGN IN"}
          </button>
        </form>

        <p className="mt-8 text-[0.9rem] text-slate-500">
          New student? <Link to="/register" className="text-blue-600 font-bold no-underline">Create an Account</Link>
        </p>

      </div>
    </div>
  );
}

export default LoginPage;
