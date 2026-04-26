// Frontend: src/features/maintenance/technician/TechnicianMyAssignedTicketsPage.jsx

import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useTickets } from "../../../context/TicketContext";
import {
  PriorityBadge,
  StatusBadge,
  TimeElapsedBadge,
  Spinner,
  EmptyState,
  Alert,
  ProgressBar,
} from "../components/shared";

export default function TechnicianMyAssignedTicketsPage() {
  const navigate = useNavigate();
  const { tickets, loading, error, clearMessages, fetchAssignedTickets } = useTickets();

  useEffect(() => {
    fetchAssignedTickets();
    return () => clearMessages();
  }, [fetchAssignedTickets, clearMessages]);

  const total = tickets.length;
  const inProgress = tickets.filter((t) => t.status === "IN_PROGRESS").length;
  const highPriority = tickets.filter((t) => t.priority === "HIGH").length;

  return (
    <div className="max-w-5xl mx-auto py-8 px-4">
      {/* Header */}
      <div className="mb-6">
        <p className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-1">
          Technician Portal – My Assigned Tickets
        </p>
        <h1 className="text-2xl font-bold text-gray-900">My Assigned Tickets</h1>
        <p className="text-gray-500 text-sm mt-1">View and manage tickets assigned to you</p>
      </div>

      {error && (
        <div className="mb-4">
          <Alert type="error" message={error} onClose={clearMessages} />
        </div>
      )}

      {/* Summary Cards */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <SummaryCard
          label="Total Assigned"
          value={total}
          icon={
            <svg className="w-5 h-5 text-[#1e3a5f]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
            </svg>
          }
          bg="bg-blue-50"
        />
        <SummaryCard
          label="In Progress"
          value={inProgress}
          icon={
            <svg className="w-5 h-5 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <circle cx="12" cy="12" r="10" strokeWidth="2" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6l4 2" />
            </svg>
          }
          bg="bg-orange-50"
        />
        <SummaryCard
          label="High Priority"
          value={highPriority}
          icon={
            <svg className="w-5 h-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          }
          bg="bg-red-50"
        />
      </div>

      {loading ? (
        <Spinner />
      ) : tickets.length === 0 ? (
        <EmptyState title="No tickets assigned" description="You have no tickets assigned to you." />
      ) : (
        <div className="space-y-4">
          {tickets.map((ticket) => (
            <TicketCard
              key={ticket.id}
              ticket={ticket}
              onView={() => navigate(`/admin/maintenance/ticket/${ticket.id}`)}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function SummaryCard({ label, value, icon, bg }) {
  return (
    <div className={`${bg} border border-gray-100 rounded-2xl px-5 py-4 flex items-center justify-between`}>
      <div>
        <p className="text-xs text-gray-500 font-medium mb-0.5">{label}</p>
        <p className="text-3xl font-bold text-gray-800">{value}</p>
      </div>
      <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-sm">
        {icon}
      </div>
    </div>
  );
}

function TicketCard({ ticket, onView }) {
  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-5 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3 flex-wrap">
          <span className="text-[#1e3a5f] font-bold text-base">
            {ticket.ticketNumber || ticket.id?.slice(-6).toUpperCase()}
          </span>
          <PriorityBadge priority={ticket.priority} />
          <StatusBadge status={ticket.status} />
        </div>
        <div className="text-right">
          <TimeElapsedBadge createdAt={ticket.createdAt} />
          <p className="text-xs text-gray-400 mt-0.5">Time Elapsed</p>
        </div>
      </div>

      <div className="flex items-center gap-1.5 text-sm text-gray-500 mb-1">
        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
            d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
        </svg>
        {ticket.resourceLocation}
      </div>
      <div className="flex items-center gap-1.5 text-sm text-gray-500 mb-3">
        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
            d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
        </svg>
        {ticket.category}
      </div>

      <p className="text-sm text-gray-600 mb-4 line-clamp-2">{ticket.description}</p>

      {/* Progress Bar */}
      {ticket.status === "IN_PROGRESS" && (
        <div className="mb-4">
          <div className="flex justify-between text-xs text-gray-500 mb-1">
            <span>Work Progress</span>
            <span className="font-semibold text-orange-500">{ticket.progress || 0}%</span>
          </div>
          <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-orange-400 rounded-full transition-all"
              style={{ width: `${ticket.progress || 0}%` }}
            />
          </div>
        </div>
      )}

      <div className="flex justify-end">
        <button
          onClick={onView}
          className="bg-[#1e3a5f] text-white px-5 py-2 rounded-lg text-sm font-semibold hover:bg-[#162d4a] transition-colors"
        >
          View Details
        </button>
      </div>
    </div>
  );
}
