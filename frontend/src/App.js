import "./App.css";
import React from "react";
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from "react-router-dom";
import BookingFormPage from "./pages/BookingFormPage";
import MyBookingsPage from "./pages/MyBookingsPage";
import AdminBookingsPage from "./pages/AdminBookingsPage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import StudentNotificationsPage from "./pages/StudentNotificationsPage";
import AdminNotificationsPage from "./pages/AdminNotificationsPage";

function Navigation() {
  const location = useLocation();
  const isAuthPage = location.pathname === "/login" || location.pathname === "/register";

  if (isAuthPage) return null; // Hide the main navbar when they are logging in

  return (
    <nav className="navbar">
      <Link to="/" className={location.pathname === "/" ? "active" : ""}>Create Booking</Link>
      <Link to="/my-bookings" className={location.pathname === "/my-bookings" ? "active" : ""}>My Bookings</Link>
      <Link to="/my-notifications" className={location.pathname === "/my-notifications" ? "active" : ""}>My Notifications</Link>
      <Link to="/admin-bookings" className={location.pathname === "/admin-bookings" ? "active" : ""}>Admin Desk</Link>
      <Link to="/admin-notifications" className={location.pathname === "/admin-notifications" ? "active" : ""}>Admin Notifications</Link>
      <button 
        className="sign-out-btn"
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
      <div className="App">
        <h1>Smart Campus Booking System</h1>

        <Navigation />

        <Routes>
          <Route path="/" element={<BookingFormPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/my-bookings" element={<MyBookingsPage />} />
          <Route path="/my-notifications" element={<StudentNotificationsPage />} />
          <Route path="/admin-bookings" element={<AdminBookingsPage />} />
          <Route path="/admin-notifications" element={<AdminNotificationsPage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
