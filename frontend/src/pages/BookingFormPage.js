import React, { useState, useEffect, useCallback } from "react";
import { useNavigate, Link } from "react-router-dom";
import { createBooking, getAllBookings } from "../services/bookingService";

const SLIIT_RESOURCES = [
  { id: "", name: "Select a Campus Resource" },
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
    date: new Date().toISOString().split('T')[0],
    startTime: "",
    endTime: "",
    purpose: "",
    expectedAttendees: 1,
  });

  const [resourceStatus, setResourceStatus] = useState(null); // { status: 'AVAILABLE' | 'OCCUPIED', currentBooking: null }
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const checkAvailability = useCallback(async (resourceId, date) => {
    if (!resourceId || !date) return;
    
    try {
      const response = await getAllBookings();
      const now = new Date();
      const currentResourceBookings = response.data.filter(b => 
        b.resourceId === resourceId && 
        b.date === date && 
        b.status === "APPROVED"
      );

      const activeBooking = currentResourceBookings.find(b => {
        const start = new Date(`${b.date}T${b.startTime}`);
        const end = new Date(`${b.date}T${b.endTime}`);
        return now >= start && now <= end;
      });

      if (activeBooking) {
        setResourceStatus({ status: 'OCCUPIED', currentBooking: activeBooking });
      } else {
        setResourceStatus({ status: 'AVAILABLE', currentBooking: null });
      }
    } catch (err) {
      console.error("Availability check failed", err);
    }
  }, []);

  useEffect(() => {
    if (formData.resourceId) {
      checkAvailability(formData.resourceId, formData.date);
    } else {
      setResourceStatus(null);
    }
  }, [formData.resourceId, formData.date, checkAvailability]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    
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

  const validateForm = () => {
    const now = new Date();
    const selectedDate = new Date(formData.date);
    
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const targetDay = new Date(selectedDate.getFullYear(), selectedDate.getMonth(), selectedDate.getDate());

    if (targetDay < today) {
      setErrorMessage("You cannot book a resource for a past date.");
      return false;
    }

    if (!formData.startTime || !formData.endTime) {
      setErrorMessage("Please specify both start and end times.");
      return false;
    }

    const start = new Date(`${formData.date}T${formData.startTime}`);
    const end = new Date(`${formData.date}T${formData.endTime}`);

    if (start >= end) {
      setErrorMessage("End time must be after the start time.");
      return false;
    }

    const durationMinutes = (end - start) / (1000 * 60);
    if (durationMinutes < 30) {
      setErrorMessage("Minimum booking duration is 30 minutes.");
      return false;
    }
    if (durationMinutes > 240) {
      setErrorMessage("Maximum booking duration is 4 hours.");
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    setErrorMessage("");

    try {
      await createBooking(formData);
      localStorage.setItem('currentUserId', formData.userId);
      setShowModal(true);
      setFormData({
        ...formData,
        startTime: "",
        endTime: "",
        purpose: "",
      });
    } catch (error) {
      const msg = error?.response?.data?.error || "Error creating booking. Check for overlapping times!";
      setErrorMessage(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleModalOk = () => {
    setShowModal(false);
    navigate("/my-bookings");
  };

  return (
    <div className="max-w-6xl mx-auto space-y-12 pb-24 text-left animate-in fade-in slide-in-from-bottom-4 duration-1000">
      {/* Header */}
      <div className="relative group rounded-[3rem] overflow-hidden bg-slate-950 p-10 md:p-16 text-white shadow-2xl shadow-slate-950/20">
        <div className="absolute top-0 right-0 -mr-32 -mt-32 w-96 h-96 bg-blue-600/30 rounded-full blur-[120px] animate-pulse"></div>
        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-12">
          <div className="max-w-2xl space-y-6">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/10">
              <span className="w-2 h-2 rounded-full bg-blue-400"></span>
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-blue-100">Live Availability Monitor</span>
            </div>
            <h1 className="text-4xl md:text-6xl font-black tracking-tight leading-[1.1]">
              Secure Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-300">Space</span>
            </h1>
            <p className="text-blue-100/70 text-lg md:text-xl font-medium leading-relaxed">
              Check real-time status and reserve resources without conflicts.
            </p>
          </div>
          <div className="flex-shrink-0">
            <Link to="/my-bookings" className="group/btn inline-flex items-center gap-4 px-8 py-5 rounded-[2rem] bg-white text-slate-950 font-black shadow-2xl transition-all hover:bg-blue-50 active:scale-95">
              <span className="text-sm uppercase tracking-widest text-slate-950">View My Slots</span>
              <div className="w-10 h-10 rounded-2xl bg-slate-100 flex items-center justify-center group-hover/btn:bg-blue-600 group-hover/btn:text-white transition-colors">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2-2v12a2 2 0 002 2z" />
                </svg>
              </div>
            </Link>
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-5 gap-12 items-start">
        <div className="lg:col-span-3 bg-white/40 backdrop-blur-2xl border border-white/60 rounded-[3rem] p-8 md:p-12 shadow-2xl shadow-blue-500/5">
          <form className="space-y-8" onSubmit={handleSubmit}>
            
            <div className="space-y-3">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-2 block">Location</label>
              <div className="flex flex-col md:flex-row gap-4 items-stretch">
                <div className="relative group flex-grow">
                  <select
                    name="resourceId"
                    value={formData.resourceId}
                    onChange={handleChange}
                    required
                    className="w-full bg-white/50 border border-slate-200 rounded-3xl py-5 px-8 text-slate-900 font-bold tracking-tight focus:bg-white focus:border-blue-500 focus:shadow-2xl focus:shadow-blue-500/10 outline-none transition-all appearance-none cursor-pointer pr-16"
                  >
                    {SLIIT_RESOURCES.map(r => (
                      <option key={r.id} value={r.id} disabled={r.id === ""}>{r.name}</option>
                    ))}
                  </select>
                  <div className="absolute right-6 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>

                {resourceStatus && (
                  <div className={`flex items-center gap-3 px-6 py-4 rounded-3xl border transition-all animate-in slide-in-from-right-4 duration-500 ${
                    resourceStatus.status === 'AVAILABLE' 
                    ? 'bg-emerald-50 border-emerald-100 text-emerald-600' 
                    : 'bg-rose-50 border-rose-100 text-rose-600'
                  }`}>
                    <div className={`w-2 h-2 rounded-full ${resourceStatus.status === 'AVAILABLE' ? 'bg-emerald-500' : 'bg-rose-500 animate-pulse'}`}></div>
                    <span className="text-[10px] font-black uppercase tracking-[0.2em]">
                      {resourceStatus.status === 'AVAILABLE' ? 'Available Now' : 'Currently Occupied'}
                    </span>
                  </div>
                )}
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              <div className="space-y-3">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-2 block">Full Name</label>
                <input 
                  type="text" 
                  name="userName" 
                  value={formData.userName} 
                  readOnly 
                  className="w-full border border-slate-200 rounded-3xl py-5 px-8 bg-slate-50 opacity-60 font-bold outline-none" 
                  required 
                />
              </div>
              <div className="space-y-3">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-2 block">Student ID</label>
                <input 
                  type="text" 
                  name="userId" 
                  value={formData.userId} 
                  readOnly 
                  className="w-full border border-slate-200 rounded-3xl py-5 px-8 bg-slate-50 opacity-60 font-bold outline-none" 
                  required 
                />
              </div>
            </div>

            <div className="space-y-3">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-2 block">Booking Date</label>
              <input type="date" name="date" value={formData.date} onChange={handleChange} className="w-full bg-white/50 border border-slate-200 rounded-3xl py-5 px-8 font-bold outline-none focus:bg-white" required />
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              <div className="space-y-3">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-2 block">Start Time</label>
                <input type="time" name="startTime" value={formData.startTime} onChange={handleChange} className="w-full bg-white/50 border border-slate-200 rounded-3xl py-5 px-8 font-bold focus:bg-white outline-none" required />
              </div>
              <div className="space-y-3">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-2 block">End Time</label>
                <input type="time" name="endTime" value={formData.endTime} onChange={handleChange} className="w-full bg-white/50 border border-slate-200 rounded-3xl py-5 px-8 font-bold focus:bg-white outline-none" required />
              </div>
            </div>

            <div className="space-y-3">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-2 block">Booking Purpose</label>
              <input type="text" name="purpose" value={formData.purpose} onChange={handleChange} placeholder="e.g. Research Meeting" className="w-full bg-white/50 border border-slate-200 rounded-3xl py-5 px-8 font-bold focus:bg-white outline-none" required />
            </div>

            <button type="submit" disabled={loading || (resourceStatus?.status === 'OCCUPIED' && formData.date === new Date().toISOString().split('T')[0])} className="w-full py-6 rounded-[2.5rem] bg-slate-900 text-white font-black text-sm uppercase tracking-[0.25em] shadow-2xl hover:bg-slate-800 transition-all active:scale-95 disabled:opacity-50">
              {loading ? "Processing..." : "Confirm Reservation"}
            </button>
          </form>
        </div>

        <div className="lg:col-span-2 space-y-8">
           <div className="bg-slate-900 rounded-[3rem] p-10 text-white relative overflow-hidden group shadow-2xl">
            <div className="relative z-10 space-y-6">
              <h3 className="text-2xl font-black tracking-tight underline decoration-blue-500 decoration-4 underline-offset-8">Smart Checks</h3>
              <p className="text-slate-400 text-sm font-medium leading-relaxed">
                Our system automatically cross-references your request against all approved sessions to ensure zero double-bookings.
              </p>
              <div className="space-y-4 pt-4">
                {[
                  { label: "Conflict Prevention", icon: "M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" },
                  { label: "Live Monitoring", icon: "M13 10V3L4 14h7v7l9-11h-7z" }
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-4 p-4 bg-white/5 rounded-2xl border border-white/10">
                    <div className="text-blue-400"><svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={item.icon} /></svg></div>
                    <span className="text-xs font-bold uppercase tracking-widest">{item.label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Success Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-slate-950/40 backdrop-blur-xl flex justify-center items-center z-[100] p-6">
          <div className="bg-white rounded-[3.5rem] w-full max-w-md overflow-hidden shadow-2xl animate-in zoom-in-95">
            <div className="bg-emerald-500 p-12 text-white text-center">
              <h3 className="text-3xl font-black tracking-tight">Request Sent!</h3>
            </div>
            <div className="p-10 text-center space-y-8">
              <p className="text-slate-500 font-medium">Your request for {formData.resourceName} is pending admin review.</p>
              <button onClick={handleModalOk} className="w-full py-5 rounded-[2rem] bg-slate-900 text-white font-black text-xs uppercase tracking-widest">Done</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default BookingFormPage;