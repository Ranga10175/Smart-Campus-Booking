// Frontend: src/features/maintenance/user/ReportNewIncidentPage.jsx

import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useTickets } from "../../../context/TicketContext";
import { Alert } from "../components/shared";

const CATEGORIES = [
  "Electrical",
  "HVAC",
  "Plumbing",
  "IT Equipment",
  "Safety",
  "Structural",
  "Cleaning",
  "Furniture",
  "Network",
  "Other",
];

const PRIORITIES = [
  { value: "LOW", label: "Low", color: "bg-green-100 text-green-700 border-green-200" },
  { value: "MEDIUM", label: "Medium", color: "bg-yellow-100 text-yellow-700 border-yellow-200" },
  { value: "HIGH", label: "High", color: "bg-red-100 text-red-700 border-red-200" },
];

export default function ReportNewIncidentPage() {
  const navigate = useNavigate();
  const { createTicket, loading, error, successMessage, clearMessages } = useTickets();
  const fileInputRef = useRef(null);

  const [form, setForm] = useState({
    resourceLocation: "",
    category: "",
    description: "",
    priority: "",
    contactDetails: "",
  });
  const [images, setImages] = useState([]); // [{file, preview}]
  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [createdId, setCreatedId] = useState("");

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
  }

  function handleImageChange(e) {
    const files = Array.from(e.target.files);
    const allowed = files.filter((f) => ["image/jpeg", "image/png"].includes(f.type));
    const remaining = 3 - images.length;
    const toAdd = allowed.slice(0, remaining).map((f) => ({
      file: f,
      preview: URL.createObjectURL(f),
    }));
    setImages((prev) => [...prev, ...toAdd]);
    e.target.value = "";
  }

  function removeImage(idx) {
    setImages((prev) => {
      URL.revokeObjectURL(prev[idx].preview);
      return prev.filter((_, i) => i !== idx);
    });
  }

  function validate() {
    const e = {};
    if (!form.resourceLocation.trim()) e.resourceLocation = "Resource/Location is required.";
    if (!form.category) e.category = "Please select a category.";
    if (form.description.trim().length < 20) e.description = "Description must be at least 20 characters.";
    if (!form.priority) e.priority = "Please select a priority level.";
    if (!form.contactDetails.trim()) e.contactDetails = "Contact details are required.";
    return e;
  }

  async function handleSubmit() {
    const e = validate();
    if (Object.keys(e).length) { setErrors(e); return; }

    const fd = new FormData();
    fd.append("resourceLocation", form.resourceLocation);
    fd.append("category", form.category);
    fd.append("description", form.description);
    fd.append("priority", form.priority);
    fd.append("contactDetails", form.contactDetails);
    images.forEach((img) => fd.append("images", img.file));

    const result = await createTicket(fd);
    if (result) {
      setCreatedId(result.ticketNumber || result.id);
      setSubmitted(true);
    }
  }

  function handleReset() {
    setForm({ resourceLocation: "", category: "", description: "", priority: "", contactDetails: "" });
    images.forEach((img) => URL.revokeObjectURL(img.preview));
    setImages([]);
    setErrors({});
    setSubmitted(false);
    setCreatedId("");
    clearMessages();
  }

  // ─── Success Screen ──────────────────────────────────────────────────────────
  if (submitted) {
    return (
      <div className="max-w-2xl mx-auto py-12 px-4">
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-10 text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="text-xl font-bold text-gray-800 mb-2">Incident Reported Successfully!</h2>
          <p className="text-gray-500 text-sm mb-1">Your ticket has been submitted.</p>
          <p className="text-[#1e3a5f] font-bold text-lg mb-8">Ticket ID: {createdId}</p>
          <div className="flex gap-3 justify-center">
            <button
              onClick={() => navigate("/maintenance/my-tickets")}
              className="bg-[#1e3a5f] text-white px-6 py-2.5 rounded-lg text-sm font-medium hover:bg-[#162d4a] transition-colors"
            >
              View My Tickets
            </button>
            <button
              onClick={handleReset}
              className="border border-gray-300 text-gray-700 px-6 py-2.5 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors"
            >
              Report Another
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto py-8 px-4">
      {/* Header */}
      <div className="mb-8">
        <p className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-1">
          Frame 1: Normal User Dashboard – Report New Incident
        </p>
        <h1 className="text-2xl font-bold text-gray-900">Report New Incident</h1>
        <p className="text-gray-500 text-sm mt-1">Submit a maintenance request or report an incident on campus</p>
      </div>

      {error && (
        <div className="mb-4">
          <Alert type="error" message={error} onClose={clearMessages} />
        </div>
      )}

      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-8 space-y-6">
        {/* Resource / Location */}
        <Field label="Resource/Location" required error={errors.resourceLocation}>
          <input
            type="text"
            name="resourceLocation"
            value={form.resourceLocation}
            onChange={handleChange}
            placeholder="e.g., Library - 3rd Floor, Building A - Room 205"
            className={inputCls(errors.resourceLocation)}
          />
        </Field>

        {/* Category */}
        <Field label="Category" required error={errors.category}>
          <select
            name="category"
            value={form.category}
            onChange={handleChange}
            className={inputCls(errors.category)}
          >
            <option value="">Select category</option>
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </Field>

        {/* Description */}
        <Field label="Description" required error={errors.description}>
          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            rows={4}
            placeholder="Provide detailed information about the issue (minimum 20 characters)"
            className={`${inputCls(errors.description)} resize-none`}
          />
          <p className={`text-xs mt-1 ${form.description.length >= 20 ? "text-green-600" : "text-gray-400"}`}>
            {form.description.length} / 20 characters minimum
          </p>
        </Field>

        {/* Priority */}
        <Field label="Priority" required error={errors.priority}>
          <div className="flex gap-3 flex-wrap">
            {PRIORITIES.map((p) => (
              <label
                key={p.value}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-lg border cursor-pointer transition-all text-sm font-medium ${
                  form.priority === p.value
                    ? `${p.color} ring-2 ring-offset-1 ring-current`
                    : "border-gray-200 text-gray-600 hover:border-gray-300"
                }`}
              >
                <input
                  type="radio"
                  name="priority"
                  value={p.value}
                  checked={form.priority === p.value}
                  onChange={handleChange}
                  className="hidden"
                />
                <span
                  className={`w-2.5 h-2.5 rounded-full ${
                    p.value === "HIGH" ? "bg-red-500" : p.value === "MEDIUM" ? "bg-yellow-500" : "bg-green-500"
                  }`}
                />
                {p.label}
              </label>
            ))}
          </div>
          {errors.priority && <p className="text-red-500 text-xs mt-1">{errors.priority}</p>}
        </Field>

        {/* Contact Details */}
        <Field label="Preferred Contact Details" required error={errors.contactDetails}>
          <input
            type="text"
            name="contactDetails"
            value={form.contactDetails}
            onChange={handleChange}
            placeholder="e.g., email@sliit.lk or +94 77 123 4567"
            className={inputCls(errors.contactDetails)}
          />
        </Field>

        {/* Image Attachments */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">
            Image Attachments
          </label>
          <p className="text-xs text-gray-400 mb-3">Upload up to 3 images (JPG, PNG only)</p>

          {/* Previews */}
          {images.length > 0 && (
            <div className="flex gap-3 flex-wrap mb-3">
              {images.map((img, i) => (
                <div key={i} className="relative group w-24 h-24">
                  <img
                    src={img.preview}
                    alt={`preview-${i}`}
                    className="w-full h-full object-cover rounded-lg border border-gray-200"
                  />
                  <button
                    type="button"
                    onClick={() => removeImage(i)}
                    className="absolute -top-2 -right-2 w-5 h-5 bg-red-500 text-white rounded-full text-xs flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          )}

          {images.length < 3 && (
            <div
              onClick={() => fileInputRef.current?.click()}
              className="border-2 border-dashed border-gray-200 rounded-xl p-8 text-center cursor-pointer hover:border-[#1e3a5f]/40 hover:bg-gray-50 transition-colors"
            >
              <svg className="w-8 h-8 text-gray-300 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                  d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
              </svg>
              <p className="text-sm text-gray-400">Drag and drop images here, or click to browse</p>
              <button
                type="button"
                className="mt-3 border border-gray-300 text-gray-600 px-4 py-1.5 rounded-lg text-sm hover:bg-gray-100 transition-colors"
              >
                Choose Files
              </button>
            </div>
          )}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/png"
            multiple
            className="hidden"
            onChange={handleImageChange}
          />
        </div>

        {/* Actions */}
        <div className="flex gap-3 pt-2">
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="bg-[#1e3a5f] text-white px-8 py-2.5 rounded-lg text-sm font-semibold hover:bg-[#162d4a] disabled:opacity-60 transition-colors"
          >
            {loading ? "Submitting..." : "Submit Incident Report"}
          </button>
          <button
            onClick={handleReset}
            className="border border-gray-300 text-gray-700 px-6 py-2.5 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}

// Helpers
function inputCls(error) {
  return `w-full border ${error ? "border-red-300 bg-red-50" : "border-gray-200 bg-gray-50"} rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#1e3a5f]/30 focus:border-[#1e3a5f] transition-colors`;
}

function Field({ label, required, error, children }) {
  return (
    <div>
      <label className="block text-sm font-semibold text-gray-700 mb-1.5">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      {children}
      {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
    </div>
  );
}
