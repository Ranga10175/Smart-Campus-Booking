import React from "react";
import { Link } from "react-router-dom";

const SOURCE_LABELS = {
    BOOKING: "Booking System",
    TICKET: "Support Desk",
    COMMENT: "User Interaction",
};

const CATEGORY_LABELS = {
    BOOKING_CREATED: "New Request",
    BOOKING_APPROVED: "Approved",
    BOOKING_REJECTED: "Declined",
    BOOKING_CANCELLED: "Withdrawn",
    TICKET_STATUS_CHANGED: "Update",
    TICKET_COMMENT_ADDED: "Message",
};

const ICONS = {
    SUCCESS: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" />
        </svg>
    ),
    ERROR: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" />
        </svg>
    ),
    INFO: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
    ),
    WARNING: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
    ),
};

function formatNotificationTime(createdAt) {
    if (!createdAt) return "Just now";
    const created = new Date(createdAt);
    const diffInMinutes = Math.max(1, Math.round((Date.now() - created.getTime()) / 60000));

    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    const diffInHours = Math.round(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours}h ago`;
    const diffInDays = Math.round(diffInHours / 24);
    if (diffInDays < 7) return `${diffInDays}d ago`;
    return created.toLocaleDateString();
}

function getCategoryConfig(category) {
    switch (category) {
        case "BOOKING_APPROVED":
            return { color: "emerald", icon: ICONS.SUCCESS };
        case "BOOKING_REJECTED":
            return { color: "rose", icon: ICONS.ERROR };
        case "BOOKING_CREATED":
            return { color: "blue", icon: ICONS.INFO };
        case "BOOKING_CANCELLED":
            return { color: "amber", icon: ICONS.WARNING };
        case "TICKET_STATUS_CHANGED":
            return { color: "indigo", icon: ICONS.INFO };
        case "TICKET_COMMENT_ADDED":
            return { color: "violet", icon: ICONS.INFO };
        default:
            return { color: "slate", icon: ICONS.INFO };
    }
}

function NotificationPanel({
    notifications,
    loading,
    error,
    onRefresh,
    onMarkAllRead,
    onMarkRead,
    onDelete,
    emptyMessage,
    audienceLabel,
}) {
    const unreadCount = notifications.filter((n) => !n.read).length;
    const demoCount = notifications.filter((n) => n.demo).length;

    return (
        <div className="space-y-8 animate-in fade-in duration-700">
            {/* Stats Header */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                <div className="relative group overflow-hidden bg-white/40 backdrop-blur-xl border border-white/60 p-6 rounded-[2rem] shadow-sm transition-all hover:shadow-xl hover:shadow-blue-500/5">
                    <div className="relative z-10 flex flex-col items-start text-left">
                        <div className="p-3 rounded-2xl bg-blue-500/10 text-blue-600 mb-4 group-hover:scale-110 transition-transform">
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                            </svg>
                        </div>
                        <span className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-1">{audienceLabel}</span>
                        <div className="flex items-baseline gap-2">
                            <span className="text-4xl font-black text-slate-900 leading-tight">{notifications.length}</span>
                            <span className="text-sm font-medium text-slate-500">Total</span>
                        </div>
                    </div>
                </div>

                <div className="relative group overflow-hidden bg-white/40 backdrop-blur-xl border border-white/60 p-6 rounded-[2rem] shadow-sm transition-all hover:shadow-xl hover:shadow-amber-500/5">
                    <div className="relative z-10 flex flex-col items-start text-left">
                        <div className="p-3 rounded-2xl bg-amber-500/10 text-amber-600 mb-4 group-hover:scale-110 transition-transform">
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </div>
                        <span className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-1">Attention Required</span>
                        <div className="flex items-baseline gap-2">
                            <span className="text-4xl font-black text-slate-900 leading-tight">{unreadCount}</span>
                            <span className="text-sm font-medium text-slate-500">Unread</span>
                        </div>
                    </div>
                </div>

                <div className="relative group overflow-hidden bg-white/40 backdrop-blur-xl border border-white/60 p-6 rounded-[2rem] shadow-sm transition-all hover:shadow-xl hover:shadow-indigo-500/5 text-left">
                    <div className="relative z-10 flex flex-col items-start">
                        <div className="p-3 rounded-2xl bg-indigo-500/10 text-indigo-600 mb-4 group-hover:scale-110 transition-transform">
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                            </svg>
                        </div>
                        <span className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-1">Sandbox Data</span>
                        <div className="flex items-baseline gap-2">
                            <span className="text-4xl font-black text-slate-900 leading-tight">{demoCount}</span>
                            <span className="text-sm font-medium text-slate-500">Demo</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Actions Bar */}
            <div className="flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center gap-2 px-4 py-2 bg-slate-100/50 backdrop-blur-sm rounded-full border border-slate-200">
                    <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></div>
                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-tighter">Live Updates Enabled</span>
                </div>
                <div className="flex items-center gap-3">
                    <button 
                        onClick={onRefresh}
                        disabled={loading}
                        className="p-3 rounded-2xl bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 transition-all shadow-sm active:scale-95 disabled:opacity-50"
                        title="Refresh notifications"
                    >
                        <svg className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                        </svg>
                    </button>
                    <button
                        onClick={onMarkAllRead}
                        disabled={loading || notifications.length === 0 || unreadCount === 0}
                        className="px-6 py-3 rounded-2xl bg-slate-900 text-white font-bold text-sm shadow-xl shadow-slate-900/20 hover:bg-slate-800 transition-all active:scale-95 disabled:opacity-50 disabled:grayscale"
                    >
                        Mark all as read
                    </button>
                </div>
            </div>

            {/* Error Message */}
            {error && (
                <div className="bg-rose-50/50 backdrop-blur-md border border-rose-200/50 rounded-[2rem] p-6 text-rose-800 flex items-center gap-4 text-left">
                    <div className="p-2 bg-rose-100 rounded-xl text-rose-600">
                        {ICONS.WARNING}
                    </div>
                    <div>
                        <h3 className="font-bold text-sm">System Update Interrupted</h3>
                        <p className="text-xs opacity-70">{error}</p>
                    </div>
                </div>
            )}

            {/* Empty State */}
            {!error && notifications.length === 0 && !loading && (
                <div className="bg-white/40 backdrop-blur-md border border-dashed border-slate-200 rounded-[3rem] p-20 text-center flex flex-col items-center">
                    <div className="relative mb-8">
                        <div className="absolute inset-0 bg-blue-100 blur-3xl rounded-full opacity-50"></div>
                        <div className="relative w-20 h-20 bg-gradient-to-tr from-slate-50 to-white rounded-3xl shadow-lg border border-white flex items-center justify-center">
                            <svg className="w-10 h-10 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                            </svg>
                        </div>
                    </div>
                    <h3 className="text-2xl font-black text-slate-900 mb-3 tracking-tight">All Caught Up!</h3>
                    <p className="text-slate-500 max-w-sm text-sm leading-relaxed font-medium">{emptyMessage}</p>
                </div>
            )}

            {/* Notifications List */}
            <div className="space-y-4">
                {notifications.map((notification) => {
                    const config = getCategoryConfig(notification.category);
                    return (
                        <div
                            key={notification.id}
                            className={`group relative overflow-hidden bg-white/70 backdrop-blur-md border rounded-[2rem] p-6 transition-all duration-500 hover:shadow-2xl hover:shadow-slate-200/50 hover:-translate-y-1 ${
                                notification.read ? "border-slate-100 opacity-90" : "border-blue-200 shadow-xl shadow-blue-500/5"
                            }`}
                        >
                            {!notification.read && (
                                <div className="absolute top-0 left-0 w-1 h-full bg-blue-600"></div>
                            )}
                            
                            <div className="flex flex-col md:flex-row md:items-start gap-6">
                                {/* Icon Side */}
                                <div className={`flex-shrink-0 w-12 h-12 rounded-2xl flex items-center justify-center transition-colors duration-300 ${
                                    notification.read ? 'bg-slate-100 text-slate-400' : `bg-${config.color}-500/10 text-${config.color}-600`
                                }`}>
                                    {config.icon}
                                </div>

                                {/* Content Side */}
                                <div className="flex-grow space-y-4 text-left">
                                    <div className="flex flex-wrap items-center justify-between gap-4">
                                        <div className="flex flex-wrap gap-2">
                                            <span className={`text-[9px] font-black uppercase tracking-[0.15em] px-3 py-1 rounded-full ${
                                                notification.read ? 'bg-slate-100 text-slate-500' : `bg-${config.color}-100 text-${config.color}-700`
                                            }`}>
                                                {CATEGORY_LABELS[notification.category] || notification.category}
                                            </span>
                                            <span className="text-[9px] font-black uppercase tracking-[0.15em] px-3 py-1 rounded-full bg-slate-900/5 text-slate-500">
                                                {SOURCE_LABELS[notification.source] || notification.source}
                                            </span>
                                            {notification.demo && (
                                                <span className="text-[9px] font-black uppercase tracking-[0.15em] px-3 py-1 rounded-full bg-amber-100 text-amber-700">Sandbox</span>
                                            )}
                                        </div>
                                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{formatNotificationTime(notification.createdAt)}</span>
                                    </div>

                                    <div className="space-y-1">
                                        <h3 className={`text-lg font-extrabold tracking-tight ${notification.read ? "text-slate-600" : "text-slate-900"}`}>
                                            {notification.title}
                                        </h3>
                                        <p className="text-slate-500 text-sm leading-relaxed font-medium">
                                            {notification.message}
                                        </p>
                                    </div>

                                    <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-slate-50">
                                        <div className="flex items-center gap-4">
                                            {notification.relatedId && (
                                                <div className="flex items-center gap-1.5 px-2.5 py-1 bg-slate-50 rounded-lg text-[10px] font-bold text-slate-400 border border-slate-100">
                                                    <span className="opacity-50">Ref</span>
                                                    <span>{notification.relatedId}</span>
                                                </div>
                                            )}
                                            <div className="flex items-center gap-1.5">
                                                <div className={`w-1.5 h-1.5 rounded-full ${notification.read ? 'bg-emerald-500' : 'bg-amber-500'}`}></div>
                                                <span className={`text-[10px] font-black uppercase tracking-widest ${notification.read ? "text-emerald-600" : "text-amber-600"}`}>
                                                    {notification.read ? "Viewed" : "Unread"}
                                                </span>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-2">
                                            {notification.actionUrl && (
                                                <Link
                                                    to={notification.actionUrl}
                                                    className="px-4 py-2 rounded-xl bg-slate-900 text-white font-bold text-[10px] uppercase tracking-widest shadow-lg shadow-slate-900/10 hover:bg-slate-800 transition-all active:scale-95 flex items-center gap-2"
                                                >
                                                    <span>View</span>
                                                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                                                    </svg>
                                                </Link>
                                            )}
                                            {!notification.read && (
                                                <button
                                                    onClick={() => onMarkRead(notification.id)}
                                                    className="px-4 py-2 rounded-xl bg-blue-600 text-white font-bold text-[10px] uppercase tracking-widest shadow-lg shadow-blue-600/20 hover:bg-blue-700 transition-all active:scale-95"
                                                >
                                                    Mark Read
                                                </button>
                                            )}
                                            {onDelete && (
                                                <button
                                                    onClick={() => onDelete(notification.id)}
                                                    className="p-2 rounded-xl text-slate-300 hover:text-rose-600 hover:bg-rose-50 transition-all active:scale-95"
                                                    title="Remove notification"
                                                >
                                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                    </svg>
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

export default NotificationPanel;

