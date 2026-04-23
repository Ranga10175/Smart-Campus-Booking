import React, { useEffect, useState, useCallback } from "react";
import { Link } from "react-router-dom";
import { getUserBookings, cancelBooking } from "../services/bookingService";

function MyBookingsPage() {
  const [bookings, setBookings] = useState([]);
  const [userIdInput, setUserIdInput] = useState(
    localStorage.getItem("currentUserId") || ""
  );
  const [loading, setLoading] = useState(false);
  const [showCancelSuccess, setShowCancelSuccess] = useState(false);
  const [cancelConfirmId, setCancelConfirmId] = useState(null);

  const loadBookings = useCallback(async () => {
    if (!userIdInput) {
      setBookings([]);
      return;
    }
    setLoading(true);
    try {
      const response = await getUserBookings(userIdInput);
      // Filter out bookings so it ONLY displays after Admin approves it
      const approvedBookings = response.data.filter(b => b.status === "APPROVED");
      setBookings(approvedBookings);
    } catch (error) {
      console.error(error);
      setBookings([]);
    } finally {
      setLoading(false);
    }
  }, [userIdInput]);

  useEffect(() => {
    loadBookings();
  }, [loadBookings]);

  const handleCancelClick = (id) => {
    setCancelConfirmId(id);
  };

  const confirmCancel = async () => {
    if (cancelConfirmId) {
      try {
        await cancelBooking(cancelConfirmId);
        setCancelConfirmId(null);
        setShowCancelSuccess(true);
        loadBookings();
      } catch (error) {
        console.error(error);
      }
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-12 pb-24 text-left animate-in fade-in slide-in-from-bottom-4 duration-1000">
      {/* Header Section */}
      <div className="relative group rounded-[3rem] overflow-hidden bg-slate-900 p-10 md:p-16 text-white shadow-2xl shadow-slate-950/40">
        <div className="absolute top-0 right-0 -mr-32 -mt-32 w-96 h-96 bg-blue-500/20 rounded-full blur-[120px]"></div>
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)', backgroundSize: '32px 32px' }}></div>
        
        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-12">
          <div className="max-w-2xl space-y-6">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/10 backdrop-blur-md border border-blue-500/20">
              <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-blue-200">Personal Schedule</span>
            </div>
            <h1 className="text-4xl md:text-6xl font-black tracking-tight leading-[1.1]">
              My <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-300">Reservations</span>
            </h1>
            <p className="text-slate-400 text-lg md:text-xl font-medium leading-relaxed max-w-xl">
              Manage your upcoming campus activities. Only fully approved bookings are displayed here for your reference.
            </p>
          </div>
          
          <div className="flex-shrink-0">
            <Link to="/create-booking" className="group/btn inline-flex items-center gap-4 px-8 py-5 rounded-[2rem] bg-white text-slate-950 font-black shadow-2xl transition-all hover:bg-blue-50 active:scale-95">
              <span className="text-sm uppercase tracking-widest">New Booking</span>
              <div className="w-10 h-10 rounded-2xl bg-slate-100 flex items-center justify-center group-hover/btn:bg-blue-600 group-hover/btn:text-white transition-colors">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 4v16m8-8H4" />
                </svg>
              </div>
            </Link>
          </div>
        </div>
      </div>

      {/* Filter Section */}
      <div className="bg-white/40 backdrop-blur-2xl border border-white/60 rounded-[2.5rem] p-6 shadow-xl shadow-blue-500/5">
        <div className="flex flex-col md:flex-row items-center gap-6">
          <div className="flex-grow w-full md:w-auto relative group">
            <div className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <input
              type="text"
              value={userIdInput}
              onChange={(e) => setUserIdInput(e.target.value)}
              placeholder="Enter Student ID to filter..."
              className="w-full bg-white/50 border border-slate-200 rounded-2xl py-4 pl-14 pr-6 text-slate-900 font-bold tracking-tight focus:bg-white focus:border-blue-500 focus:shadow-2xl focus:shadow-blue-500/10 outline-none transition-all"
            />
          </div>
          <button 
            onClick={loadBookings}
            disabled={loading}
            className="w-full md:w-auto px-8 py-4 rounded-2xl bg-slate-900 text-white font-black text-[10px] uppercase tracking-widest shadow-xl shadow-slate-900/20 hover:bg-slate-800 transition-all active:scale-95 disabled:opacity-50"
          >
            {loading ? "Syncing..." : "Refresh List"}
          </button>
        </div>
      </div>

      {/* Bookings List */}
      <div className="space-y-8">
        <div className="flex items-center justify-between px-2">
            <div className="flex items-center gap-4">
                <div className="h-8 w-1.5 bg-emerald-500 rounded-full shadow-[0_0_15px_rgba(16,185,129,0.4)]"></div>
                <h2 className="text-2xl font-black text-slate-900 tracking-tight">Approved Slots</h2>
            </div>
            <span className="px-4 py-1.5 rounded-full bg-slate-100 border border-slate-200 text-[10px] font-black text-slate-500 uppercase tracking-widest">
                {bookings.length} Results
            </span>
        </div>

        {bookings.length === 0 ? (
          <div className="bg-white/40 backdrop-blur-md border border-dashed border-slate-200 rounded-[3rem] p-24 text-center flex flex-col items-center">
            <div className="w-20 h-20 bg-slate-50 rounded-3xl flex items-center justify-center mb-8 border border-slate-100">
                <svg className="w-10 h-10 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
            </div>
            <h3 className="text-2xl font-black text-slate-900 mb-3 tracking-tight">No Active Bookings</h3>
            <p className="text-slate-500 max-w-sm text-sm font-medium leading-relaxed">
              Once an admin approves your request, it will appear here. Try searching with your Student ID above.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {bookings.map((booking) => (
              <div key={booking.id} className="group bg-white border border-slate-100 rounded-[2.5rem] p-8 transition-all duration-500 hover:shadow-2xl hover:shadow-slate-200/50 hover:-translate-y-1 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 rounded-full -mr-16 -mt-16 transition-transform group-hover:scale-150 duration-700"></div>
                
                <div className="relative z-10 space-y-8">
                  <div className="flex items-start justify-between gap-4">
                    <div className="space-y-1">
                      <div className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Resource Type</div>
                      <h3 className="text-xl font-black text-slate-900 tracking-tight">{booking.resourceName}</h3>
                    </div>
                    <div className="px-4 py-1.5 bg-emerald-50 text-emerald-600 border border-emerald-100 rounded-full text-[10px] font-black uppercase tracking-widest shadow-sm">
                      Approved
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-6 pt-4">
                    <div className="space-y-1">
                      <div className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Date</div>
                      <div className="text-sm font-bold text-slate-700">{booking.date}</div>
                    </div>
                    <div className="space-y-1 text-right">
                      <div className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Time Slot</div>
                      <div className="text-sm font-bold text-slate-700">{booking.startTime} - {booking.endTime}</div>
                    </div>
                    <div className="space-y-1">
                      <div className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Attendees</div>
                      <div className="text-sm font-bold text-slate-700">{booking.expectedAttendees} Members</div>
                    </div>
                    <div className="space-y-1 text-right">
                      <div className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Ref ID</div>
                      <div className="text-sm font-bold text-slate-400 tracking-tighter">#{booking.id.slice(-6)}</div>
                    </div>
                  </div>

                  <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                    <div className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Purpose</div>
                    <p className="text-xs font-bold text-slate-600 line-clamp-1">{booking.purpose}</p>
                  </div>

                  <div className="pt-4 flex items-center justify-between border-t border-slate-50">
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-xl bg-slate-100 flex items-center justify-center text-slate-500">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                            </svg>
                        </div>
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{booking.userName}</span>
                    </div>
                    <button 
                      onClick={() => handleCancelClick(booking.id)} 
                      className="px-5 py-2.5 rounded-xl bg-rose-50 text-rose-600 font-black text-[10px] uppercase tracking-widest border border-rose-100 hover:bg-rose-500 hover:text-white hover:border-rose-500 transition-all active:scale-95"
                    >
                      Cancel Slot
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Confirmation Modal */}
      {cancelConfirmId && (
        <div className="fixed inset-0 bg-slate-950/40 backdrop-blur-xl flex justify-center items-center z-[100] p-6 animate-in fade-in duration-300">
          <div className="bg-white rounded-[3rem] w-full max-w-sm overflow-hidden shadow-2xl border border-white/50 animate-in zoom-in-95 duration-300">
            <div className="p-10 text-center space-y-6">
              <div className="w-20 h-20 bg-amber-50 rounded-3xl flex items-center justify-center mx-auto border border-amber-100">
                <svg className="w-10 h-10 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <h3 className="text-2xl font-black tracking-tight text-slate-900">Cancel Slot?</h3>
              <p className="text-slate-500 font-medium text-sm leading-relaxed">
                This will release the resource for other students. This action is permanent.
              </p>
              <div className="flex gap-4">
                <button onClick={() => setCancelConfirmId(null)} className="flex-1 py-4 rounded-2xl text-slate-400 font-black text-[10px] uppercase tracking-widest hover:bg-slate-50 transition-all">Keep Slot</button>
                <button onClick={confirmCancel} className="flex-1 py-4 rounded-2xl bg-rose-600 text-white font-black text-[10px] uppercase tracking-widest shadow-xl shadow-rose-600/20 hover:bg-rose-700 transition-all">Cancel Now</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Success Modal */}
      {showCancelSuccess && (
        <div className="fixed inset-0 bg-slate-950/40 backdrop-blur-xl flex justify-center items-center z-[100] p-6 animate-in fade-in duration-300">
          <div className="bg-white rounded-[3rem] w-full max-w-sm overflow-hidden shadow-2xl border border-white/50 animate-in zoom-in-95 duration-300">
            <div className="p-10 text-center space-y-6">
              <div className="w-20 h-20 bg-emerald-50 rounded-3xl flex items-center justify-center mx-auto border border-emerald-100">
                <svg className="w-10 h-10 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3 className="text-2xl font-black tracking-tight text-slate-900">Success!</h3>
              <p className="text-slate-500 font-medium text-sm leading-relaxed">
                Your reservation has been cancelled and the slot is now free.
              </p>
              <button 
                onClick={() => setShowCancelSuccess(false)} 
                className="w-full py-4 rounded-2xl bg-slate-900 text-white font-black text-[10px] uppercase tracking-widest shadow-xl shadow-slate-900/20 hover:bg-slate-800 transition-all"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default MyBookingsPage;