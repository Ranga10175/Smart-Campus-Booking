// Frontend: src/features/maintenance/admin/AdminAllTicketsPage.jsx

import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTickets } from "../../../context/TicketContext";
import {
  PriorityBadge,
  StatusBadge,
  TimeElapsedBadge,
  Spinner,
  EmptyState,
  Alert,
} from "../components/shared";

const STATUS_OPTIONS = ["All Status", "OPEN", "ASSIGNED", "IN_PROGRESS", "RESOLVED", "REJECTED"];
const PRIORITY_OPTIONS = ["All Priorities", "HIGH", "MEDIUM", "LOW"];
const CATEGORY_OPTIONS = [
  "All Categories", "Electrical", "HVAC", "Plumbing", "IT Equipment",
  "Safety", "Structural", "Cleaning", "Furniture", "Network", "Other",
];
const DATE_OPTIONS = ["All Time", "Today", "Last 7 Days", "Last 30 Days"];

export default function AdminAllTicketsPage() {
  const navigate = useNavigate();
  const { tickets, loading, error, clearMessages, fetchAllTickets } = useTickets();

  const [filters, setFilters] = useState({
    status: "All Status",
    priority: "All Priorities",
    category: "All Categories",
    dateRange: "All Time",
  });

  useEffect(() => {
    const f = {};
    if (filters.status !== "All Status") f.status = filters.status;
    if (filters.priority !== "All Priorities") f.priority = filters.priority;
    if (filters.category !== "All Categories") f.category = filters.category;
    if (filters.dateRange !== "All Time") f.dateRange = filters.dateRange;
    fetchAllTickets(f);
  }, [filters, fetchAllTickets]);

  useEffect(() => () => clearMessages(), [clearMessages]);

  const formatDate = (iso) =>
    iso
      ? new Date(iso).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
      : "—";

  // Sidebar stats
  const openCount = tickets.filter((t) => t.status === "OPEN").length;
  const highCount = tickets.filter((t) => t.priority === "HIGH" && t.status !== "RESOLVED").length;

  // Avg resolution time (resolved tickets)
  const resolved = tickets.filter((t) => t.status === "RESOLVED" && t.resolvedAt && t.createdAt);
  const avgH =
    resolved.length > 0
      ? Math.round(
          resolved.reduce((acc, t) => {
            return acc + (new Date(t.resolvedAt) - new Date(t.createdAt)) / 3600000;
          }, 0) / resolved.length
        )
      : 36;

  return (
    <div className="max-w-7xl mx-auto py-8 px-4">
      {/* Header */}
      <div className="mb-6">
        <p className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-1">
          Frame 4: Admin Dashboard – Maintenance (All Tickets)
        </p>
        <h1 className="text-2xl font-bold text-gray-900">Maintenance Dashboard</h1>
        <p className="text-gray-500 text-sm mt-1">Manage all maintenance tickets and assign technicians</p>
      </div>

      {error && (
        <div className="mb-4">
          <Alert type="error" message={error} onClose={clearMessages} />
        </div>
      )}

      <div className="flex gap-6">
        {/* Main Area */}
        <div className="flex-1 min-w-0">
          {/* Filter Bar */}
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-4 mb-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <FilterSelect
                label="Status"
                value={filters.status}
                options={STATUS_OPTIONS}
                onChange={(v) => setFilters((p) => ({ ...p, status: v }))}
              />
              <FilterSelect
                label="Priority"
                value={filters.priority}
                options={PRIORITY_OPTIONS}
                onChange={(v) => setFilters((p) => ({ ...p, priority: v }))}
              />
              <FilterSelect
                label="Category"
                value={filters.category}
                options={CATEGORY_OPTIONS}
                onChange={(v) => setFilters((p) => ({ ...p, category: v }))}
              />
              <FilterSelect
                label="Date Range"
                value={filters.dateRange}
                options={DATE_OPTIONS}
                onChange={(v) => setFilters((p) => ({ ...p, dateRange: v }))}
              />
            </div>
          </div>

          {/* Table */}
          {loading ? (
            <Spinner />
          ) : tickets.length === 0 ? (
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm">
              <EmptyState title="No tickets found" description="No tickets match the current filters." />
            </div>
          ) : (
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-100 bg-gray-50/60">
                    {[
                      "Ticket ID", "Resource/Location", "Category",
                      "Priority", "Status", "Assignee", "Created",
                      "Time Elapsed", "Action",
                    ].map((h) => (
                      <th
                        key={h}
                        className="px-4 py-3.5 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider whitespace-nowrap"
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {tickets.map((ticket) => (
                    <tr key={ticket.id} className="hover:bg-gray-50/50 transition-colors">
                      <td className="px-4 py-3.5">
                        <button
                          onClick={() => navigate(`/admin/maintenance/ticket/${ticket.id}`)}
                          className="text-[#1e3a5f] font-semibold hover:underline"
                        >
                          {ticket.ticketNumber || ticket.id?.slice(-6).toUpperCase()}
                        </button>
                      </td>
                      <td className="px-4 py-3.5 text-gray-700 max-w-[150px] truncate">
                        {ticket.resourceLocation}
                      </td>
                      <td className="px-4 py-3.5 text-gray-700">{ticket.category}</td>
                      <td className="px-4 py-3.5">
                        <PriorityBadge priority={ticket.priority} />
                      </td>
                      <td className="px-4 py-3.5">
                        <StatusBadge status={ticket.status} />
                      </td>
                      <td className="px-4 py-3.5">
                        {ticket.assignedToName ? (
                          <span className="text-gray-700">{ticket.assignedToName}</span>
                        ) : (
                          <span className="text-gray-400 italic">Unassigned</span>
                        )}
                      </td>
                      <td className="px-4 py-3.5 text-gray-500 whitespace-nowrap">
                        {formatDate(ticket.createdAt)}
                      </td>
                      <td className="px-4 py-3.5">
                        <TimeElapsedBadge createdAt={ticket.createdAt} />
                      </td>
                      <td className="px-4 py-3.5">
                        <button
                          onClick={() => navigate(`/admin/maintenance/ticket/${ticket.id}`)}
                          className="inline-flex items-center gap-1.5 border border-gray-200 text-gray-600 px-3 py-1.5 rounded-lg text-xs font-medium hover:bg-gray-100 hover:border-gray-300 transition-colors whitespace-nowrap"
                        >
                          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                              d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                              d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          </svg>
                          Manage
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Sidebar Stats */}
        <div className="w-60 flex-shrink-0 space-y-4">
          <StatCard
            label="Avg Resolution Time"
            value={`${avgH}h`}
            sub="Last 30 days"
            color="text-blue-600"
            iconColor="bg-blue-100"
            icon={
              <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <circle cx="12" cy="12" r="10" strokeWidth="2" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6l4 2" />
              </svg>
            }
          />
          <StatCard
            label="Open Tickets"
            value={openCount}
            sub="Awaiting assignment"
            color="text-indigo-600"
            iconColor="bg-indigo-100"
            icon={
              <svg className="w-4 h-4 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
            }
          />
          <StatCard
            label="High Priority"
            value={highCount}
            sub="Requires immediate attention"
            color="text-red-600"
            iconColor="bg-red-100"
            icon={
              <svg className="w-4 h-4 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            }
          />
        </div>
      </div>
    </div>
  );
}

function FilterSelect({ label, value, options, onChange }) {
  return (
    <div>
      <label className="text-xs text-gray-400 font-medium mb-1 block">{label}</label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#1e3a5f]/30 bg-white"
      >
        {options.map((o) => (
          <option key={o} value={o}>{o.replace(/_/g, " ")}</option>
        ))}
      </select>
    </div>
  );
}

function StatCard({ label, value, sub, color, iconColor, icon }) {
  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-5">
      <div className="flex items-center gap-2 mb-2">
        <div className={`w-7 h-7 ${iconColor} rounded-lg flex items-center justify-center`}>
          {icon}
        </div>
        <p className="text-xs font-semibold text-gray-500">{label}</p>
      </div>
      <p className={`text-3xl font-bold ${color}`}>{value}</p>
      <p className="text-xs text-gray-400 mt-0.5">{sub}</p>
    </div>
  );
}
