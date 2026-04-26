// Frontend: src/features/maintenance/admin/AdminTicketManagementPage.jsx

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

// Mock technician list — replace with API call in production
const TECHNICIANS = [
  { id: "tech1", name: "Mike Johnson" },
  { id: "tech2", name: "Sarah Williams" },
  { id: "tech3", name: "David Brown" },
  { id: "tech4", name: "Emily Clark" },
  { id: "tech5", name: "James Wilson" },
];

const STATUS_OPTIONS = ["OPEN", "ASSIGNED", "IN_PROGRESS", "RESOLVED", "CLOSED"];

export default function AdminTicketManagementPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const {
    currentTicket: ticket,
    loading,
    error,
    successMessage,
    clearMessages,
    fetchTicketById,
    assignTechnician,
    changeStatus,
    rejectTicket,
    addComment,
  } = useTickets();

  const [selectedTech, setSelectedTech] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");
  const [rejectReason, setRejectReason] = useState("");
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    fetchTicketById(id);
    return () => clearMessages();
  }, [id, fetchTicketById, clearMessages]);

  useEffect(() => {
    if (ticket) {
      setSelectedTech(ticket.assignedToId || "");
      setSelectedStatus(ticket.status || "");
    }
  }, [ticket]);

  async function handleAssign() {
    if (!selectedTech) return;
    setActionLoading(true);
    await assignTechnician(id, selectedTech);
    setActionLoading(false);
  }

  async function handleStatusChange() {
    if (!selectedStatus) return;
    setActionLoading(true);
    await changeStatus(id, selectedStatus);
    setActionLoading(false);
  }

  async function handleReject() {
    setActionLoading(true);
    await rejectTicket(id, rejectReason);
    setShowRejectModal(false);
    setActionLoading(false);
  }

  if (loading && !ticket) return <Spinner />;
  if (!ticket) return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      <Alert type="error" message={error || "Ticket not found"} />
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto py-8 px-4">
      {/* Header */}
      <div className="mb-6">
        <button
          onClick={() => navigate("/admin/maintenance")}
          className="text-sm text-gray-500 hover:text-gray-700 flex items-center gap-1 mb-3"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to Maintenance Dashboard
        </button>
        <p className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-1">
          Admin Dashboard – Ticket Management
        </p>
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Ticket Management</h1>
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

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left – Ticket Info */}
        <div className="lg:col-span-2 space-y-4">
          {/* Ticket Info Card */}
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
            <h2 className="text-base font-semibold text-gray-800 mb-5">Ticket Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <InfoRow label="Resource/Location" value={ticket.resourceLocation} />
              <InfoRow label="Category" value={ticket.category} />
              <InfoRow label="Priority" value={<PriorityBadge priority={ticket.priority} />} />
              <InfoRow label="Status" value={<StatusBadge status={ticket.status} />} />
              <InfoRow label="Reported By" value={ticket.reportedByName || "—"} />
              <InfoRow
                label="Assigned To"
                value={ticket.assignedToName || <span className="text-gray-400 italic">Unassigned</span>}
              />
              <InfoRow label="Contact" value={ticket.contactDetails || "—"} />
              <InfoRow
                label="Created"
                value={
                  ticket.createdAt
                    ? new Date(ticket.createdAt).toLocaleString("en-US", {
                        month: "short", day: "numeric", year: "numeric",
                        hour: "numeric", minute: "2-digit",
                      })
                    : "—"
                }
              />
            </div>
            <div className="mt-5">
              <p className="text-xs text-gray-400 uppercase tracking-wide mb-1">Description</p>
              <p className="text-sm text-gray-700 leading-relaxed">{ticket.description}</p>
            </div>
          </div>

          {/* Attachments */}
          {ticket.images?.length > 0 && <ImageGallery images={ticket.images} />}

          {/* Work Progress */}
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
            <h3 className="text-sm font-semibold text-gray-800 mb-4">Work Progress</h3>
            <ProgressBar value={ticket.progress || 0} readOnly />
          </div>

          {/* Comments */}
          <CommentThread
            comments={ticket.comments || []}
            onPost={(content) => addComment(id, content)}
          />
        </div>

        {/* Right – Actions Panel */}
        <div className="space-y-4">
          {/* Assign Technician */}
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-5">
            <h3 className="text-sm font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <span className="w-6 h-6 bg-[#1e3a5f]/10 rounded-lg flex items-center justify-center">
                <svg className="w-3.5 h-3.5 text-[#1e3a5f]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </span>
              Assign Technician
            </h3>
            <select
              value={selectedTech}
              onChange={(e) => setSelectedTech(e.target.value)}
              className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#1e3a5f]/30 mb-3 bg-white"
            >
              <option value="">Select a technician...</option>
              {TECHNICIANS.map((t) => (
                <option key={t.id} value={t.id}>{t.name}</option>
              ))}
            </select>
            <button
              onClick={handleAssign}
              disabled={actionLoading || !selectedTech}
              className="w-full bg-[#1e3a5f] text-white py-2.5 rounded-lg text-sm font-semibold hover:bg-[#162d4a] disabled:opacity-50 transition-colors"
            >
              {actionLoading ? "Assigning..." : "Assign Technician"}
            </button>
          </div>

          {/* Change Status */}
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-5">
            <h3 className="text-sm font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <span className="w-6 h-6 bg-purple-100 rounded-lg flex items-center justify-center">
                <svg className="w-3.5 h-3.5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
              </span>
              Change Status
            </h3>
            <div className="space-y-2 mb-3">
              {STATUS_OPTIONS.map((s) => (
                <label
                  key={s}
                  className={`flex items-center gap-2.5 p-2.5 rounded-lg cursor-pointer border transition-all ${
                    selectedStatus === s
                      ? "border-[#1e3a5f] bg-[#1e3a5f]/5"
                      : "border-transparent hover:border-gray-200 hover:bg-gray-50"
                  }`}
                >
                  <input
                    type="radio"
                    name="status"
                    value={s}
                    checked={selectedStatus === s}
                    onChange={() => setSelectedStatus(s)}
                    className="accent-[#1e3a5f]"
                  />
                  <StatusBadge status={s} />
                </label>
              ))}
            </div>
            <button
              onClick={handleStatusChange}
              disabled={actionLoading || !selectedStatus}
              className="w-full bg-purple-600 text-white py-2.5 rounded-lg text-sm font-semibold hover:bg-purple-700 disabled:opacity-50 transition-colors"
            >
              Update Status
            </button>
          </div>

          {/* Danger Zone */}
          <div className="bg-white rounded-2xl border border-red-100 shadow-sm p-5">
            <h3 className="text-sm font-semibold text-red-600 mb-3">Danger Zone</h3>
            <p className="text-xs text-gray-400 mb-3">
              Rejecting a ticket will notify the reporter and close the ticket with a reason.
            </p>
            <button
              onClick={() => setShowRejectModal(true)}
              disabled={ticket.status === "REJECTED" || ticket.status === "RESOLVED"}
              className="w-full bg-red-600 text-white py-2.5 rounded-lg text-sm font-bold hover:bg-red-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              Reject Ticket
            </button>
          </div>
        </div>
      </div>

      {/* Reject Modal */}
      {showRejectModal && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl p-6 max-w-sm w-full">
            <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
              </svg>
            </div>
            <h3 className="text-base font-bold text-gray-800 text-center mb-2">Reject Ticket</h3>
            <p className="text-sm text-gray-500 text-center mb-4">
              Provide a reason for rejecting this ticket. The reporter will be notified.
            </p>
            <textarea
              rows={3}
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              placeholder="Enter rejection reason..."
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-400/30 resize-none mb-4"
            />
            <div className="flex gap-3">
              <button
                onClick={() => setShowRejectModal(false)}
                className="flex-1 border border-gray-200 text-gray-700 py-2.5 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleReject}
                disabled={actionLoading || !rejectReason.trim()}
                className="flex-1 bg-red-600 text-white py-2.5 rounded-lg text-sm font-semibold hover:bg-red-700 disabled:opacity-50 transition-colors"
              >
                {actionLoading ? "Rejecting..." : "Reject"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function InfoRow({ label, value }) {
  return (
    <div>
      <p className="text-xs text-gray-400 uppercase tracking-wide mb-1">{label}</p>
      <p className="text-sm font-semibold text-gray-800">
        {typeof value === "string" ? value : value}
      </p>
    </div>
  );
}
