import React, { useEffect, useState, useCallback } from "react";
import { useNavigate, Link } from "react-router-dom";
import { getAllBookings, approveBooking, rejectBooking, deleteBooking } from "../services/bookingService";

function AdminBookingsPage() {
  const navigate = useNavigate();
  const [bookings, setBookings] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);
  const [showDeleteSuccess, setShowDeleteSuccess] = useState(false);
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);

  const loadBookings = useCallback(async () => {
    setLoading(true);
    try {
      const response = await getAllBookings();
      setBookings(response.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const userId = localStorage.getItem("currentUserId");
    if (userId !== "admin") {
      navigate("/");
      return;
    }
    loadBookings();
  }, [navigate, loadBookings]);

  const handleApprove = async (id) => {
    try {
      await approveBooking(id);
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
        loadBookings();
      } catch (error) {
        console.error(error);
      }
    }
  };

  const handleDeleteClick = (id) => {
    setDeleteConfirmId(id);
  };

  const confirmDelete = async () => {
    if (deleteConfirmId) {
      try {
        await deleteBooking(deleteConfirmId);
        setDeleteConfirmId(null);
        setShowDeleteSuccess(true);
        loadBookings();
      } catch (error) {
        console.error(error);
        alert("Error deleting booking. Please ensure the backend is running.");
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

  const getStatusConfig = (status) => {
    switch (status) {
      case 'APPROVED': return { label: 'Approved', color: 'emerald', bg: 'bg-emerald-50', text: 'text-emerald-600', dot: 'bg-emerald-500' };
      case 'REJECTED': return { label: 'Rejected', color: 'rose', bg: 'bg-rose-50', text: 'text-rose-600', dot: 'bg-rose-500' };
      case 'PENDING': return { label: 'Pending', color: 'amber', bg: 'bg-amber-50', text: 'text-amber-600', dot: 'bg-amber-500' };
      case 'CANCELLED': return { label: 'Cancelled', color: 'slate', bg: 'bg-slate-50', text: 'text-slate-600', dot: 'bg-slate-400' };
      default: return { label: status, color: 'slate', bg: 'bg-slate-50', text: 'text-slate-600', dot: 'bg-slate-400' };
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-12 pb-24 text-left animate-in fade-in slide-in-from-bottom-4 duration-1000">
      {/* Header Section */}
      <div className="relative group rounded-[3rem] overflow-hidden bg-slate-900 p-10 md:p-16 text-white shadow-2xl shadow-slate-950/40">
        <div className="absolute top-0 right-0 -mr-32 -mt-32 w-96 h-96 bg-blue-500/20 rounded-full blur-[120px]"></div>
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)', backgroundSize: '32px 32px' }}></div>
        
        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-12">
          <div className="max-w-2xl space-y-6">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/10 backdrop-blur-md border border-blue-500/20">
              <span className="w-2 h-2 rounded-full bg-blue-400"></span>
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-blue-200">System Oversight</span>
            </div>
            <h1 className="text-4xl md:text-6xl font-black tracking-tight leading-[1.1]">
              Management <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-300">Desk</span>
            </h1>
            <p className="text-slate-400 text-lg md:text-xl font-medium leading-relaxed max-w-xl">
              Control and oversee all campus resource reservations. Process pending requests and manage existing schedules with precision.
            </p>
          </div>
          
          <div className="flex-shrink-0">
            <Link to="/admin-notifications" className="group/btn inline-flex items-center gap-4 px-8 py-5 rounded-[2rem] bg-white text-slate-950 font-black shadow-2xl transition-all hover:bg-blue-50 active:scale-95">
              <span className="text-sm uppercase tracking-widest">Notification Hub</span>
              <div className="w-10 h-10 rounded-2xl bg-slate-100 flex items-center justify-center group-hover/btn:bg-blue-600 group-hover/btn:text-white transition-colors">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                </svg>
              </div>
            </Link>
          </div>
        </div>
      </div>

      {/* Control Bar */}
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
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Filter by Resource, Student, ID or Status..."
              className="w-full bg-white/50 border border-slate-200 rounded-2xl py-4 pl-14 pr-6 text-slate-900 font-bold tracking-tight focus:bg-white focus:border-blue-500 focus:shadow-2xl focus:shadow-blue-500/10 outline-none transition-all"
            />
          </div>
          <button 
            onClick={loadBookings}
            disabled={loading}
            className="w-full md:w-auto px-8 py-4 rounded-2xl bg-slate-900 text-white font-black text-[10px] uppercase tracking-widest shadow-xl shadow-slate-900/20 hover:bg-slate-800 transition-all active:scale-95 disabled:opacity-50"
          >
            {loading ? "Updating..." : "Sync All Data"}
          </button>
        </div>
      </div>

      {/* Grid List */}
      <div className="space-y-8">
        <div className="flex items-center justify-between px-2">
            <div className="flex items-center gap-4">
                <div className="h-8 w-1.5 bg-blue-600 rounded-full shadow-[0_0_15px_rgba(37,99,235,0.4)]"></div>
                <h2 className="text-2xl font-black text-slate-900 tracking-tight">Active Registrations</h2>
            </div>
            <div className="flex gap-4">
              <span className="px-4 py-1.5 rounded-full bg-slate-100 border border-slate-200 text-[10px] font-black text-slate-500 uppercase tracking-widest">
                  {filteredBookings.length} Managed Items
              </span>
            </div>
        </div>

        {filteredBookings.length === 0 ? (
          <div className="bg-white/40 backdrop-blur-md border border-dashed border-slate-200 rounded-[3rem] p-24 text-center flex flex-col items-center">
            <div className="w-20 h-20 bg-slate-50 rounded-3xl flex items-center justify-center mb-8 border border-slate-100">
                <svg className="w-10 h-10 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
            </div>
            <h3 className="text-2xl font-black text-slate-900 mb-3 tracking-tight">No Matches Found</h3>
            <p className="text-slate-500 max-sm text-sm font-medium leading-relaxed">
              We couldn't find any bookings matching "{searchTerm}". Try refining your keywords.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {filteredBookings.map((b) => {
              const status = getStatusConfig(b.status);
              return (
                <div key={b.id} className="group bg-white border border-slate-100 rounded-[3rem] p-8 transition-all duration-500 hover:shadow-2xl hover:shadow-slate-200/50 hover:-translate-y-1 relative overflow-hidden flex flex-col">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 rounded-full -mr-16 -mt-16 transition-transform group-hover:scale-150 duration-700"></div>
                  
                  <div className="relative z-10 flex-grow space-y-8">
                    <div className="flex items-start justify-between gap-4">
                      <div className="space-y-1">
                        <div className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Reference #{b.id.slice(-6)}</div>
                        <h3 className="text-xl font-black text-slate-900 tracking-tight">{b.resourceName}</h3>
                        <p className="text-[10px] font-bold text-blue-500 uppercase tracking-widest">{b.resourceId}</p>
                      </div>
                      <div className={`px-4 py-1.5 ${status.bg} ${status.text} border border-${status.color}-100 rounded-full text-[10px] font-black uppercase tracking-widest shadow-sm flex items-center gap-2`}>
                        <div className={`w-1.5 h-1.5 rounded-full ${status.dot}`}></div>
                        {status.label}
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-8 p-6 bg-slate-50 rounded-[2rem] border border-slate-100">
                      <div className="space-y-4">
                        <div className="space-y-1">
                          <div className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Student Details</div>
                          <div className="text-sm font-bold text-slate-900">{b.userName}</div>
                          <div className="text-[10px] font-bold text-slate-500 tracking-wider">{b.userId}</div>
                        </div>
                        <div className="space-y-1">
                          <div className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Date & Time</div>
                          <div className="text-sm font-bold text-slate-900">{b.date}</div>
                          <div className="text-[10px] font-bold text-slate-500 tracking-wider">{b.startTime} - {b.endTime}</div>
                        </div>
                      </div>
                      <div className="space-y-4 text-right">
                        <div className="space-y-1">
                          <div className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Attendees</div>
                          <div className="text-sm font-bold text-slate-900">{b.expectedAttendees} Capacity</div>
                        </div>
                        <div className="space-y-1">
                          <div className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Purpose</div>
                          <div className="text-xs font-bold text-slate-600 leading-relaxed italic line-clamp-2">"{b.purpose}"</div>
                        </div>
                      </div>
                    </div>

                    <div className="pt-6 border-t border-slate-100 flex flex-wrap items-center justify-between gap-4">
                      {b.status === "PENDING" ? (
                        <div className="flex gap-3 w-full sm:w-auto">
                          <button 
                            onClick={() => handleApprove(b.id)} 
                            className="flex-1 sm:flex-none px-6 py-3 rounded-2xl bg-slate-900 text-white font-black text-[10px] uppercase tracking-widest shadow-xl shadow-slate-900/10 hover:bg-slate-800 transition-all active:scale-95"
                          >
                            Approve
                          </button>
                          <button 
                            onClick={() => handleReject(b.id)} 
                            className="flex-1 sm:flex-none px-6 py-3 rounded-2xl bg-rose-50 text-rose-600 font-black text-[10px] uppercase tracking-widest border border-rose-100 hover:bg-rose-500 hover:text-white transition-all active:scale-95"
                          >
                            Reject
                          </button>
                        </div>
                      ) : (
                        <div className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] italic">Processed</div>
                      )}
                      
                      <button 
                        onClick={() => handleDeleteClick(b.id)} 
                        className="p-3 rounded-2xl text-slate-300 hover:text-rose-600 hover:bg-rose-50 transition-all group/del active:scale-95"
                        title="Delete record"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Modals */}
      {deleteConfirmId && (
        <div className="fixed inset-0 bg-slate-950/40 backdrop-blur-xl flex justify-center items-center z-[100] p-6 animate-in fade-in duration-300">
          <div className="bg-white rounded-[3rem] w-full max-w-sm overflow-hidden shadow-2xl border border-white/50 animate-in zoom-in-95 duration-300">
            <div className="p-10 text-center space-y-6">
              <div className="w-20 h-20 bg-rose-50 rounded-3xl flex items-center justify-center mx-auto border border-rose-100">
                <svg className="w-10 h-10 text-rose-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </div>
              <h3 className="text-2xl font-black tracking-tight text-slate-900">Delete Record?</h3>
              <p className="text-slate-500 font-medium text-sm leading-relaxed">
                This will permanently remove the booking from the database. This action cannot be undone.
              </p>
              <div className="flex gap-4">
                <button onClick={() => setDeleteConfirmId(null)} className="flex-1 py-4 rounded-2xl text-slate-400 font-black text-[10px] uppercase tracking-widest hover:bg-slate-50 transition-all">Keep</button>
                <button onClick={confirmDelete} className="flex-1 py-4 rounded-2xl bg-rose-600 text-white font-black text-[10px] uppercase tracking-widest shadow-xl shadow-rose-600/20 hover:bg-rose-700 transition-all">Delete</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {showDeleteSuccess && (
        <div className="fixed inset-0 bg-slate-950/40 backdrop-blur-xl flex justify-center items-center z-[100] p-6 animate-in fade-in duration-300">
          <div className="bg-white rounded-[3rem] w-full max-w-sm overflow-hidden shadow-2xl border border-white/50 animate-in zoom-in-95 duration-300">
            <div className="p-10 text-center space-y-6">
              <div className="w-20 h-20 bg-emerald-50 rounded-3xl flex items-center justify-center mx-auto border border-emerald-100">
                <svg className="w-10 h-10 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3 className="text-2xl font-black tracking-tight text-slate-900">Purged!</h3>
              <p className="text-slate-500 font-medium text-sm leading-relaxed">
                The record has been successfully removed from the system logs.
              </p>
              <button 
                onClick={() => setShowDeleteSuccess(false)} 
                className="w-full py-4 rounded-2xl bg-slate-900 text-white font-black text-[10px] uppercase tracking-widest shadow-xl shadow-slate-900/20 hover:bg-slate-800 transition-all"
              >
                Continue
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminBookingsPage;
