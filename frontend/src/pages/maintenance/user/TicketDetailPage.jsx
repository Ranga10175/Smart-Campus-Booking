// Frontend: src/features/maintenance/user/TicketDetailPage.jsx

import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useTickets } from "../../../context/TicketContext";
import {
  PriorityBadge,
  StatusBadge,
  TimeElapsedCard,
  Spinner,
  Alert,
  CommentThread,
  ImageGallery,
  ProgressBar,
} from "../components/shared";

const CATEGORIES = [
  "Electrical", "HVAC", "Plumbing", "IT Equipment",
  "Safety", "Structural", "Cleaning", "Furniture", "Network", "Other",
];
const PRIORITIES = ["LOW", "MEDIUM", "HIGH"];

export default function TicketDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const {
    currentTicket: ticket,
    loading,
    error,
    successMessage,
    clearMessages,
    fetchTicketById,
    updateTicket,
    deleteTicket,
    addComment,
  } = useTickets();

  const [editing, setEditing] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [editForm, setEditForm] = useState({});
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    fetchTicketById(id);
    return () => clearMessages();
  }, [id, fetchTicketById, clearMessages]);

  useEffect(() => {
    if (ticket) {
      setEditForm({
        resourceLocation: ticket.resourceLocation,
        category: ticket.category,
        description: ticket.description,
        priority: ticket.priority,
        contactDetails: ticket.contactDetails,
      });
    }
  }, [ticket]);

  async function handleUpdate() {
    await updateTicket(id, editForm);
    setEditing(false);
  }

  async function handleDelete() {
    setDeleting(true);
    const ok = await deleteTicket(id);
    if (ok) navigate("/maintenance/my-tickets");
    else setDeleting(false);
  }

  if (loading && !ticket) return <Spinner />;
  if (!ticket) return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      <Alert type="error" message={error || "Ticket not found"} />
    </div>
  );

  return (
    <div className="max-w-5xl mx-auto py-8 px-4">
      {/* Header */}
      <div className="mb-6">
        <button
          onClick={() => navigate("/maintenance/my-tickets")}
          className="text-sm text-gray-500 hover:text-gray-700 flex items-center gap-1 mb-3 transition-colors"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to My Tickets
        </button>
        <p className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-1">
          Frame 3: Normal User Dashboard – Ticket Detail View
        </p>
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Ticket Details</h1>
            <p className="text-sm text-gray-500 mt-0.5">
              Ticket ID:{" "}
              <span className="font-semibold text-[#1e3a5f]">
                {ticket.ticketNumber || ticket.id}
              </span>
            </p>
          </div>
          <TimeElapsedCard createdAt={ticket.createdAt} />
        </div>
      </div>

      {error && <div className="mb-4"><Alert type="error" message={error} onClose={clearMessages} /></div>}
      {successMessage && <div className="mb-4"><Alert type="success" message={successMessage} onClose={clearMessages} /></div>}

      <div className="space-y-4">
        {/* Ticket Info */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-base font-semibold text-gray-800">Ticket Information</h2>
            {!editing && (
              <div className="flex gap-2">
                <button
                  onClick={() => setEditing(true)}
                  className="border border-gray-200 text-gray-700 px-3 py-1.5 rounded-lg text-xs font-medium hover:bg-gray-50 transition-colors"
                >
                  Update Ticket
                </button>
                <button
                  onClick={() => setShowDeleteConfirm(true)}
                  className="border border-red-200 text-red-600 px-3 py-1.5 rounded-lg text-xs font-medium hover:bg-red-50 transition-colors"
                >
                  Delete Ticket
                </button>
              </div>
            )}
          </div>

          {editing ? (
            <EditForm
              form={editForm}
              onChange={(k, v) => setEditForm((p) => ({ ...p, [k]: v }))}
              onSave={handleUpdate}
              onCancel={() => setEditing(false)}
              loading={loading}
            />
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <InfoRow label="Resource/Location" icon="📍" value={ticket.resourceLocation} />
                <InfoRow label="Category" icon="🏷️" value={ticket.category} />
                <InfoRow label="Priority" icon="⚡" value={<PriorityBadge priority={ticket.priority} />} />
                <InfoRow label="Status" icon="📅" value={<StatusBadge status={ticket.status} />} />
                <InfoRow label="Reported By" icon="👤" value={ticket.reportedByName || "You"} />
                <InfoRow label="Assigned To" icon="🔧" value={ticket.assignedToName || "Unassigned"} />
              </div>
              <div className="mt-5">
                <p className="text-xs text-gray-400 uppercase tracking-wide mb-1">Description</p>
                <p className="text-sm text-gray-700 leading-relaxed">{ticket.description}</p>
              </div>
            </>
          )}
        </div>

        {/* Quick Info + Progress */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-5">
            <h3 className="text-sm font-semibold text-gray-700 mb-3">Quick Information</h3>
            <div className="space-y-2 text-sm">
              <div>
                <p className="text-xs text-gray-400">Created</p>
                <p className="font-medium text-gray-800">
                  {ticket.createdAt
                    ? new Date(ticket.createdAt).toLocaleString("en-US", {
                        month: "short", day: "numeric", year: "numeric",
                        hour: "numeric", minute: "2-digit",
                      })
                    : "—"}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-400">Contact</p>
                <p className="font-medium text-gray-800">{ticket.contactDetails}</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-5">
            <h3 className="text-sm font-semibold text-gray-700 mb-3">Work Progress</h3>
            <ProgressBar value={ticket.progress || 0} readOnly />
          </div>
        </div>

        {/* Attachments */}
        {ticket.images?.length > 0 && <ImageGallery images={ticket.images} />}

        {/* Comments */}
        <CommentThread
          comments={ticket.comments || []}
          onPost={(content) => addComment(id, content)}
          currentUserName={ticket.reportedByName}
        />
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl p-6 max-w-sm w-full">
            <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <h3 className="text-base font-bold text-gray-800 text-center mb-2">Delete Ticket?</h3>
            <p className="text-sm text-gray-500 text-center mb-6">
              This action cannot be undone. The ticket and all associated data will be permanently removed.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="flex-1 border border-gray-200 text-gray-700 py-2.5 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                disabled={deleting}
                className="flex-1 bg-red-600 text-white py-2.5 rounded-lg text-sm font-semibold hover:bg-red-700 disabled:opacity-50 transition-colors"
              >
                {deleting ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function InfoRow({ label, icon, value }) {
  return (
    <div>
      <p className="text-xs text-gray-400 uppercase tracking-wide mb-1">{label}</p>
      <p className="text-sm font-semibold text-gray-800 flex items-center gap-1.5">
        {typeof value === "string" ? value : value}
      </p>
    </div>
  );
}

function EditForm({ form, onChange, onSave, onCancel, loading }) {
  const CATEGORIES = [
    "Electrical", "HVAC", "Plumbing", "IT Equipment",
    "Safety", "Structural", "Cleaning", "Furniture", "Network", "Other",
  ];

  return (
    <div className="space-y-4">
      <div>
        <label className="text-xs text-gray-500 font-medium">Resource/Location</label>
        <input
          className="mt-1 w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1e3a5f]/30"
          value={form.resourceLocation}
          onChange={(e) => onChange("resourceLocation", e.target.value)}
        />
      </div>
      <div>
        <label className="text-xs text-gray-500 font-medium">Category</label>
        <select
          className="mt-1 w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1e3a5f]/30"
          value={form.category}
          onChange={(e) => onChange("category", e.target.value)}
        >
          {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
        </select>
      </div>
      <div>
        <label className="text-xs text-gray-500 font-medium">Description</label>
        <textarea
          rows={3}
          className="mt-1 w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1e3a5f]/30 resize-none"
          value={form.description}
          onChange={(e) => onChange("description", e.target.value)}
        />
      </div>
      <div>
        <label className="text-xs text-gray-500 font-medium">Priority</label>
        <select
          className="mt-1 w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1e3a5f]/30"
          value={form.priority}
          onChange={(e) => onChange("priority", e.target.value)}
        >
          {["LOW", "MEDIUM", "HIGH"].map((p) => <option key={p}>{p}</option>)}
        </select>
      </div>
      <div>
        <label className="text-xs text-gray-500 font-medium">Contact Details</label>
        <input
          className="mt-1 w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1e3a5f]/30"
          value={form.contactDetails}
          onChange={(e) => onChange("contactDetails", e.target.value)}
        />
      </div>
      <div className="flex gap-3 pt-2">
        <button
          onClick={onSave}
          disabled={loading}
          className="bg-[#1e3a5f] text-white px-6 py-2 rounded-lg text-sm font-semibold hover:bg-[#162d4a] disabled:opacity-50 transition-colors"
        >
          {loading ? "Saving..." : "Save Changes"}
        </button>
        <button
          onClick={onCancel}
          className="border border-gray-200 text-gray-600 px-5 py-2 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}
