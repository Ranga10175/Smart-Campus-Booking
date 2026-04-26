import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { loginUser } from "../services/authService";

function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [formData, setFormData] = useState({ itNumber: "", password: "" });
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
  }, [location.search]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorStr("");
    setSuccessMsg("");
    
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
  };

  return (
    <div className="page-container" style={{ maxWidth: "420px", marginTop: "5rem" }}>
      <div className="card" style={{ padding: "3rem 2.5rem", textAlign: "center" }}>
        
        <h2 style={{ marginBottom: "0.5rem" }}>Welcome Back</h2>
        <p style={{ color: "var(--text-mid)", marginBottom: "2.5rem" }}>Sign in to the Student Resource Portal.</p>
        
        {successMsg && (
          <div style={{ background: "var(--success-bg)", color: "var(--success)", padding: "12px", borderRadius: "12px", marginBottom: "1rem", fontSize: "0.9rem", fontWeight: "600" }}>
            ✅ {successMsg}
          </div>
        )}

        {errorStr && (
          <div style={{ background: "var(--danger-bg)", color: "var(--danger)", padding: "12px", borderRadius: "12px", marginBottom: "1rem", fontSize: "0.9rem" }}>
            {errorStr}
          </div>
        )}

        <form className="booking-form" onSubmit={handleSubmit}>
          
          <div style={{ textAlign: "left" }}>
            <label style={{ fontSize: "0.85rem", fontWeight: "600", color: "var(--navy-mid)", marginBottom: "6px", display: "block" }}>IT Number</label>
            <input 
              type="text" 
              placeholder="e.g. IT21000000"
              value={formData.itNumber}
              onChange={(e) => setFormData({...formData, itNumber: e.target.value})}
              required 
            />
          </div>

          <div style={{ textAlign: "left", marginTop: "4px" }}>
            <label style={{ fontSize: "0.85rem", fontWeight: "600", color: "var(--navy-mid)", marginBottom: "6px", display: "block" }}>Password</label>
            <input 
              type="password" 
              placeholder="••••••••"
              value={formData.password}
              onChange={(e) => setFormData({...formData, password: e.target.value})}
              required 
            />
          </div>
          
          <button type="submit" disabled={loading} style={{ marginTop: "24px", width: "100%", padding: "1rem" }}>
            {loading ? "Authenticating..." : "Sign In"}
          </button>
        </form>

        <p style={{ marginTop: "2rem", fontSize: "0.9rem", color: "var(--text-mid)" }}>
          New student? <Link to="/register" style={{ color: "var(--blue-primary)", fontWeight: "700", textDecoration: "none" }}>Create an Account</Link>
        </p>

      </div>
    </div>
  );
}

export default LoginPage;
