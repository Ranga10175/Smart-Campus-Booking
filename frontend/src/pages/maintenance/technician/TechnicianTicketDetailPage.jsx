// Frontend: src/features/maintenance/technician/TechnicianTicketDetailPage.jsx

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

export default function TechnicianTicketDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const {
    currentTicket: ticket,
    loading,
    error,
    successMessage,
    clearMessages,
    fetchTicketById,
    changeStatus,
    updateProgress,
    addComment,
    saveResolutionNotes,
  } = useTickets();

  const [progress, setProgress] = useState(0);
  const [resolutionNotes, setResolutionNotes] = useState("");
  const [savingNotes, setSavingNotes] = useState(false);
  const [actioning, setActioning] = useState(false);

  useEffect(() => {
    fetchTicketById(id);
    return () => clearMessages();
  }, [id, fetchTicketById, clearMessages]);

  useEffect(() => {
    if (ticket) {
      setProgress(ticket.progress || 0);
      setResolutionNotes(ticket.resolutionNotes || "");
    }
  }, [ticket]);

  // Debounced progress update
  useEffect(() => {
    if (!ticket) return;
    const t = setTimeout(() => {
      if (progress !== (ticket.progress || 0)) {
        updateProgress(id, progress);
      }
    }, 800);
    return () => clearTimeout(t);
  }, [progress]);

  async function handleStartWork() {
    setActioning(true);
    await changeStatus(id, "IN_PROGRESS");
    setActioning(false);
  }

  async function handleMarkResolved() {
    setActioning(true);
    await changeStatus(id, "RESOLVED");
    setActioning(false);
  }

  async function handleSaveNotes() {
    setSavingNotes(true);
    await saveResolutionNotes(id, resolutionNotes);
    setSavingNotes(false);
  }

  if (loading && !ticket) return <Spinner />;
  if (!ticket) return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      <Alert type="error" message={error || "Ticket not found"} />
    </div>
  );

  const isInProgress = ticket.status === "IN_PROGRESS";
  const isResolved = ticket.status === "RESOLVED";

  return (
    <div className="max-w-5xl mx-auto py-8 px-4">
      {/* Header */}
      <div className="mb-6">
        <button
          onClick={() => navigate("/admin/maintenance/technician-dashboard")}
          className="text-sm text-gray-500 hover:text-gray-700 flex items-center gap-1 mb-3"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to My Assigned Tickets
        </button>
        <p className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-1">
          Frame 7: Technician Dashboard – Ticket Detail View
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

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Main Column */}
        <div className="lg:col-span-2 space-y-4">
          {/* Ticket Info */}
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
            <h2 className="text-base font-semibold text-gray-800 mb-5">Ticket Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <InfoRow label="Resource/Location" value={ticket.resourceLocation} />
              <InfoRow label="Category" value={ticket.category} />
              <InfoRow label="Priority" value={<PriorityBadge priority={ticket.priority} />} />
              <InfoRow label="Status" value={<StatusBadge status={ticket.status} />} />
              <InfoRow label="Reported By" value={ticket.reportedByName || "—"} />
              <InfoRow label="Contact" value={ticket.contactDetails || "—"} />
            </div>
            <div className="mt-5">
              <p className="text-xs text-gray-400 uppercase tracking-wide mb-1">Description</p>
              <p className="text-sm text-gray-700 leading-relaxed">{ticket.description}</p>
            </div>
          </div>

          {/* Attachments */}
          {ticket.images?.length > 0 && <ImageGallery images={ticket.images} />}

          {/* Actions */}
          {!isResolved && (
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
              <h2 className="text-base font-semibold text-gray-800 mb-4">Actions</h2>
              <div className="flex gap-3 flex-wrap">
                {!isInProgress && (
                  <button
                    onClick={handleStartWork}
                    disabled={actioning}
                    className="flex-1 min-w-[140px] bg-green-600 text-white py-3 rounded-xl text-sm font-bold hover:bg-green-700 disabled:opacity-50 transition-colors flex items-center justify-center gap-2"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Start Work
                  </button>
                )}
                <button
                  onClick={handleMarkResolved}
                  disabled={actioning}
                  className="flex-1 min-w-[140px] bg-[#1e3a5f] text-white py-3 rounded-xl text-sm font-bold hover:bg-[#162d4a] disabled:opacity-50 transition-colors flex items-center justify-center gap-2"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Mark as Resolved
                </button>
              </div>
            </div>
          )}

          {/* Resolution Notes */}
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
            <h2 className="text-base font-semibold text-gray-800 mb-1">Resolution Notes</h2>
            <p className="text-xs text-gray-400 mb-4">Provide detailed notes about the work performed and resolution</p>
            <textarea
              rows={4}
              value={resolutionNotes}
              onChange={(e) => setResolutionNotes(e.target.value)}
              placeholder="Describe the actions taken, parts replaced, or any other relevant details..."
              className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#1e3a5f]/30 resize-none mb-3"
            />
            <button
              onClick={handleSaveNotes}
              disabled={savingNotes}
              className="bg-[#1e3a5f] text-white px-5 py-2 rounded-lg text-sm font-semibold hover:bg-[#162d4a] disabled:opacity-50 transition-colors"
            >
              {savingNotes ? "Saving..." : "Save Notes"}
            </button>
          </div>

          {/* Comments */}
          <CommentThread
            comments={ticket.comments || []}
            onPost={(content) => addComment(id, content)}
          />
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          {/* Ticket Timeline */}
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-5">
            <h3 className="text-sm font-semibold text-gray-800 mb-4">Ticket Timeline</h3>
            <div className="space-y-3 text-sm">
              <div>
                <p className="text-xs text-gray-400">Created</p>
                <p className="font-medium text-gray-700">
                  {ticket.createdAt
                    ? new Date(ticket.createdAt).toLocaleString("en-US", {
                        month: "short", day: "numeric", year: "numeric",
                        hour: "numeric", minute: "2-digit",
                      })
                    : "—"}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-400">Assigned to You</p>
                <p className="font-medium text-gray-700">
                  {ticket.assignedAt
                    ? new Date(ticket.assignedAt).toLocaleString("en-US", {
                        month: "short", day: "numeric", year: "numeric",
                        hour: "numeric", minute: "2-digit",
                      })
                    : "—"}
                </p>
              </div>
              {ticket.resolvedAt && (
                <div>
                  <p className="text-xs text-gray-400">Resolved</p>
                  <p className="font-medium text-gray-700">
                    {new Date(ticket.resolvedAt).toLocaleString("en-US", {
                      month: "short", day: "numeric", year: "numeric",
                      hour: "numeric", minute: "2-digit",
                    })}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Work Progress */}
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-5">
            <h3 className="text-sm font-semibold text-gray-800 mb-4">Work Progress</h3>
            <ProgressBar
              value={progress}
              onChange={setProgress}
              readOnly={isResolved}
            />
          </div>
        </div>
      </div>
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
