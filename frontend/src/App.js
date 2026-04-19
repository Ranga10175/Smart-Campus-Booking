import React from "react";
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from "react-router-dom";
import HomePage from "./pages/HomePage";
import BookingFormPage from "./pages/BookingFormPage";
import MyBookingsPage from "./pages/MyBookingsPage";
import AdminBookingsPage from "./pages/AdminBookingsPage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";

function Navigation() {
  const location = useLocation();
  const isAuthPage = location.pathname === "/login" || location.pathname === "/register";
  const isHomePage = location.pathname === "/";
  const isUserAdmin = localStorage.getItem("currentUserId") === "admin";

  if (isAuthPage || isHomePage) return null; // Hide the main navbar when they are logging in or on the home page

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
          <Link to="/" className={`${baseLinkClass} ${getActiveClass("/")}`}>Home</Link>
          <Link to="/create-booking" className={`${baseLinkClass} ${getActiveClass("/create-booking")}`}>Create Booking</Link>
          <Link to="/my-bookings" className={`${baseLinkClass} ${getActiveClass("/my-bookings")}`}>My Bookings</Link>
        </>
      )}
      {isUserAdmin && (
        <Link to="/admin-bookings" className={`${baseLinkClass} ${getActiveClass("/admin-bookings")}`}>Admin Desk</Link>
      )}
      <button 
        className="font-['Plus_Jakarta_Sans',sans-serif] text-[0.82rem] font-bold no-underline bg-transparent text-[#dc2626] px-6 py-3 rounded-full tracking-[0.04em] uppercase transition-all duration-300 border border-transparent shadow-none ml-2 hover:bg-red-600/10 hover:border-red-600/30 hover:-translate-y-[2px] hover:shadow-[0_4px_14px_rgba(220,38,38,0.1)] cursor-pointer outline-none"
        onClick={() => { localStorage.clear(); window.location.href="/login"; }}
      >
        Sign Out
      </button>
    </nav>
  );
}

function App() {
  return (
    <Router>
      <div className="text-center min-h-screen flex flex-col">
        <h1 className="font-['Sora',sans-serif] text-[clamp(2rem,5vw,3.5rem)] font-extrabold text-transparent bg-gradient-to-br from-[#0f172a] via-[#1e56c8] to-[#38bdf8] bg-clip-text px-8 pt-10 pb-6 tracking-[-0.04em] leading-[1.2] m-0 drop-shadow-[0_8px_16px_rgba(30,86,200,0.25)] max-md:text-[1.4rem] max-md:p-6 max-md:pb-4">Smart Campus Booking System</h1>

        <Navigation />

        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/create-booking" element={<BookingFormPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/my-bookings" element={<MyBookingsPage />} />
          <Route path="/admin-bookings" element={<AdminBookingsPage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;