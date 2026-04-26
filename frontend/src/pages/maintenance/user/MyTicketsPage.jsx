// Frontend: src/features/maintenance/user/MyTicketsPage.jsx

import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useTickets } from "../../../context/TicketContext";
import { PriorityBadge, StatusBadge, Spinner, EmptyState, Alert } from "../components/shared";

export default function MyTicketsPage() {
  const navigate = useNavigate();
  const { tickets, loading, error, clearMessages, fetchMyTickets } = useTickets();

  useEffect(() => {
    fetchMyTickets();
    return () => clearMessages();
  }, [fetchMyTickets, clearMessages]);

  const formatDate = (iso) =>
    iso
      ? new Date(iso).toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
          year: "numeric",
        })
      : "—";

  return (
    <div className="max-w-6xl mx-auto py-8 px-4">
      {/* Header */}
      <div className="mb-8">
        <p className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-1">
          Frame 2: Normal User Dashboard – My Tickets
        </p>
        <h1 className="text-2xl font-bold text-gray-900">My Tickets</h1>
        <p className="text-gray-500 text-sm mt-1">
          View and track all your submitted maintenance requests
        </p>
      </div>

      {error && (
        <div className="mb-4">
          <Alert type="error" message={error} onClose={clearMessages} />
        </div>
      )}

      {loading ? (
        <Spinner />
      ) : tickets.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm">
          <EmptyState
            title="No tickets found"
            description="You haven't submitted any incident reports yet."
          />
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50/60">
                {["Ticket ID", "Resource/Location", "Category", "Priority", "Status", "Created Date", "Action"].map(
                  (h) => (
                    <th
                      key={h}
                      className="px-5 py-3.5 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider"
                    >
                      {h}
                    </th>
                  )
                )}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {tickets.map((ticket) => (
                <tr
                  key={ticket.id}
                  className="hover:bg-gray-50/60 transition-colors group"
                >
                  <td className="px-5 py-4">
                    <button
                      onClick={() => navigate(`/maintenance/my-tickets/${ticket.id}`)}
                      className="text-[#1e3a5f] font-semibold hover:underline"
                    >
                      {ticket.ticketNumber || ticket.id?.slice(-6).toUpperCase()}
                    </button>
                  </td>
                  <td className="px-5 py-4 text-gray-700">{ticket.resourceLocation}</td>
                  <td className="px-5 py-4 text-gray-700">{ticket.category}</td>
                  <td className="px-5 py-4">
                    <PriorityBadge priority={ticket.priority} />
                  </td>
                  <td className="px-5 py-4">
                    <StatusBadge status={ticket.status} />
                  </td>
                  <td className="px-5 py-4 text-gray-500">{formatDate(ticket.createdAt)}</td>
                  <td className="px-5 py-4">
                    <button
                      onClick={() => navigate(`/maintenance/my-tickets/${ticket.id}`)}
                      className="inline-flex items-center gap-1.5 border border-gray-200 text-gray-600 px-3 py-1.5 rounded-lg text-xs font-medium hover:bg-gray-100 hover:border-gray-300 transition-colors"
                    >
                      <svg
                        className="w-3.5 h-3.5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                        />
                      </svg>
                      View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
