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
    <div className="max-w-[680px] w-full mx-auto px-5 pb-12 text-left flex-1 animate-[fadeInUp_0.5s_ease_both]">
      <h2 className="font-['Sora',sans-serif] text-2xl font-bold text-[#0d1f4e] mb-7 tracking-[-0.02em] inline-block relative after:content-[''] after:absolute after:-bottom-1.5 after:left-0 after:w-[60%] after:h-[3px] after:bg-gradient-to-r after:from-[#60a5fa] after:to-[#1e56c8] after:rounded-full">Book a SLIIT Campus Resource</h2>
      <div className="bg-white/55 backdrop-blur-md border border-white/85 rounded-[24px] p-7 mb-6 shadow-[0_8px_32px_0_rgba(31,38,135,0.07)] transition-all duration-300 relative overflow-hidden animate-[fadeInUp_0.4s_ease_both] hover:bg-white/75 hover:border-white hover:-translate-y-1 hover:shadow-[0_12px_40px_0_rgba(31,38,135,0.1)]">
        <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
          
          <div>
            <label className="text-[0.85rem] font-semibold text-[#1a3270] mb-1.5 block pl-1.5">
              Select Resource *
            </label>
            <select
              name="resourceId"
              value={formData.resourceId}
              onChange={handleChange}
              required
              className="w-full font-['Plus_Jakarta_Sans',sans-serif] text-[0.95rem] py-3 px-5 border-[1.5px] border-white/85 rounded-full bg-white/45 text-[#0d1f4e] transition-all duration-300 outline-none block focus:border-[#1e56c8] focus:shadow-[0_0_0_4px_rgba(30,86,200,0.15)] focus:bg-white hover:not(:focus):border-[#7a93c4] hover:not(:focus):bg-white/65 appearance-none bg-no-repeat bg-[right_1.25rem_center] bg-[length:1.25rem] pr-12 cursor-pointer"
              style={{ backgroundImage: "url(\"data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%233b5080' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e\")"}}
            >
              {SLIIT_RESOURCES.map(r => (
                <option key={r.id} value={r.id} disabled={r.id === ""}>{r.name}</option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-[15px] mt-[15px] max-md:grid-cols-1">
            <div>
              <label className="text-[0.85rem] font-semibold text-[#1a3270] mb-1.5 block pl-1.5">Student ID *</label>
              <input
                type="text"
                name="userId"
                placeholder="e.g. IT21000000"
                value={formData.userId}
                onChange={handleChange}
                readOnly={!!localStorage.getItem("currentUserId")}
                className={`w-full font-['Plus_Jakarta_Sans',sans-serif] text-[0.95rem] py-3 px-5 border-[1.5px] border-white/85 rounded-full text-[#0d1f4e] transition-all duration-300 outline-none block placeholder-[#7a93c4] focus:border-[#1e56c8] focus:shadow-[0_0_0_4px_rgba(30,86,200,0.15)] focus:bg-white hover:not(:focus):border-[#7a93c4] hover:not(:focus):bg-white/65 ${localStorage.getItem("currentUserId") ? 'bg-black/5' : 'bg-white/45'}`}
                required
              />
            </div>
            <div>
              <label className="text-[0.85rem] font-semibold text-[#1a3270] mb-1.5 block pl-1.5">Student Name *</label>
              <input
                type="text"
                name="userName"
                placeholder="Your Full Name"
                value={formData.userName}
                onChange={handleChange}
                readOnly={!!localStorage.getItem("currentUserName")}
                className={`w-full font-['Plus_Jakarta_Sans',sans-serif] text-[0.95rem] py-3 px-5 border-[1.5px] border-white/85 rounded-full text-[#0d1f4e] transition-all duration-300 outline-none block placeholder-[#7a93c4] focus:border-[#1e56c8] focus:shadow-[0_0_0_4px_rgba(30,86,200,0.15)] focus:bg-white hover:not(:focus):border-[#7a93c4] hover:not(:focus):bg-white/65 ${localStorage.getItem("currentUserName") ? 'bg-black/5' : 'bg-white/45'}`}
                required
              />
            </div>
          </div>

          <div className="mt-[15px]">
             <label className="text-[0.85rem] font-semibold text-[#1a3270] mb-1.5 block pl-1.5">Booking Date *</label>
             <input
               type="date"
               name="date"
               value={formData.date}
               onChange={handleChange}
               className="w-full font-['Plus_Jakarta_Sans',sans-serif] text-[0.95rem] py-3 px-5 border-[1.5px] border-white/85 rounded-full bg-white/45 text-[#0d1f4e] transition-all duration-300 outline-none block placeholder-[#7a93c4] focus:border-[#1e56c8] focus:shadow-[0_0_0_4px_rgba(30,86,200,0.15)] focus:bg-white hover:not(:focus):border-[#7a93c4] hover:not(:focus):bg-white/65 cursor-pointer"
               required
             />
          </div>

          <div className="grid grid-cols-2 gap-[15px] mt-[15px] max-md:grid-cols-1">
            <div>
              <label className="text-[0.85rem] font-semibold text-[#1a3270] mb-1.5 block pl-1.5">Start Time *</label>
              <input
                type="time"
                name="startTime"
                value={formData.startTime}
                onChange={handleChange}
                className="w-full font-['Plus_Jakarta_Sans',sans-serif] text-[0.95rem] py-3 px-5 border-[1.5px] border-white/85 rounded-full bg-white/45 text-[#0d1f4e] transition-all duration-300 outline-none block placeholder-[#7a93c4] focus:border-[#1e56c8] focus:shadow-[0_0_0_4px_rgba(30,86,200,0.15)] focus:bg-white hover:not(:focus):border-[#7a93c4] hover:not(:focus):bg-white/65 cursor-pointer"
                required
              />
            </div>
            <div>
              <label className="text-[0.85rem] font-semibold text-[#1a3270] mb-1.5 block pl-1.5">End Time *</label>
              <input
                type="time"
                name="endTime"
                value={formData.endTime}
                onChange={handleChange}
                className="w-full font-['Plus_Jakarta_Sans',sans-serif] text-[0.95rem] py-3 px-5 border-[1.5px] border-white/85 rounded-full bg-white/45 text-[#0d1f4e] transition-all duration-300 outline-none block placeholder-[#7a93c4] focus:border-[#1e56c8] focus:shadow-[0_0_0_4px_rgba(30,86,200,0.15)] focus:bg-white hover:not(:focus):border-[#7a93c4] hover:not(:focus):bg-white/65 cursor-pointer"
                required
              />
            </div>
          </div>

          <div className="mt-[15px]">
             <label className="text-[0.85rem] font-semibold text-[#1a3270] mb-1.5 block pl-1.5">Purpose of Booking *</label>
             <input
               type="text"
               name="purpose"
               placeholder="e.g. Group Project Meeting, Rehearsal"
               value={formData.purpose}
               onChange={handleChange}
               className="w-full font-['Plus_Jakarta_Sans',sans-serif] text-[0.95rem] py-3 px-5 border-[1.5px] border-white/85 rounded-full bg-white/45 text-[#0d1f4e] transition-all duration-300 outline-none block placeholder-[#7a93c4] focus:border-[#1e56c8] focus:shadow-[0_0_0_4px_rgba(30,86,200,0.15)] focus:bg-white hover:not(:focus):border-[#7a93c4] hover:not(:focus):bg-white/65"
               required
             />
          </div>

          <div className="mt-[15px]">
             <label className="text-[0.85rem] font-semibold text-[#1a3270] mb-1.5 block pl-1.5">Expected Attendees</label>
             <input
               type="number"
               name="expectedAttendees"
               placeholder="Number of attendees"
               min="1"
               value={formData.expectedAttendees}
               onChange={handleChange}
               className="w-full font-['Plus_Jakarta_Sans',sans-serif] text-[0.95rem] py-3 px-5 border-[1.5px] border-white/85 rounded-full bg-white/45 text-[#0d1f4e] transition-all duration-300 outline-none block placeholder-[#7a93c4] focus:border-[#1e56c8] focus:shadow-[0_0_0_4px_rgba(30,86,200,0.15)] focus:bg-white hover:not(:focus):border-[#7a93c4] hover:not(:focus):bg-white/65"
             />
          </div>

          <div className="mt-[20px]">
            <button type="submit" className="w-full p-[0.85rem] text-[0.95rem] mt-4 bg-gradient-to-br from-[#60a5fa] to-[#3b82f6] shadow-[0_6px_16px_rgba(96,165,250,0.3)] hover:from-[#3b82f6] hover:to-[#1e56c8] hover:shadow-[0_10px_24px_rgba(96,165,250,0.45)] font-['Plus_Jakarta_Sans',sans-serif] font-bold rounded-full transition-all duration-300 uppercase shrink-0 text-white border-none cursor-pointer">Submit Booking Request</button>
          </div>
        </form>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-[6px] flex justify-center items-center z-[1000] animate-[fadeInUp_0.3s_ease]">
          <div className="bg-white/55 backdrop-blur-md border border-white/85 p-10 m-0 shadow-[0_8px_32px_0_rgba(31,38,135,0.07)] rounded-[24px] w-[360px] text-center">
            <svg viewBox="0 0 24 24" className="w-[72px] h-[72px] mx-auto mb-6 fill-none stroke-[#059669] stroke-[2px] stroke-linecap-round stroke-linejoin-round drop-shadow-[0_4px_6px_rgba(5,150,105,0.2)]">
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
              <polyline points="22 4 12 14.01 9 11.01"></polyline>
            </svg>
            <h3 className="font-['Sora',sans-serif] text-[1.35rem] text-[#0d1f4e] mb-2 font-bold select-none">Successfully Booked!</h3>
            <p className="text-[#3b5080] mb-6 text-[0.95rem]">Your booking request has been entered into the system.</p>
            <button onClick={handleModalOk} className="w-full font-['Plus_Jakarta_Sans',sans-serif] text-[1rem] font-bold p-[0.85rem] mt-0 rounded-full transition-all duration-300 tracking-wide bg-gradient-to-br from-[#1e56c8] to-[#1a3270] text-white shadow-[0_4px_12px_rgba(30,86,200,0.25)] uppercase outline-none border-none cursor-pointer hover:-translate-y-[3px] hover:shadow-[0_8px_20px_rgba(30,86,200,0.4)] hover:from-[#3b82f6] hover:to-[#1e56c8] active:translate-y-0">OK</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default BookingFormPage;