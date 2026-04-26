import React, { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getUserBookings, cancelBooking } from "../services/bookingService";

function MyBookingsPage() {
  const [bookings, setBookings] = useState([]);
  const [userIdInput, setUserIdInput] = useState(
    localStorage.getItem("currentUserId") || ""
  );
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [cancelConfirmId, setCancelConfirmId] = useState(null);

  const loadBookings = useCallback(async () => {
    if (!userIdInput) {
      setBookings([]);
      return;
    }

    try {
      const response = await getUserBookings(userIdInput);
      const sortedBookings = [...response.data].sort((a, b) =>
        `${b.date || ""} ${b.startTime || ""}`.localeCompare(`${a.date || ""} ${a.startTime || ""}`)
      );
      setBookings(sortedBookings);
    } catch (error) {
      console.error(error);
      setBookings([]);
    }
  }, [userIdInput]);

  useEffect(() => {
    if (userIdInput) {
      loadBookings();
    }
  }, [userIdInput, loadBookings]);

  const getStatusBadge = (status) => {
    switch (status) {
      case "APPROVED":
        return <span className="badge badge-success">APPROVED</span>;
      case "REJECTED":
        return <span className="badge badge-danger">REJECTED</span>;
      case "PENDING":
        return <span className="badge badge-pending">PENDING</span>;
      case "CANCELLED":
        return <span className="badge badge-warning">CANCELLED</span>;
      default:
        return <span className="badge badge-neutral">{status}</span>;
    }
  };

  const handleCancel = (id) => {
    setCancelConfirmId(id);
  };

  const confirmCancel = async () => {
    if (cancelConfirmId) {
      try {
        await cancelBooking(cancelConfirmId);
        setCancelConfirmId(null);
        setShowCancelModal(true);
        loadBookings();
      } catch (error) {
        console.error(error);
      }
    }
  };

  return (
    <div className="page-container">
      <h2>My Booking Requests</h2>

      <div className="card" style={{ marginBottom: "1.5rem" }}>
        <div style={{ display: "flex", gap: "10px", alignItems: "center", flexWrap: "wrap" }}>
          <label style={{ fontWeight: "600", color: "var(--navy-mid)", whiteSpace: "nowrap", marginBottom: 0 }}>
            View Bookings for User ID:
          </label>
          <input
            type="text"
            value={userIdInput}
            onChange={(e) => setUserIdInput(e.target.value)}
            style={{ width: "200px" }}
            placeholder="e.g. IT21000000"
          />
          <button className="refresh-btn" onClick={loadBookings} style={{ padding: "0.65rem 1rem", marginTop: 0, width: "auto" }}>
            Refresh
          </button>
        </div>
      </div>

      <div className="card notification-intro-card">
        <div className="notification-intro-copy">
          <h3>Need to check updates?</h3>
          <p>
            Booking approval and rejection messages now appear in your student notification panel,
            together with demo ticket updates until the ticket module is completed.
          </p>
        </div>
        <Link to="/my-notifications" className="inline-link-button">
          Open notifications
        </Link>
      </div>

      {bookings.length === 0 ? (
        <p>
          No booking requests found for User ID: <strong>{userIdInput || "N/A"}</strong>. Submit a
          booking first, then check notifications for approval and rejection updates.
        </p>
      ) : (
        bookings.map((b) => (
          <div className="card" key={b.id}>
            <p><strong>Resource Name:</strong> {b.resourceName}</p>
            <p><strong>Resource ID:</strong> {b.resourceId}</p>
            <p><strong>User Name:</strong> {b.userName}</p>
            <p><strong>Date:</strong> {b.date}</p>
            <p><strong>Time:</strong> {b.startTime} - {b.endTime}</p>
            <p><strong>Attendees:</strong> {b.expectedAttendees}</p>
            <p><strong>Purpose:</strong> {b.purpose}</p>
            <p><strong>Status:</strong> {getStatusBadge(b.status)}</p>
            {b.rejectionReason && (
              <p><strong>Reason:</strong> {b.rejectionReason}</p>
            )}

            {(b.status === "APPROVED" || b.status === "PENDING") && (
              <div style={{ marginTop: "10px" }}>
                <button
                  onClick={() => handleCancel(b.id)}
                  style={{ background: "linear-gradient(135deg, #ef4444, #b91c1c)", width: "auto" }}
                >
                  Cancel Booking
                </button>
              </div>
            )}
          </div>
        ))
      )}

      {cancelConfirmId && (
        <div style={{ position: "fixed", top: 0, left: 0, width: "100%", height: "100%", background: "rgba(0,0,0,0.3)", backdropFilter: "blur(6px)", display: "flex", justifyContent: "center", alignItems: "center", zIndex: 1000, animation: "fadeInUp 0.2s ease" }}>
          <div className="card" style={{ width: "360px", textAlign: "center", padding: "2.5rem 2rem", margin: "0" }}>
            <h3 style={{ fontFamily: "'Sora', sans-serif", fontSize: "1.35rem", color: "var(--warning)", marginBottom: "0.5rem" }}>Wait! Cancel Booking?</h3>
            <p style={{ color: "var(--text-mid)", marginBottom: "1.5rem", fontSize: "0.95rem" }}>Are you absolutely sure you want to cancel this booking?</p>
            <div style={{ display: "flex", gap: "10px", justifyContent: "center" }}>
              <button onClick={() => setCancelConfirmId(null)} style={{ background: "transparent", color: "var(--navy-mid)", border: "1.5px solid var(--border)", boxShadow: "none" }}>No, keep it</button>
              <button onClick={confirmCancel} style={{ background: "linear-gradient(135deg, #d97706, #b45309)", color: "white", boxShadow: "0 4px 16px rgba(217,119,6,0.35)" }}>Yes, cancel</button>
            </div>
          </div>
        </div>
      )}

      {showCancelModal && (
        <div style={{ position: "fixed", top: 0, left: 0, width: "100%", height: "100%", background: "rgba(0,0,0,0.3)", backdropFilter: "blur(6px)", display: "flex", justifyContent: "center", alignItems: "center", zIndex: 1000, animation: "fadeInUp 0.3s ease" }}>
          <div className="card" style={{ width: "360px", textAlign: "center", padding: "2.5rem 2rem", margin: "0" }}>
            <svg viewBox="0 0 24 24" style={{ width: "72px", height: "72px", margin: "0 auto 1.5rem", fill: "none", stroke: "var(--danger)", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round", filter: "drop-shadow(0 4px 6px rgba(220,38,38,0.2))" }}>
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
              <polyline points="22 4 12 14.01 9 11.01"></polyline>
            </svg>
            <h3 style={{ fontFamily: "'Sora', sans-serif", fontSize: "1.35rem", color: "var(--navy)", marginBottom: "0.5rem" }}>Cancelled!</h3>
            <p style={{ color: "var(--text-mid)", marginBottom: "1.5rem", fontSize: "0.95rem" }}>Your booking has been successfully cancelled.</p>
            <button onClick={() => setShowCancelModal(false)} style={{ width: "100%", padding: "0.85rem", fontSize: "1rem" }}>OK</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default MyBookingsPage;
