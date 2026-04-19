import React, { useEffect, useState } from "react";
import { getUserBookings, cancelBooking } from "../services/bookingService";

function MyBookingsPage() {
  const [bookings, setBookings] = useState([]);
  const [userIdInput, setUserIdInput] = useState(
    localStorage.getItem("currentUserId") || "U001"
  );
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [cancelConfirmId, setCancelConfirmId] = useState(null);

  const loadBookings = async () => {
    if (!userIdInput) return;
    try {
      const response = await getUserBookings(userIdInput);
      
      // Filter out bookings so it ONLY displays after Admin approves it
      const approvedBookings = response.data.filter(b => b.status === "APPROVED");
      setBookings(approvedBookings);
    } catch (error) {
      console.error(error);
      setBookings([]);
    }
  };

  useEffect(() => {
    if (userIdInput) {
      loadBookings();
    }
  }, [userIdInput]);

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
    <div className="max-w-[680px] w-full mx-auto px-5 pb-12 text-left flex-1 animate-[fadeInUp_0.5s_ease_both] mt-4">
      <h2 className="font-['Sora',sans-serif] text-2xl font-bold text-[#0d1f4e] mb-7 tracking-[-0.02em] inline-block relative after:content-[''] after:absolute after:-bottom-1.5 after:left-0 after:w-[60%] after:h-[3px] after:bg-gradient-to-r after:from-[#60a5fa] after:to-[#1e56c8] after:rounded-full">My Approved Bookings</h2>
      
      <div className="bg-white/55 backdrop-blur-md border border-white/85 rounded-3xl p-7 mb-6 shadow-[0_8px_32px_0_rgba(31,38,135,0.07)] transition-all duration-300 relative overflow-hidden animate-[fadeInUp_0.4s_ease_both] hover:bg-white/75 hover:border-white hover:-translate-y-1 hover:shadow-[0_12px_40px_0_rgba(31,38,135,0.1)]">
        <div className="flex gap-2.5 items-center flex-wrap">
          <label className="font-semibold text-[#1a3270] whitespace-nowrap m-0 text-[0.85rem]">
            View Bookings for User ID:
          </label>
          <input
            type="text"
            value={userIdInput}
            onChange={(e) => setUserIdInput(e.target.value)}
            className="w-[200px] font-['Plus_Jakarta_Sans',sans-serif] text-[0.95rem] py-3 px-5 border-[1.5px] border-white/85 rounded-full bg-white/45 text-[#0d1f4e] transition-all duration-300 outline-none block placeholder-[#7a93c4] focus:border-[#1e56c8] focus:shadow-[0_0_0_4px_rgba(30,86,200,0.15)] focus:bg-white hover:not(:focus):border-[#7a93c4] hover:not(:focus):bg-white/65"
            placeholder="e.g. U001"
          />
          <button onClick={loadBookings} className="px-4 py-2.5 bg-gradient-to-br from-[#60a5fa] to-[#3b82f6] shadow-[0_4px_16px_rgba(96,165,250,0.35)] hover:from-[#3b82f6] hover:to-[#1e56c8] hover:shadow-[0_8px_24px_rgba(96,165,250,0.45)] active:from-[#1e56c8] active:to-[#1a3270] text-white font-['Plus_Jakarta_Sans',sans-serif] text-[0.85rem] font-bold rounded-full transition-all duration-300 tracking-wide uppercase border-none cursor-pointer w-auto mt-0 hover:-translate-y-[3px] active:translate-y-0">Refresh</button>
        </div>
      </div>

      {bookings.length === 0 ? (
        <p className="bg-white/55 backdrop-blur-md border-2 border-dashed border-white/80 rounded-[24px] p-10 text-center text-[#3b5080] text-base font-medium">No approved bookings found for User ID: <strong className="font-bold text-[#0d1f4e] uppercase tracking-wide">{userIdInput}</strong>. Note: Bookings will only appear here <em className="italic">after</em> an Admin approves them!</p>
      ) : (
        bookings.map((b) => (
          <div className="bg-white/55 backdrop-blur-md border border-white/85 rounded-3xl p-7 mb-6 shadow-[0_8px_32px_0_rgba(31,38,135,0.07)] transition-all duration-300 relative overflow-hidden animate-[fadeInUp_0.4s_ease_both] hover:bg-white/75 hover:border-white hover:-translate-y-1 hover:shadow-[0_12px_40px_0_rgba(31,38,135,0.1)]" key={b.id}>
            <p className="text-[0.92rem] text-[#3b5080] py-1.5 flex items-baseline gap-2 border-b border-white/40"><strong className="font-bold text-[#0d1f4e] min-w-[100px] text-[0.85rem] uppercase tracking-wide">Resource Name:</strong> {b.resourceName}</p>
            <p className="text-[0.92rem] text-[#3b5080] py-1.5 flex items-baseline gap-2 border-b border-white/40"><strong className="font-bold text-[#0d1f4e] min-w-[100px] text-[0.85rem] uppercase tracking-wide">Resource ID:</strong> {b.resourceId}</p>
            <p className="text-[0.92rem] text-[#3b5080] py-1.5 flex items-baseline gap-2 border-b border-white/40"><strong className="font-bold text-[#0d1f4e] min-w-[100px] text-[0.85rem] uppercase tracking-wide">User Name:</strong> {b.userName}</p>
            <p className="text-[0.92rem] text-[#3b5080] py-1.5 flex items-baseline gap-2 border-b border-white/40"><strong className="font-bold text-[#0d1f4e] min-w-[100px] text-[0.85rem] uppercase tracking-wide">Date:</strong> {b.date}</p>
            <p className="text-[0.92rem] text-[#3b5080] py-1.5 flex items-baseline gap-2 border-b border-white/40"><strong className="font-bold text-[#0d1f4e] min-w-[100px] text-[0.85rem] uppercase tracking-wide">Time:</strong> {b.startTime} - {b.endTime}</p>
            <p className="text-[0.92rem] text-[#3b5080] py-1.5 flex items-baseline gap-2 border-b border-white/40"><strong className="font-bold text-[#0d1f4e] min-w-[100px] text-[0.85rem] uppercase tracking-wide">Attendees:</strong> {b.expectedAttendees}</p>
            <p className="text-[0.92rem] text-[#3b5080] py-1.5 flex items-baseline gap-2 border-b border-white/40"><strong className="font-bold text-[#0d1f4e] min-w-[100px] text-[0.85rem] uppercase tracking-wide">Purpose:</strong> {b.purpose}</p>
            <p className="text-[0.92rem] text-[#3b5080] py-1.5 flex items-baseline gap-2 mb-3"><strong className="font-bold text-[#0d1f4e] min-w-[100px] text-[0.85rem] uppercase tracking-wide">Status:</strong> <span className="inline-flex items-center text-xs font-bold uppercase tracking-[0.08em] px-[0.85rem] py-[0.35rem] rounded-full shadow-[0_2px_6px_rgba(0,0,0,0.05)] bg-[#d1fae5] text-[#059669]">APPROVED</span></p>

            <div className="flex gap-3 flex-wrap mt-4">
              <button 
                onClick={() => handleCancel(b.id)} 
                className="font-['Plus_Jakarta_Sans',sans-serif] text-[0.85rem] font-bold px-5.5 py-2.5 rounded-full transition-all duration-300 tracking-wide bg-gradient-to-br from-red-500 to-[#b91c1c] text-white shadow-[0_4px_14px_rgba(220,38,38,0.35)] uppercase outline-none hover:-translate-y-[3px] hover:shadow-[0_8px_20px_rgba(220,38,38,0.5)] hover:from-red-400 hover:to-red-600 border-none cursor-pointer w-auto mt-0">
                Cancel Booking
              </button>
            </div>
          </div>
        ))
      )}

      {cancelConfirmId && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-[6px] flex justify-center items-center z-[1000] animate-[fadeInUp_0.2s_ease]">
          <div className="bg-white/55 backdrop-blur-md border border-white/85 p-10 m-0 shadow-[0_8px_32px_0_rgba(31,38,135,0.07)] rounded-[24px] w-[360px] text-center">
            <h3 className="font-['Sora',sans-serif] text-[1.35rem] text-[#d97706] mb-2 font-bold select-none">Wait! Cancel Booking?</h3>
            <p className="text-[#3b5080] mb-6 text-[0.95rem]">Are you absolutely sure you want to cancel this approved booking?</p>
            <div className="flex gap-2.5 justify-center">
              <button onClick={() => setCancelConfirmId(null)} className="font-['Plus_Jakarta_Sans',sans-serif] text-[0.85rem] font-bold px-5.5 py-2.5 rounded-full transition-all duration-300 tracking-wide bg-transparent text-[#1a3270] shadow-none border-[1.5px] border-white uppercase outline-none hover:-translate-y-[2px] cursor-pointer w-auto mt-0 hover:bg-white/40">No, keep it</button>
              <button onClick={confirmCancel} className="font-['Plus_Jakarta_Sans',sans-serif] text-[0.85rem] font-bold px-5.5 py-2.5 rounded-full transition-all duration-300 tracking-wide bg-gradient-to-br from-[#d97706] to-[#b45309] text-white shadow-[0_4px_16px_rgba(217,119,6,0.35)] uppercase border-none outline-none hover:-translate-y-[3px] hover:shadow-[0_8px_20px_rgba(217,119,6,0.5)] cursor-pointer w-auto mt-0 hover:from-yellow-500 hover:to-amber-700">Yes, cancel</button>
            </div>
          </div>
        </div>
      )}

      {showCancelModal && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-[6px] flex justify-center items-center z-[1000] animate-[fadeInUp_0.3s_ease]">
          <div className="bg-white/55 backdrop-blur-md border border-white/85 p-10 m-0 shadow-[0_8px_32px_0_rgba(31,38,135,0.07)] rounded-[24px] w-[360px] text-center">
            <svg viewBox="0 0 24 24" className="w-[72px] h-[72px] mx-auto mb-6 fill-none stroke-[#dc2626] stroke-2 stroke-linecap-round stroke-linejoin-round drop-shadow-[0_4px_6px_rgba(220,38,38,0.2)]">
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
              <polyline points="22 4 12 14.01 9 11.01"></polyline>
            </svg>
            <h3 className="font-['Sora',sans-serif] text-[1.35rem] text-[#0d1f4e] mb-2 font-bold select-none">Cancelled!</h3>
            <p className="text-[#3b5080] mb-6 text-[0.95rem]">Your booking has been successfully cancelled.</p>
            <button onClick={() => setShowCancelModal(false)} className="w-full font-['Plus_Jakarta_Sans',sans-serif] text-[1rem] font-bold p-[0.85rem] mt-0 rounded-full transition-all duration-300 tracking-wide bg-gradient-to-br from-[#1e56c8] to-[#1a3270] text-white shadow-[0_4px_12px_rgba(30,86,200,0.25)] uppercase outline-none border-none cursor-pointer hover:-translate-y-[3px] hover:shadow-[0_8px_20px_rgba(30,86,200,0.4)] hover:from-[#3b82f6] hover:to-[#1e56c8] active:translate-y-0">OK</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default MyBookingsPage;