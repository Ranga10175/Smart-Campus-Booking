import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getAllBookings, approveBooking, rejectBooking, deleteBooking } from "../services/bookingService";

function AdminBookingsPage() {
  const [bookings, setBookings] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);

  const loadBookings = async () => {
    try {
      const response = await getAllBookings();
      setBookings(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    loadBookings();
  }, []);

  const handleApprove = async (id) => {
    try {
      await approveBooking(id);
      alert("Booking successfully approved!");
      loadBookings();
    } catch (error) {
      console.error(error);
    }
  };

  const handleReject = async (id) => {
    const reason = prompt("Please provide a reason for rejection:");
    if (reason) {
      try {
        await rejectBooking(id, reason);
        alert("Booking rejected.");
        loadBookings();
      } catch (error) {
        console.error(error);
      }
    }
  };

  const handleDelete = (id) => {
    setDeleteConfirmId(id);
  };

  const confirmDelete = async () => {
    if (deleteConfirmId) {
      try {
        await deleteBooking(deleteConfirmId);
        setDeleteConfirmId(null);
        setShowDeleteModal(true);
        loadBookings();
      } catch (error) {
        console.error(error);
        alert("Error deleting booking. Please ensure the backend is running after changes.");
      }
    }
  };

  const filteredBookings = bookings.filter(b => {
    const term = searchTerm.toLowerCase();
    return (
      (b.resourceName && b.resourceName.toLowerCase().includes(term)) ||
      (b.userId && b.userId.toLowerCase().includes(term)) ||
      (b.userName && b.userName.toLowerCase().includes(term)) ||
      (b.status && b.status.toLowerCase().includes(term))
    );
  });

  const getStatusBadge = (status) => {
    switch (status) {
      case 'APPROVED': return <span className="badge badge-success">APPROVED</span>;
      case 'REJECTED': return <span className="badge badge-danger">REJECTED</span>;
      case 'PENDING': return <span className="badge badge-pending">PENDING</span>;
      case 'CANCELLED': return <span className="badge badge-neutral">CANCELLED</span>;
      default: return <span className="badge badge-neutral">{status}</span>;
    }
  };

  return (
    <div className="page-container">
      <h2>Admin Bookings Management</h2>

      <div className="card notification-intro-card">
        <div className="notification-intro-copy">
          <h3>Admin desk notifications are live</h3>
          <p>
            Every booking request, approval, rejection, and cancellation now creates backend notifications
            for the admin desk. Ticket notifications on the admin side are demo data until ticket CRUD is ready.
          </p>
        </div>
        <Link to="/admin-notifications" className="inline-link-button">
          Open admin notifications
        </Link>
      </div>

      <div className="card" style={{ marginBottom: "1.5rem" }}>
        <div style={{ display: "flex", gap: "10px", alignItems: "center", flexWrap: "wrap" }}>
          <label style={{ fontWeight: "600", color: "var(--navy-mid)", whiteSpace: "nowrap", marginBottom: 0 }}>
            Search Bookings:
          </label>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ flex: 1, minWidth: "200px" }}
            placeholder="Search by User ID, Name, Resource, or Status..."
          />
        </div>
      </div>

      {filteredBookings.length === 0 ? (
        <p>No bookings found matching your search term: "{searchTerm}".</p>
      ) : (
        filteredBookings.map((b) => (
          <div className="card" key={b.id}>
            <p><strong>Resource Name:</strong> {b.resourceName}</p>
            <p><strong>Resource ID:</strong> {b.resourceId}</p>
            <p><strong>User ID:</strong> {b.userId}</p>
            <p><strong>User Name:</strong> {b.userName}</p>
            <p><strong>Date:</strong> {b.date}</p>
            <p><strong>Time:</strong> {b.startTime} - {b.endTime}</p>
            <p><strong>Attendees:</strong> {b.expectedAttendees}</p>
            <p><strong>Purpose:</strong> {b.purpose}</p>
            <p><strong>Status:</strong> {getStatusBadge(b.status)}</p>

            {b.status === "PENDING" && (
              <div style={{ marginTop: "1rem", display: "flex", gap: "10px", flexWrap: "wrap" }}>
                <button 
                  onClick={() => handleApprove(b.id)} 
                  style={{ width: "auto" }}>
                  Approve Booking
                </button>
                <button 
                  onClick={() => handleReject(b.id)} 
                  style={{ background: "linear-gradient(135deg, #ef4444, #b91c1c)", width: "auto", boxShadow: "0 4px 16px rgba(220,38,38,0.35)" }}>
                  Reject Booking
                </button>
                <button 
                  onClick={() => handleDelete(b.id)} 
                  style={{ background: "linear-gradient(135deg, #64748b, #475569)", width: "auto", boxShadow: "0 4px 16px rgba(100,116,139,0.35)" }}>
                  Delete
                </button>
              </div>
            )}
            {b.status !== "PENDING" && (
              <div style={{ marginTop: "1rem", display: "flex", gap: "10px", flexWrap: "wrap" }}>
                <button 
                  onClick={() => handleDelete(b.id)} 
                  style={{ background: "linear-gradient(135deg, #ef4444, #b91c1c)", width: "auto", boxShadow: "0 4px 16px rgba(220,38,38,0.35)" }}>
                  Delete Booking
                </button>
              </div>
            )}
          </div>
        ))
      )}

      {deleteConfirmId && (
        <div style={{ position: "fixed", top: 0, left: 0, width: "100%", height: "100%", background: "rgba(0,0,0,0.3)", backdropFilter: "blur(6px)", display: "flex", justifyContent: "center", alignItems: "center", zIndex: 1000, animation: "fadeInUp 0.2s ease" }}>
          <div className="card" style={{ width: "360px", textAlign: "center", padding: "2.5rem 2rem", margin: "0" }}>
            <h3 style={{ fontFamily: "'Sora', sans-serif", fontSize: "1.35rem", color: "var(--danger)", marginBottom: "0.5rem" }}>Confirm Deletion</h3>
            <p style={{ color: "var(--text-mid)", marginBottom: "1.5rem", fontSize: "0.95rem" }}>Are you sure you want to permanently delete this booking?</p>
            <div style={{ display: "flex", gap: "10px", justifyContent: "center" }}>
              <button onClick={() => setDeleteConfirmId(null)} style={{ background: "transparent", color: "var(--navy-mid)", border: "1.5px solid var(--border)", boxShadow: "none" }}>Cancel</button>
              <button onClick={confirmDelete} style={{ background: "linear-gradient(135deg, #ef4444, #b91c1c)", color: "white", boxShadow: "0 4px 16px rgba(220,38,38,0.35)" }}>Delete Now</button>
            </div>
          </div>
        </div>
      )}

      {showDeleteModal && (
        <div style={{ position: "fixed", top: 0, left: 0, width: "100%", height: "100%", background: "rgba(0,0,0,0.3)", backdropFilter: "blur(6px)", display: "flex", justifyContent: "center", alignItems: "center", zIndex: 1000, animation: "fadeInUp 0.3s ease" }}>
          <div className="card" style={{ width: "360px", textAlign: "center", padding: "2.5rem 2rem", margin: "0" }}>
            <svg viewBox="0 0 24 24" style={{ width: "72px", height: "72px", margin: "0 auto 1.5rem", fill: "none", stroke: "var(--danger)", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round", filter: "drop-shadow(0 4px 6px rgba(220,38,38,0.2))" }}>
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
              <polyline points="22 4 12 14.01 9 11.01"></polyline>
            </svg>
            <h3 style={{ fontFamily: "'Sora', sans-serif", fontSize: "1.35rem", color: "var(--navy)", marginBottom: "0.5rem" }}>Deleted Successfully</h3>
            <p style={{ color: "var(--text-mid)", marginBottom: "1.5rem", fontSize: "0.95rem" }}>The booking has been permanently removed.</p>
            <button onClick={() => setShowDeleteModal(false)} style={{ width: "100%", padding: "0.85rem", fontSize: "1rem" }}>OK</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminBookingsPage;
