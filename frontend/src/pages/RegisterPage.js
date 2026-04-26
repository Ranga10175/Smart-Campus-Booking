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
    <div className="page-container" style={{ maxWidth: "480px", marginTop: "4rem" }}>
      <div className="card" style={{ padding: "3rem 2.5rem", textAlign: "center" }}>
        
        <h2 style={{ marginBottom: "0.5rem" }}>Student Registration</h2>
        <p style={{ color: "var(--text-mid)", marginBottom: "2rem" }}>Create your account to start booking campus resources.</p>
        
        {errorStr && (
          <div style={{ background: "var(--danger-bg)", color: "var(--danger)", padding: "12px", borderRadius: "12px", marginBottom: "1rem", fontSize: "0.9rem" }}>
            {errorStr}
          </div>
        )}

        <form className="booking-form" onSubmit={handleSubmit}>
          
          <div style={{ textAlign: "left" }}>
            <label style={{ fontSize: "0.85rem", fontWeight: "600", color: "var(--navy-mid)", marginBottom: "6px", display: "block" }}>Full Name *</label>
            <input 
              type="text" 
              placeholder="e.g. John Doe"
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              required 
            />
          </div>

          <div style={{ textAlign: "left" }}>
            <label style={{ fontSize: "0.85rem", fontWeight: "600", color: "var(--navy-mid)", marginBottom: "6px", display: "block" }}>IT Number *</label>
            <input 
              type="text" 
              placeholder="e.g. IT21000000"
              value={formData.itNumber}
              onChange={(e) => setFormData({...formData, itNumber: e.target.value})}
              required 
            />
          </div>

          <div style={{ textAlign: "left" }}>
            <label style={{ fontSize: "0.85rem", fontWeight: "600", color: "var(--navy-mid)", marginBottom: "6px", display: "block" }}>Password *</label>
            <input 
              type="password" 
              placeholder="••••••••"
              value={formData.password}
              onChange={(e) => setFormData({...formData, password: e.target.value})}
              required 
            />
          </div>
          
          <button type="submit" disabled={loading} style={{ marginTop: "20px", width: "100%" }}>
            {loading ? "Registering..." : "Create Account"}
          </button>
        </form>

        <p style={{ marginTop: "1.8rem", fontSize: "0.9rem", color: "var(--text-mid)" }}>
          Already have an account? <Link to="/login" style={{ color: "var(--blue-primary)", fontWeight: "700", textDecoration: "none" }}>Sign In</Link>
        </p>

      </div>
    </div>
  );
}

export default RegisterPage;
