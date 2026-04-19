import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getAllBookings, approveBooking, rejectBooking, deleteBooking } from "../services/bookingService";

function AdminBookingsPage() {
  const navigate = useNavigate();
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
    const userId = localStorage.getItem("currentUserId");
    if (userId !== "admin") {
      navigate("/");
      return;
    }
    loadBookings();
  }, [navigate]);

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
      case 'APPROVED': return <span className="inline-flex items-center text-xs font-bold uppercase tracking-[0.08em] px-[0.85rem] py-[0.35rem] rounded-full shadow-[0_2px_6px_rgba(0,0,0,0.05)] bg-[#d1fae5] text-[#059669]">APPROVED</span>;
      case 'REJECTED': return <span className="inline-flex items-center text-xs font-bold uppercase tracking-[0.08em] px-[0.85rem] py-[0.35rem] rounded-full shadow-[0_2px_6px_rgba(0,0,0,0.05)] bg-[#fee2e2] text-[#dc2626]">REJECTED</span>;
      case 'PENDING': return <span className="inline-flex items-center text-xs font-bold uppercase tracking-[0.08em] px-[0.85rem] py-[0.35rem] rounded-full shadow-[0_2px_6px_rgba(0,0,0,0.05)] bg-[#ede9fe] text-[#7c3aed]">PENDING</span>;
      case 'CANCELLED': return <span className="inline-flex items-center text-xs font-bold uppercase tracking-[0.08em] px-[0.85rem] py-[0.35rem] rounded-full shadow-[0_2px_6px_rgba(0,0,0,0.05)] bg-white/80 text-[#3b5080]">CANCELLED</span>;
      default: return <span className="inline-flex items-center text-xs font-bold uppercase tracking-[0.08em] px-[0.85rem] py-[0.35rem] rounded-full shadow-[0_2px_6px_rgba(0,0,0,0.05)] bg-white/80 text-[#3b5080]">{status}</span>;
    }
  };

  return (
    <div className="max-w-[680px] w-full mx-auto px-5 pb-12 text-left flex-1 animate-[fadeInUp_0.5s_ease_both]">
      <h2 className="font-['Sora',sans-serif] text-2xl font-bold text-[#0d1f4e] mb-7 tracking-[-0.02em] inline-block relative after:content-[''] after:absolute after:-bottom-1.5 after:left-0 after:w-[60%] after:h-[3px] after:bg-gradient-to-r after:from-[#60a5fa] after:to-[#1e56c8] after:rounded-full">Admin Bookings Management</h2>

      <div className="bg-white/55 backdrop-blur-md border border-white/85 rounded-3xl p-7 mb-6 shadow-[0_8px_32px_0_rgba(31,38,135,0.07)] transition-all duration-300 relative overflow-hidden animate-[fadeInUp_0.4s_ease_both] hover:bg-white/75 hover:border-white hover:-translate-y-1 hover:shadow-[0_12px_40px_0_rgba(31,38,135,0.1)]">
        <div className="flex gap-2.5 items-center flex-wrap">
          <label className="font-semibold text-[#1a3270] whitespace-nowrap m-0 text-[0.85rem]">
            Search Bookings:
          </label>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-1 min-w-[200px] font-['Plus_Jakarta_Sans',sans-serif] text-[0.95rem] py-3 px-5 border-[1.5px] border-white/85 rounded-full bg-white/45 text-[#0d1f4e] transition-all duration-300 outline-none block placeholder-[#7a93c4] focus:border-[#1e56c8] focus:shadow-[0_0_0_4px_rgba(30,86,200,0.15)] focus:bg-white hover:not(:focus):border-[#7a93c4] hover:not(:focus):bg-white/65"
            placeholder="Search by User ID, Name, Resource, or Status..."
          />
        </div>
      </div>

      {filteredBookings.length === 0 ? (
        <p className="bg-white/55 backdrop-blur-md border-2 border-dashed border-white/80 rounded-[24px] p-10 text-center text-[#3b5080] text-base font-medium">No bookings found matching your search term: "{searchTerm}".</p>
      ) : (
        filteredBookings.map((b) => (
          <div className="bg-white/55 backdrop-blur-md border border-white/85 rounded-3xl p-7 mb-6 shadow-[0_8px_32px_0_rgba(31,38,135,0.07)] transition-all duration-300 relative overflow-hidden animate-[fadeInUp_0.4s_ease_both] hover:bg-white/75 hover:border-white hover:-translate-y-1 hover:shadow-[0_12px_40px_0_rgba(31,38,135,0.1)]" key={b.id}>
            <p className="text-[0.92rem] text-[#3b5080] py-1.5 flex items-baseline gap-2 border-b border-white/40"><strong className="font-bold text-[#0d1f4e] min-w-[100px] text-[0.85rem] uppercase tracking-wide">Resource Name:</strong> {b.resourceName}</p>
            <p className="text-[0.92rem] text-[#3b5080] py-1.5 flex items-baseline gap-2 border-b border-white/40"><strong className="font-bold text-[#0d1f4e] min-w-[100px] text-[0.85rem] uppercase tracking-wide">Resource ID:</strong> {b.resourceId}</p>
            <p className="text-[0.92rem] text-[#3b5080] py-1.5 flex items-baseline gap-2 border-b border-white/40"><strong className="font-bold text-[#0d1f4e] min-w-[100px] text-[0.85rem] uppercase tracking-wide">User ID:</strong> {b.userId}</p>
            <p className="text-[0.92rem] text-[#3b5080] py-1.5 flex items-baseline gap-2 border-b border-white/40"><strong className="font-bold text-[#0d1f4e] min-w-[100px] text-[0.85rem] uppercase tracking-wide">User Name:</strong> {b.userName}</p>
            <p className="text-[0.92rem] text-[#3b5080] py-1.5 flex items-baseline gap-2 border-b border-white/40"><strong className="font-bold text-[#0d1f4e] min-w-[100px] text-[0.85rem] uppercase tracking-wide">Date:</strong> {b.date}</p>
            <p className="text-[0.92rem] text-[#3b5080] py-1.5 flex items-baseline gap-2 border-b border-white/40"><strong className="font-bold text-[#0d1f4e] min-w-[100px] text-[0.85rem] uppercase tracking-wide">Time:</strong> {b.startTime} - {b.endTime}</p>
            <p className="text-[0.92rem] text-[#3b5080] py-1.5 flex items-baseline gap-2 border-b border-white/40"><strong className="font-bold text-[#0d1f4e] min-w-[100px] text-[0.85rem] uppercase tracking-wide">Attendees:</strong> {b.expectedAttendees}</p>
            <p className="text-[0.92rem] text-[#3b5080] py-1.5 flex items-baseline gap-2 border-b border-white/40"><strong className="font-bold text-[#0d1f4e] min-w-[100px] text-[0.85rem] uppercase tracking-wide">Purpose:</strong> {b.purpose}</p>
            <p className="text-[0.92rem] text-[#3b5080] py-1.5 flex items-baseline gap-2 mb-3"><strong className="font-bold text-[#0d1f4e] min-w-[100px] text-[0.85rem] uppercase tracking-wide">Status:</strong> {getStatusBadge(b.status)}</p>

            {b.status === "PENDING" && (
              <div className="mt-4 flex gap-2.5 flex-wrap">
                <button 
                  onClick={() => handleApprove(b.id)} 
                  className="w-auto font-['Plus_Jakarta_Sans',sans-serif] text-[0.85rem] font-bold px-5.5 py-2.5 rounded-full transition-all duration-300 tracking-wide bg-gradient-to-br from-[#1e56c8] to-[#1a3270] text-white shadow-[0_4px_12px_rgba(30,86,200,0.25)] uppercase outline-none hover:-translate-y-[3px] hover:shadow-[0_8px_20px_rgba(30,86,200,0.4)] hover:from-[#3b82f6] hover:to-[#1e56c8] active:translate-y-0 active:shadow-[0_2px_6px_rgba(30,86,200,0.3)] border-none cursor-pointer">
                  Approve Booking
                </button>
                <button 
                  onClick={() => handleReject(b.id)} 
                  className="w-auto font-['Plus_Jakarta_Sans',sans-serif] text-[0.85rem] font-bold px-5.5 py-2.5 rounded-full transition-all duration-300 tracking-wide bg-gradient-to-br from-[#ef4444] to-[#b91c1c] text-white shadow-[0_4px_16px_rgba(220,38,38,0.35)] uppercase outline-none hover:-translate-y-[3px] hover:shadow-[0_8px_20px_rgba(220,38,38,0.5)] hover:from-red-400 hover:to-red-600 active:translate-y-0 border-none cursor-pointer">
                  Reject Booking
                </button>
                <button 
                  onClick={() => handleDelete(b.id)} 
                  className="w-auto font-['Plus_Jakarta_Sans',sans-serif] text-[0.85rem] font-bold px-5.5 py-2.5 rounded-full transition-all duration-300 tracking-wide bg-gradient-to-br from-[#64748b] to-[#475569] text-white shadow-[0_4px_16px_rgba(100,116,139,0.35)] uppercase outline-none hover:-translate-y-[3px] hover:shadow-[0_8px_20px_rgba(100,116,139,0.5)] hover:from-slate-400 hover:to-slate-600 active:translate-y-0 border-none cursor-pointer">
                  Delete
                </button>
              </div>
            )}
            {b.status !== "PENDING" && (
              <div className="mt-4 flex gap-2.5 flex-wrap">
                <button 
                  onClick={() => handleDelete(b.id)} 
                  className="w-auto font-['Plus_Jakarta_Sans',sans-serif] text-[0.85rem] font-bold px-5.5 py-2.5 rounded-full transition-all duration-300 tracking-wide bg-gradient-to-br from-[#ef4444] to-[#b91c1c] text-white shadow-[0_4px_16px_rgba(220,38,38,0.35)] uppercase outline-none hover:-translate-y-[3px] hover:shadow-[0_8px_20px_rgba(220,38,38,0.5)] hover:from-red-400 hover:to-red-600 active:translate-y-0 border-none cursor-pointer">
                  Delete Booking
                </button>
              </div>
            )}
          </div>
        ))
      )}

      {deleteConfirmId && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-[6px] flex justify-center items-center z-[1000] animate-[fadeInUp_0.2s_ease]">
          <div className="bg-white/55 backdrop-blur-md border border-white/85 p-10 m-0 shadow-[0_8px_32px_0_rgba(31,38,135,0.07)] rounded-[24px] w-[360px] text-center">
            <h3 className="font-['Sora',sans-serif] text-[1.35rem] text-[#dc2626] mb-2 font-bold select-none">Confirm Deletion</h3>
            <p className="text-[#3b5080] mb-6 text-[0.95rem]">Are you sure you want to permanently delete this booking?</p>
            <div className="flex gap-2.5 justify-center">
              <button onClick={() => setDeleteConfirmId(null)} className="font-['Plus_Jakarta_Sans',sans-serif] text-[0.85rem] font-bold px-5.5 py-2.5 rounded-full transition-all duration-300 tracking-wide bg-transparent text-[#1a3270] shadow-none border-[1.5px] border-white uppercase outline-none hover:-translate-y-[2px] cursor-pointer w-auto mt-0 hover:bg-white/40">Cancel</button>
              <button onClick={confirmDelete} className="font-['Plus_Jakarta_Sans',sans-serif] text-[0.85rem] font-bold px-5.5 py-2.5 rounded-full transition-all duration-300 tracking-wide bg-gradient-to-br from-[#ef4444] to-[#b91c1c] text-white shadow-[0_4px_16px_rgba(220,38,38,0.35)] uppercase border-none outline-none hover:-translate-y-[3px] hover:shadow-[0_8px_20px_rgba(220,38,38,0.5)] cursor-pointer w-auto mt-0 hover:from-red-500 hover:to-red-700">Delete Now</button>
            </div>
          </div>
        </div>
      )}

      {showDeleteModal && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-[6px] flex justify-center items-center z-[1000] animate-[fadeInUp_0.3s_ease]">
          <div className="bg-white/55 backdrop-blur-md border border-white/85 p-10 m-0 shadow-[0_8px_32px_0_rgba(31,38,135,0.07)] rounded-[24px] w-[360px] text-center">
            <svg viewBox="0 0 24 24" className="w-[72px] h-[72px] mx-auto mb-6 fill-none stroke-[#dc2626] stroke-[2px] stroke-linecap-round stroke-linejoin-round drop-shadow-[0_4px_6px_rgba(220,38,38,0.2)]">
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
              <polyline points="22 4 12 14.01 9 11.01"></polyline>
            </svg>
            <h3 className="font-['Sora',sans-serif] text-[1.35rem] text-[#0d1f4e] mb-2 font-bold select-none">Deleted Successfully</h3>
            <p className="text-[#3b5080] mb-6 text-[0.95rem]">The booking has been permanently removed.</p>
            <button onClick={() => setShowDeleteModal(false)} className="w-full font-['Plus_Jakarta_Sans',sans-serif] text-[1rem] font-bold p-[0.85rem] mt-0 rounded-full transition-all duration-300 tracking-wide bg-gradient-to-br from-[#1e56c8] to-[#1a3270] text-white shadow-[0_4px_12px_rgba(30,86,200,0.25)] uppercase outline-none border-none cursor-pointer hover:-translate-y-[3px] hover:shadow-[0_8px_20px_rgba(30,86,200,0.4)] hover:from-[#3b82f6] hover:to-[#1e56c8] active:translate-y-0">OK</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminBookingsPage;
