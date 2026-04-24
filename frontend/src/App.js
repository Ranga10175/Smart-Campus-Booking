import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import BookingFormPage from "./pages/BookingFormPage";
import MyBookingsPage from "./pages/MyBookingsPage";
import AdminBookingsPage from "./pages/AdminBookingsPage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import StudentNotificationsPage from "./pages/StudentNotificationsPage";
import AdminNotificationsPage from "./pages/AdminNotificationsPage";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

function App() {
  return (
    <Router>
      <div className="min-h-screen flex flex-col bg-slate-50 font-['Inter',sans-serif]">
        <Navbar />
        
        <main className="flex-grow pt-8">
            <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/home" element={<HomePage />} />
                <Route path="/create-booking" element={<BookingFormPage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
                <Route path="/my-bookings" element={<MyBookingsPage />} />
                <Route path="/my-notifications" element={<StudentNotificationsPage />} />
                <Route path="/admin-bookings" element={<AdminBookingsPage />} />
                <Route path="/admin-notifications" element={<AdminNotificationsPage />} />
            </Routes>
        </main>

        <Footer />
      </div>
    </Router>
  );
}

export default App;