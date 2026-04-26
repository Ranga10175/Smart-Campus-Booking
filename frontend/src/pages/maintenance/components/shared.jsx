// Frontend: src/features/maintenance/components/shared.jsx
// Shared UI primitives for the Maintenance module

import React from "react";

const API_ORIGIN = (process.env.REACT_APP_API_BASE_URL || "http://localhost:8091/api").replace(/\/api\/?$/, "");
const resolveImageUrl = (url) => (url && url.startsWith("/") ? `${API_ORIGIN}${url}` : url);

// ─── Priority Badge ────────────────────────────────────────────────────────────
export function PriorityBadge({ priority }) {
  const map = {
    HIGH: "bg-red-100 text-red-700 border border-red-200",
    MEDIUM: "bg-yellow-100 text-yellow-700 border border-yellow-200",
    LOW: "bg-green-100 text-green-700 border border-green-200",
  };
  const cls = map[priority?.toUpperCase()] || "bg-gray-100 text-gray-600 border border-gray-200";
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${cls}`}>
      {priority}
    </span>
  );
}

// ─── Status Badge ─────────────────────────────────────────────────────────────
export function StatusBadge({ status }) {
  const map = {
    OPEN: "bg-blue-100 text-blue-700 border border-blue-200",
    ASSIGNED: "bg-purple-100 text-purple-700 border border-purple-200",
    IN_PROGRESS: "bg-orange-100 text-orange-700 border border-orange-200",
    RESOLVED: "bg-green-100 text-green-700 border border-green-200",
    REJECTED: "bg-red-100 text-red-700 border border-red-200",
    CLOSED: "bg-gray-100 text-gray-600 border border-gray-200",
  };
  const normalized = status?.toUpperCase().replace(/ /g, "_");
  const cls = map[normalized] || "bg-gray-100 text-gray-600";
  const label = status?.replace(/_/g, " ");
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${cls}`}>
      {label}
    </span>
  );
}

// ─── Time Elapsed Badge ───────────────────────────────────────────────────────
export function TimeElapsedBadge({ createdAt }) {
  const [elapsed, setElapsed] = React.useState("");

  React.useEffect(() => {
    function calc() {
      const now = Date.now();
      const created = new Date(createdAt).getTime();
      const diffMs = now - created;
      const diffH = Math.floor(diffMs / 3600000);
      const diffM = Math.floor((diffMs % 3600000) / 60000);
      if (diffH >= 24) {
        const d = Math.floor(diffH / 24);
        setElapsed(`${d}d ${diffH % 24}h`);
      } else {
        setElapsed(`${diffH}h ${diffM}m`);
      }
    }
    calc();
    const id = setInterval(calc, 60000);
    return () => clearInterval(id);
  }, [createdAt]);

  const hours = Math.floor((Date.now() - new Date(createdAt).getTime()) / 3600000);
  const colorCls =
    hours > 96 ? "text-red-600" : hours > 48 ? "text-orange-500" : "text-gray-700";

  return <span className={`font-semibold text-sm ${colorCls}`}>{elapsed}</span>;
}

// ─── Top Time Elapsed Card ────────────────────────────────────────────────────
export function TimeElapsedCard({ createdAt }) {
  const [elapsed, setElapsed] = React.useState("");

  React.useEffect(() => {
    function calc() {
      const diffH = Math.floor((Date.now() - new Date(createdAt).getTime()) / 3600000);
      setElapsed(`${diffH}h`);
    }
    calc();
    const id = setInterval(calc, 60000);
    return () => clearInterval(id);
  }, [createdAt]);

  return (
    <div className="bg-yellow-50 border border-yellow-200 rounded-xl px-5 py-3 flex items-center gap-3">
      <svg className="w-5 h-5 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <circle cx="12" cy="12" r="10" strokeWidth="2" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6l4 2" />
      </svg>
      <div>
        <p className="text-xs text-yellow-600 font-medium uppercase tracking-wide">Time Elapsed</p>
        <p className="text-2xl font-bold text-yellow-700">{elapsed}</p>
      </div>
    </div>
  );
}

// ─── Spinner ──────────────────────────────────────────────────────────────────
export function Spinner() {
  return (
    <div className="flex items-center justify-center py-20">
      <div className="w-8 h-8 border-4 border-[#1e3a5f] border-t-transparent rounded-full animate-spin" />
    </div>
  );
}

// ─── Alert ────────────────────────────────────────────────────────────────────
export function Alert({ type = "error", message, onClose }) {
  if (!message) return null;
  const map = {
    error: "bg-red-50 border-red-200 text-red-700",
    success: "bg-green-50 border-green-200 text-green-700",
    info: "bg-blue-50 border-blue-200 text-blue-700",
  };
  return (
    <div className={`border rounded-lg px-4 py-3 flex items-start justify-between gap-3 ${map[type]}`}>
      <span className="text-sm font-medium">{message}</span>
      {onClose && (
        <button onClick={onClose} className="opacity-60 hover:opacity-100 text-lg leading-none">&times;</button>
      )}
    </div>
  );
}

// ─── Empty State ──────────────────────────────────────────────────────────────
export function EmptyState({ title, description }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
        <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      </div>
      <h3 className="text-base font-semibold text-gray-700">{title}</h3>
      <p className="text-sm text-gray-400 mt-1">{description}</p>
    </div>
  );
}

// ─── Comment Thread ───────────────────────────────────────────────────────────
export function CommentThread({ comments = [], onPost, currentUserName }) {
  const [text, setText] = React.useState("");
  const [posting, setPosting] = React.useState(false);

  async function handlePost() {
    if (!text.trim()) return;
    setPosting(true);
    await onPost(text.trim());
    setText("");
    setPosting(false);
  }

  const roleColor = {
    "System Administrator": "text-purple-700",
    Technician: "text-blue-700",
    Student: "text-gray-700",
    Admin: "text-purple-700",
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6">
      <h3 className="text-base font-semibold text-gray-800 flex items-center gap-2 mb-5">
        <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
            d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
        </svg>
        Comments & Updates
      </h3>
      <div className="space-y-4 mb-6">
        {comments.length === 0 && (
          <p className="text-sm text-gray-400 italic">No comments yet.</p>
        )}
        {comments.map((c, i) => (
          <div key={i} className="border-l-2 border-[#1e3a5f]/20 pl-4">
            <div className="flex items-center justify-between mb-1">
              <span className="font-semibold text-sm text-gray-800">
                {c.authorName}{" "}
                <span className={`font-normal text-xs ${roleColor[c.authorRole] || "text-gray-500"}`}>
                  ({c.authorRole})
                </span>
              </span>
              <span className="text-xs text-gray-400">
                {c.createdAt ? new Date(c.createdAt).toLocaleString("en-US", {
                  month: "short", day: "numeric", hour: "numeric", minute: "2-digit"
                }) : ""}
              </span>
            </div>
            <p className="text-sm text-gray-600">{c.content}</p>
          </div>
        ))}
      </div>
      {onPost && (
        <div className="space-y-3">
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            rows={3}
            placeholder="Add a comment or update..."
            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1e3a5f]/30 resize-none"
          />
          <button
            onClick={handlePost}
            disabled={posting || !text.trim()}
            className="bg-[#1e3a5f] text-white px-5 py-2 rounded-lg text-sm font-medium hover:bg-[#162d4a] disabled:opacity-50 transition-colors"
          >
            {posting ? "Posting..." : "Post Comment"}
          </button>
        </div>
      )}
    </div>
  );
}

// ─── Image Gallery ────────────────────────────────────────────────────────────
export function ImageGallery({ images = [] }) {
  const [selected, setSelected] = React.useState(null);
  if (!images.length) return null;

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6">
      <h3 className="text-base font-semibold text-gray-800 mb-4">Attachments</h3>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        {images.map((url, i) => (
          <img
            key={i}
            src={resolveImageUrl(url)}
            alt={`attachment-${i}`}
            className="w-full h-40 object-cover rounded-lg cursor-pointer hover:opacity-90 transition-opacity"
            onClick={() => setSelected(resolveImageUrl(url))}
          />
        ))}
      </div>
      {selected && (
        <div
          className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4"
          onClick={() => setSelected(null)}
        >
          <img src={selected} className="max-h-[85vh] max-w-full rounded-lg shadow-2xl" alt="preview" />
        </div>
      )}
    </div>
  );
}

// ─── Progress Bar ─────────────────────────────────────────────────────────────
export function ProgressBar({ value, onChange, readOnly = false }) {
  const pct = Math.min(100, Math.max(0, value || 0));
  const color = pct >= 80 ? "#22c55e" : pct >= 40 ? "#f97316" : "#3b82f6";

  return (
    <div className="space-y-2">
      <div className="flex justify-between text-sm">
        <span className="text-gray-600 font-medium">Completion</span>
        <span className="font-bold" style={{ color }}>{pct}%</span>
      </div>
      {readOnly ? (
        <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
          <div
            className="h-full rounded-full transition-all duration-500"
            style={{ width: `${pct}%`, backgroundColor: color }}
          />
        </div>
      ) : (
        <input
          type="range"
          min="0"
          max="100"
          value={pct}
          onChange={(e) => onChange?.(Number(e.target.value))}
          className="w-full h-2 rounded-full cursor-pointer accent-[#1e3a5f]"
        />
      )}
      {!readOnly && (
        <p className="text-xs text-gray-400">Update progress as you work on this ticket</p>
      )}
    </div>
  );
}

// ─── Ticket Info Grid ─────────────────────────────────────────────────────────
export function TicketInfoGrid({ ticket }) {
  const fields = [
    { icon: "📍", label: "Resource/Location", value: ticket.resourceLocation },
    { icon: "🏷️", label: "Category", value: ticket.category },
    {
      icon: "⚡", label: "Priority",
      value: <PriorityBadge priority={ticket.priority} />,
    },
    {
      icon: "📅", label: "Status",
      value: <StatusBadge status={ticket.status} />,
    },
    { icon: "👤", label: "Reported By", value: ticket.reportedByName },
    { icon: "🔧", label: "Assigned To", value: ticket.assignedToName || "Unassigned" },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {fields.map(({ icon, label, value }) => (
        <div key={label}>
          <p className="text-xs text-gray-400 uppercase tracking-wide mb-1">{label}</p>
          <p className="text-sm font-semibold text-gray-800 flex items-center gap-1.5">
            {typeof value === "string" ? value : value}
          </p>
        </div>
      ))}
      {ticket.description && (
        <div className="col-span-2">
          <p className="text-xs text-gray-400 uppercase tracking-wide mb-1">Description</p>
          <p className="text-sm text-gray-700 leading-relaxed">{ticket.description}</p>
        </div>
      )}
    </div>
  );
}
