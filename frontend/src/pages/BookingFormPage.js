import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { createBooking } from "../services/bookingService";

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
    date: "",
    startTime: "",
    endTime: "",
    purpose: "",
    expectedAttendees: 1,
  });

  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage("");

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
      const msg =
        error?.response?.data?.error ||
        "Error creating booking. Please ensure the backend is running and no times overlap.";
      setErrorMessage(msg);
      console.error(error);
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
      {/* Header Section */}
      <div className="relative group rounded-[3rem] overflow-hidden bg-slate-950 p-10 md:p-16 text-white shadow-2xl shadow-slate-950/20">
        <div className="absolute top-0 right-0 -mr-32 -mt-32 w-96 h-96 bg-blue-600/30 rounded-full blur-[120px] animate-pulse"></div>
        <div className="absolute bottom-0 left-0 -ml-32 -mb-32 w-96 h-96 bg-indigo-600/20 rounded-full blur-[100px]"></div>
        
        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-12">
          <div className="max-w-2xl space-y-6">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/10">
              <span className="w-2 h-2 rounded-full bg-blue-400"></span>
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-blue-100">Resource Reservation</span>
            </div>
            <h1 className="text-4xl md:text-6xl font-black tracking-tight leading-[1.1]">
              Book a <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-300">Resource</span>
            </h1>
            <p className="text-blue-100/70 text-lg md:text-xl font-medium leading-relaxed max-w-xl">
              Reserve halls, labs, and discussion rooms across the campus instantly. Select your preferred resource and schedule below.
            </p>
          </div>
          
          <div className="flex-shrink-0">
            <Link to="/my-bookings" className="group/btn inline-flex items-center gap-4 px-8 py-5 rounded-[2rem] bg-white text-slate-950 font-black shadow-2xl transition-all hover:bg-blue-50 active:scale-95">
              <span className="text-sm uppercase tracking-widest">View My Slots</span>
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
        {/* Form Container */}
        <div className="lg:col-span-3 bg-white/40 backdrop-blur-2xl border border-white/60 rounded-[3rem] p-8 md:p-12 shadow-2xl shadow-blue-500/5 transition-all hover:shadow-blue-500/10">
          <form className="space-y-8" onSubmit={handleSubmit}>
            
            <div className="space-y-3">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-2 block">
                Choose Location
              </label>
              <div className="relative group">
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
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              <div className="space-y-3">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-2 block">Student Identifier</label>
                <input
                  type="text"
                  name="userId"
                  placeholder="e.g. IT21000000"
                  value={formData.userId}
                  onChange={handleChange}
                  readOnly={!!localStorage.getItem("currentUserId")}
                  className={`w-full border border-slate-200 rounded-3xl py-5 px-8 text-slate-900 font-bold tracking-tight outline-none transition-all ${localStorage.getItem("currentUserId") ? 'bg-slate-50 opacity-60 cursor-not-allowed' : 'bg-white/50 focus:bg-white focus:border-blue-500 focus:shadow-2xl focus:shadow-blue-500/10'}`}
                  required
                />
              </div>
              <div className="space-y-3">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-2 block">Full Name</label>
                <input
                  type="text"
                  name="userName"
                  placeholder="Your Name"
                  value={formData.userName}
                  onChange={handleChange}
                  readOnly={!!localStorage.getItem("currentUserName")}
                  className={`w-full border border-slate-200 rounded-3xl py-5 px-8 text-slate-900 font-bold tracking-tight outline-none transition-all ${localStorage.getItem("currentUserName") ? 'bg-slate-50 opacity-60 cursor-not-allowed' : 'bg-white/50 focus:bg-white focus:border-blue-500 focus:shadow-2xl focus:shadow-blue-500/10'}`}
                  required
                />
              </div>
            </div>

            <div className="space-y-3">
               <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-2 block">Booking Date</label>
               <input
                 type="date"
                 name="date"
                 value={formData.date}
                 onChange={handleChange}
                 className="w-full bg-white/50 border border-slate-200 rounded-3xl py-5 px-8 text-slate-900 font-bold tracking-tight focus:bg-white focus:border-blue-500 focus:shadow-2xl focus:shadow-blue-500/10 outline-none transition-all cursor-pointer"
                 required
               />
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              <div className="space-y-3">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-2 block">Start Time</label>
                <input
                  type="time"
                  name="startTime"
                  value={formData.startTime}
                  onChange={handleChange}
                  className="w-full bg-white/50 border border-slate-200 rounded-3xl py-5 px-8 text-slate-900 font-bold tracking-tight focus:bg-white focus:border-blue-500 focus:shadow-2xl focus:shadow-blue-500/10 outline-none transition-all cursor-pointer"
                  required
                />
              </div>
              <div className="space-y-3">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-2 block">End Time</label>
                <input
                  type="time"
                  name="endTime"
                  value={formData.endTime}
                  onChange={handleChange}
                  className="w-full bg-white/50 border border-slate-200 rounded-3xl py-5 px-8 text-slate-900 font-bold tracking-tight focus:bg-white focus:border-blue-500 focus:shadow-2xl focus:shadow-blue-500/10 outline-none transition-all cursor-pointer"
                  required
                />
              </div>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              <div className="md:col-span-2 space-y-3">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-2 block">Purpose of Booking</label>
                <input
                  type="text"
                  name="purpose"
                  placeholder="e.g. Group Project Meeting"
                  value={formData.purpose}
                  onChange={handleChange}
                  className="w-full bg-white/50 border border-slate-200 rounded-3xl py-5 px-8 text-slate-900 font-bold tracking-tight focus:bg-white focus:border-blue-500 focus:shadow-2xl focus:shadow-blue-500/10 outline-none transition-all"
                  required
                />
              </div>
              <div className="space-y-3">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-2 block">Attendees</label>
                <input
                  type="number"
                  name="expectedAttendees"
                  min="1"
                  value={formData.expectedAttendees}
                  onChange={handleChange}
                  className="w-full bg-white/50 border border-slate-200 rounded-3xl py-5 px-8 text-slate-900 font-bold tracking-tight focus:bg-white focus:border-blue-500 focus:shadow-2xl focus:shadow-blue-500/10 outline-none transition-all"
                />
              </div>
            </div>

            <button 
              type="submit" 
              disabled={loading}
              className="w-full py-6 rounded-[2.5rem] bg-slate-900 text-white font-black text-sm uppercase tracking-[0.25em] shadow-2xl shadow-slate-900/20 hover:bg-slate-800 transition-all active:scale-95 flex items-center justify-center gap-4 disabled:opacity-70"
            >
              {loading ? (
                <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              ) : (
                <>
                  <span>Submit Reservation</span>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </>
              )}
            </button>
          </form>
        </div>

        {/* Sidebar Info */}
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-slate-900 rounded-[3rem] p-10 text-white relative overflow-hidden group shadow-2xl shadow-slate-900/20">
            <div className="absolute top-0 right-0 -mr-16 -mt-16 w-48 h-48 bg-blue-500/10 rounded-full blur-3xl group-hover:scale-125 transition-transform duration-700"></div>
            <div className="relative z-10 space-y-6">
              <h3 className="text-2xl font-black tracking-tight">Booking Policy</h3>
              <ul className="space-y-4">
                {[
                  "Requests must be submitted 24h in advance.",
                  "Maximum booking duration is 4 hours.",
                  "All bookings are subject to admin approval.",
                  "Please keep the resource clean and secure."
                ].map((item, i) => (
                  <li key={i} className="flex gap-4 items-start text-slate-400 font-medium">
                    <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-blue-500 shrink-0"></div>
                    <span className="text-sm leading-relaxed">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="bg-gradient-to-tr from-blue-500 to-indigo-600 rounded-[3rem] p-10 text-white shadow-2xl shadow-blue-500/20">
            <h3 className="text-2xl font-black tracking-tight mb-4">Need Help?</h3>
            <p className="text-blue-100 font-medium text-sm leading-relaxed mb-8">
              Contact the campus resource management team if you have any special requirements for your event.
            </p>
            <Link to="/support" className="inline-flex items-center gap-3 px-6 py-3 bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-white/20 transition-all">
              Contact Support
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
            </Link>
          </div>
        </div>
      </div>

      {/* Success Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-slate-950/40 backdrop-blur-xl flex justify-center items-center z-[100] p-6 animate-in fade-in duration-300">
          <div className="bg-white rounded-[3.5rem] w-full max-w-md overflow-hidden shadow-2xl border border-white/50 animate-in zoom-in-95 duration-300">
            <div className="bg-emerald-500 p-12 flex flex-col items-center text-white relative overflow-hidden">
              <div className="absolute top-0 right-0 -mr-20 -mt-20 w-48 h-48 bg-white/20 rounded-full blur-3xl"></div>
              <div className="relative z-10 w-24 h-24 bg-white/20 rounded-3xl backdrop-blur-md border border-white/30 flex items-center justify-center mb-8 shadow-2xl">
                <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3 className="text-3xl font-black tracking-tight text-center leading-tight">Request <br/>Submitted!</h3>
            </div>
            <div className="p-10 text-center space-y-8">
              <p className="text-slate-500 font-medium leading-relaxed">
                Your reservation request for <span className="text-slate-900 font-bold">{formData.resourceName}</span> has been successfully logged. An administrator will review it shortly.
              </p>
              <button 
                onClick={handleModalOk} 
                className="w-full py-5 rounded-[2rem] bg-slate-900 text-white font-black text-xs uppercase tracking-[0.2em] shadow-2xl shadow-slate-900/20 hover:bg-slate-800 transition-all active:scale-95"
              >
                Go to My Bookings
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Error Modal */}
      {errorMessage && (
        <div className="fixed inset-0 bg-slate-950/40 backdrop-blur-xl flex justify-center items-center z-[110] p-6 animate-in fade-in duration-300">
          <div className="bg-white rounded-[3.5rem] w-full max-w-md overflow-hidden shadow-2xl border border-white/50 animate-in zoom-in-95 duration-300">
            <div className="bg-rose-500 p-12 flex flex-col items-center text-white relative overflow-hidden">
              <div className="absolute top-0 right-0 -mr-20 -mt-20 w-48 h-48 bg-white/20 rounded-full blur-3xl"></div>
              <div className="relative z-10 w-24 h-24 bg-white/20 rounded-3xl backdrop-blur-md border border-white/30 flex items-center justify-center mb-8 shadow-2xl">
                <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <h3 className="text-3xl font-black tracking-tight text-center leading-tight">Booking <br/>Failed</h3>
            </div>
            <div className="p-10 text-center space-y-8">
              <p className="text-slate-500 font-medium leading-relaxed">
                {errorMessage}
              </p>
              <button 
                onClick={() => setErrorMessage("")} 
                className="w-full py-5 rounded-[2rem] bg-slate-900 text-white font-black text-xs uppercase tracking-[0.2em] shadow-2xl shadow-slate-900/20 hover:bg-slate-800 transition-all active:scale-95"
              >
                Try Again
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default BookingFormPage;