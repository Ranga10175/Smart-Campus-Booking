import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createBooking } from "../services/bookingService";

const SLIIT_RESOURCES = [
  { id: "", name: "-- Select a SLIIT Campus Resource --" },
  { id: "AUD-MAIN", name: "Main Auditorium" },
  { id: "AUD-MINI", name: "Mini Auditorium" },
  { id: "LAB-L103", name: "Computing Lab L103" },
  { id: "LAB-L104", name: "Computing Lab L104" },
  { id: "LEC-A501", name: "Lecture Hall A501" },
  { id: "LEC-A502", name: "Lecture Hall A502" },
  { id: "LEC-E204", name: "Engineering Lecture Hall E204" },
  { id: "MEET-01", name: "Library Discussion Room 1" }
];

function BookingFormPage() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    resourceId: "",
    resourceName: "",
    userId: localStorage.getItem("currentUserId") || "",
    userName: localStorage.getItem("currentUserName") || "",
    date: "",
    startTime: "",
    endTime: "",
    purpose: "",
    expectedAttendees: 1,
  });

  const [showModal, setShowModal] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    // Automatically set resourceName based on selected resourceId
    if (name === "resourceId") {
      const selectedResource = SLIIT_RESOURCES.find(r => r.id === value);
      setFormData({
        ...formData,
        resourceId: value,
        resourceName: selectedResource ? selectedResource.name : ""
      });
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await createBooking(formData);
      localStorage.setItem('currentUserId', formData.userId);
      setShowModal(true);

      setFormData({
        resourceId: "",
        resourceName: "",
        userId: localStorage.getItem("currentUserId") || "",
        userName: localStorage.getItem("currentUserName") || "",
        date: "",
        startTime: "",
        endTime: "",
        purpose: "",
        expectedAttendees: 1,
      });
    } catch (error) {
      alert("Error creating booking. Please ensure the backend is running and no times overlap.");
      console.error(error);
    }
  };

  const handleModalOk = () => {
    setShowModal(false);
    navigate("/my-bookings");
  };

  return (
    <div className="page-container">
      <h2>Book a SLIIT Campus Resource</h2>
      <div className="card">
        <form className="booking-form" onSubmit={handleSubmit}>
          
          <div>
            <label style={{ fontSize: "0.85rem", fontWeight: "600", color: "var(--navy-mid)", marginBottom: "6px", display: "block" }}>
              Select Resource *
            </label>
            <select
              name="resourceId"
              value={formData.resourceId}
              onChange={handleChange}
              required
              className="resource-select"
            >
              {SLIIT_RESOURCES.map(r => (
                <option key={r.id} value={r.id} disabled={r.id === ""}>{r.name}</option>
              ))}
            </select>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "15px", marginTop: "15px" }}>
            <div>
              <label style={{ fontSize: "0.85rem", fontWeight: "600", color: "var(--navy-mid)", marginBottom: "6px", display: "block" }}>Student ID *</label>
              <input
                type="text"
                name="userId"
                placeholder="e.g. IT21000000"
                value={formData.userId}
                onChange={handleChange}
                readOnly={!!localStorage.getItem("currentUserId")}
                style={{ backgroundColor: localStorage.getItem("currentUserId") ? "rgba(0,0,0,0.05)" : "var(--glass-input)" }}
                required
              />
            </div>
            <div>
              <label style={{ fontSize: "0.85rem", fontWeight: "600", color: "var(--navy-mid)", marginBottom: "6px", display: "block" }}>Student Name *</label>
              <input
                type="text"
                name="userName"
                placeholder="Your Full Name"
                value={formData.userName}
                onChange={handleChange}
                readOnly={!!localStorage.getItem("currentUserName")}
                style={{ backgroundColor: localStorage.getItem("currentUserName") ? "rgba(0,0,0,0.05)" : "var(--glass-input)" }}
                required
              />
            </div>
          </div>

          <div style={{ marginTop: "15px" }}>
             <label style={{ fontSize: "0.85rem", fontWeight: "600", color: "var(--navy-mid)", marginBottom: "6px", display: "block" }}>Booking Date *</label>
             <input
               type="date"
               name="date"
               value={formData.date}
               onChange={handleChange}
               style={{ cursor: "pointer" }}
               required
             />
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "15px", marginTop: "15px" }}>
            <div>
              <label style={{ fontSize: "0.85rem", fontWeight: "600", color: "var(--navy-mid)", marginBottom: "6px", display: "block" }}>Start Time *</label>
              <input
                type="time"
                name="startTime"
                value={formData.startTime}
                onChange={handleChange}
                style={{ cursor: "pointer" }}
                required
              />
            </div>
            <div>
              <label style={{ fontSize: "0.85rem", fontWeight: "600", color: "var(--navy-mid)", marginBottom: "6px", display: "block" }}>End Time *</label>
              <input
                type="time"
                name="endTime"
                value={formData.endTime}
                onChange={handleChange}
                style={{ cursor: "pointer" }}
                required
              />
            </div>
          </div>

          <div style={{ marginTop: "15px" }}>
             <label style={{ fontSize: "0.85rem", fontWeight: "600", color: "var(--navy-mid)", marginBottom: "6px", display: "block" }}>Purpose of Booking *</label>
             <input
               type="text"
               name="purpose"
               placeholder="e.g. Group Project Meeting, Rehearsal"
               value={formData.purpose}
               onChange={handleChange}
               required
             />
          </div>

          <div style={{ marginTop: "15px" }}>
             <label style={{ fontSize: "0.85rem", fontWeight: "600", color: "var(--navy-mid)", marginBottom: "6px", display: "block" }}>Expected Attendees</label>
             <input
               type="number"
               name="expectedAttendees"
               placeholder="Number of attendees"
               min="1"
               value={formData.expectedAttendees}
               onChange={handleChange}
             />
          </div>

          <div style={{ marginTop: "20px" }}>
            <button type="submit">Submit Booking Request</button>
          </div>
        </form>
      </div>

      {showModal && (
        <div style={{ position: "fixed", top: 0, left: 0, width: "100%", height: "100%", background: "rgba(0,0,0,0.3)", backdropFilter: "blur(6px)", display: "flex", justifyContent: "center", alignItems: "center", zIndex: 1000, animation: "fadeInUp 0.3s ease" }}>
          <div className="card" style={{ width: "360px", textAlign: "center", padding: "2.5rem 2rem", margin: "0" }}>
            <svg viewBox="0 0 24 24" style={{ width: "72px", height: "72px", margin: "0 auto 1.5rem", fill: "none", stroke: "var(--success)", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round", filter: "drop-shadow(0 4px 6px rgba(5,150,105,0.2))" }}>
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
              <polyline points="22 4 12 14.01 9 11.01"></polyline>
            </svg>
            <h3 style={{ fontFamily: "'Sora', sans-serif", fontSize: "1.35rem", color: "var(--navy)", marginBottom: "0.5rem" }}>Successfully Booked!</h3>
            <p style={{ color: "var(--text-mid)", marginBottom: "1.5rem", fontSize: "0.95rem" }}>Your booking request has been entered into the system.</p>
            <button onClick={handleModalOk} style={{ width: "100%", padding: "0.85rem", fontSize: "1rem" }}>OK</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default BookingFormPage;