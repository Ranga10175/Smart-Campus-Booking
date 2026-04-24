import React from "react";
import { BrowserRouter as Router, Routes, Route, Link, useLocation, useNavigate, Navigate } from "react-router-dom";
import DashboardPage from "./pages/DashboardPage";
import LandingPage from "./pages/LandingPage";
import BookingFormPage from "./pages/BookingFormPage";
import MyBookingsPage from "./pages/MyBookingsPage";
import AdminBookingsPage from "./pages/AdminBookingsPage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import StudentNotificationsPage from "./pages/StudentNotificationsPage";
import AdminNotificationsPage from "./pages/AdminNotificationsPage";

function Navigation() {
  const location = useLocation();
  const navigate = useNavigate();
  const isAuthPage = location.pathname === "/login" || location.pathname === "/register";
  const isLandingPage = location.pathname === "/";
  const isDashboard = location.pathname === "/dashboard";
  const isLoggedIn = !!localStorage.getItem("currentUserId");
  const isUserAdmin = localStorage.getItem("currentUserId") === "admin";

  // Hide global nav on auth pages, landing page, or dashboard
  if (isAuthPage || isLandingPage || isDashboard) return null;

  const baseLinkClass = "font-['Plus_Jakarta_Sans',sans-serif] text-[0.82rem] font-bold no-underline bg-transparent px-6 py-3 rounded-full tracking-[0.04em] uppercase transition-all duration-300 relative hover:-translate-y-[2px] hover:shadow-[0_4px_14px_rgba(30,86,200,0.1)]";
  
  const getActiveClass = (path) => {
    return location.pathname === path 
      ? "bg-gradient-to-br from-[#1e56c8] to-[#1a3270] text-white shadow-[0_6px_16px_rgba(30,86,200,0.3)]" 
      : "text-[#3b5080] hover:text-[#1e56c8] hover:bg-white/90";
  };

  return (
    <nav className="flex justify-center items-center gap-2 px-4 py-[0.6rem] flex-wrap bg-white/55 backdrop-blur-[24px] border border-white/85 rounded-full shadow-[0_12px_36px_rgba(30,86,200,0.12),inset_0_1px_0_rgba(255,255,255,0.8)] my-6 mx-auto w-max max-md:m-4 max-md:p-3">
      {!isUserAdmin && (
        <>
          <Link to="/dashboard" className={`${baseLinkClass} ${getActiveClass("/dashboard")}`}>Home</Link>
          <Link to="/create-booking" className={`${baseLinkClass} ${getActiveClass("/create-booking")}`}>Create Booking</Link>
          <Link to="/my-bookings" className={`${baseLinkClass} ${getActiveClass("/my-bookings")}`}>My Bookings</Link>
          <Link to="/my-notifications" className={`${baseLinkClass} ${getActiveClass("/my-notifications")}`}>Notifications</Link>
        </>
      )}
      {isUserAdmin && (
        <>
          <Link to="/admin-bookings" className={`${baseLinkClass} ${getActiveClass("/admin-bookings")}`}>Admin Desk</Link>
          <Link to="/admin-notifications" className={`${baseLinkClass} ${getActiveClass("/admin-notifications")}`}>Notifications</Link>
        </>
      )}
      <button 
        className="font-['Plus_Jakarta_Sans',sans-serif] text-[0.82rem] font-bold no-underline bg-transparent text-[#dc2626] px-6 py-3 rounded-full tracking-[0.04em] uppercase transition-all duration-300 border border-transparent shadow-none ml-2 hover:bg-red-600/10 hover:border-red-600/30 hover:-translate-y-[2px] hover:shadow-[0_4px_14px_rgba(220,38,38,0.1)] cursor-pointer outline-none"
        onClick={() => { 
          localStorage.clear(); 
          navigate("/login");
        }}
      >
        Sign Out
      </button>
    </nav>
  );
}

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const isLoggedIn = !!localStorage.getItem("currentUserId");
  if (!isLoggedIn) {
    return <Navigate to="/login" replace />;
  }
  return children;
};

function App() {
  return (
    <Router>
      <div className="text-center min-h-screen flex flex-col">
        <Routes>
          <Route path="/" element={null} />
          <Route path="/dashboard" element={null} />
          <Route path="/login" element={null} />
          <Route path="/register" element={null} />
          <Route path="*" element={<h1 className="font-['Sora',sans-serif] text-[clamp(2rem,5vw,3.5rem)] font-extrabold text-transparent bg-gradient-to-br from-[#0f172a] via-[#1e56c8] to-[#38bdf8] bg-clip-text px-8 pt-10 pb-6 tracking-[-0.04em] leading-[1.2] m-0 drop-shadow-[0_8px_16px_rgba(30,86,200,0.25)] max-md:text-[1.4rem] max-md:p-6 max-md:pb-4">Smart Campus Booking System</h1>} />
        </Routes>

        <Navigation />

        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          
          <Route path="/dashboard" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
          <Route path="/create-booking" element={<ProtectedRoute><BookingFormPage /></ProtectedRoute>} />
          <Route path="/my-bookings" element={<ProtectedRoute><MyBookingsPage /></ProtectedRoute>} />
          <Route path="/my-notifications" element={<ProtectedRoute><StudentNotificationsPage /></ProtectedRoute>} />
          <Route path="/admin-bookings" element={<ProtectedRoute><AdminBookingsPage /></ProtectedRoute>} />
          <Route path="/admin-notifications" element={<ProtectedRoute><AdminNotificationsPage /></ProtectedRoute>} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;