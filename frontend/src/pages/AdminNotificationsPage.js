import React, { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import NotificationPanel from "../components/NotificationPanel";
import {
    deleteAdminNotification,
    getAdminNotifications,
    getAllStudentNotificationsForAdmin,
    markAllAdminNotificationsAsRead,
    markNotificationAsRead,
    updateStudentNotificationForAdmin,
} from "../services/notificationService";

function formatTimestamp(value) {
    if (!value) return "Just now";
    return new Date(value).toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' });
}

function AdminNotificationsPage() {
    const [notifications, setNotifications] = useState([]);
    const [studentNotifications, setStudentNotifications] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [editingNotification, setEditingNotification] = useState(null);
    const [editForm, setEditForm] = useState({ title: "", message: "", read: false });

    const loadNotifications = useCallback(async () => {
        setLoading(true);
        setError("");

        try {
            const [adminResponse, studentResponse] = await Promise.all([
                getAdminNotifications(),
                getAllStudentNotificationsForAdmin(),
            ]);
            setNotifications(adminResponse.data);
            setStudentNotifications(studentResponse.data);
        } catch (err) {
            console.error(err);
            setError("Admin desk notifications could not be loaded. Please check the backend service.");
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        loadNotifications();
    }, [loadNotifications]);

    const handleMarkRead = async (notificationId) => {
        try {
            await markNotificationAsRead(notificationId);
            loadNotifications();
        } catch (err) {
            console.error(err);
            setError("Unable to update this admin notification right now.");
        }
    };

    const handleMarkAllRead = async () => {
        try {
            await markAllAdminNotificationsAsRead();
            loadNotifications();
        } catch (err) {
            console.error(err);
            setError("Unable to mark admin desk notifications as read right now.");
        }
    };

    const handleDelete = async (notificationId) => {
        try {
            await deleteAdminNotification(notificationId);
            loadNotifications();
        } catch (err) {
            console.error(err);
            setError("Unable to delete this admin notification right now.");
        }
    };

    const openEditModal = (notification) => {
        setEditingNotification(notification);
        setEditForm({
            title: notification.title || "",
            message: notification.message || "",
            read: Boolean(notification.read),
        });
    };

    const handleUpdateStudentNotification = async (e) => {
        e.preventDefault();

        if (!editingNotification) return;

        try {
            await updateStudentNotificationForAdmin(editingNotification.id, editForm);
            setEditingNotification(null);
            loadNotifications();
        } catch (err) {
            console.error(err);
            setError("Unable to update this student notification right now.");
        }
    };

    return (
        <div className="max-w-7xl mx-auto space-y-12 pb-24 text-left animate-in fade-in slide-in-from-bottom-4 duration-1000">
            {/* Header Section */}
            <div className="relative group rounded-[3rem] overflow-hidden bg-slate-900 p-10 md:p-16 text-white shadow-2xl shadow-slate-950/40">
                <div className="absolute top-0 right-0 -mr-32 -mt-32 w-96 h-96 bg-blue-500/20 rounded-full blur-[120px]"></div>
                <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)', backgroundSize: '32px 32px' }}></div>
                
                <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-12">
                    <div className="max-w-2xl space-y-6">
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/10 backdrop-blur-md border border-blue-500/20">
                            <span className="w-2 h-2 rounded-full bg-blue-400"></span>
                            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-blue-200">System Administrator</span>
                        </div>
                        <h1 className="text-4xl md:text-6xl font-black tracking-tight leading-[1.1]">
                            Control <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-300">Panel</span>
                        </h1>
                        <p className="text-slate-400 text-lg md:text-xl font-medium leading-relaxed max-w-xl">
                            Manage system-wide notifications, monitor student alerts, and oversee campus booking activities from a single dashboard.
                        </p>
                    </div>
                    
                    <div className="flex-shrink-0">
                        <Link to="/admin-bookings" className="group/btn inline-flex items-center gap-4 px-8 py-5 rounded-[2rem] bg-white text-slate-950 font-black shadow-2xl transition-all hover:bg-blue-50 active:scale-95">
                            <span className="text-sm uppercase tracking-widest">Admin Desk</span>
                            <div className="w-10 h-10 rounded-2xl bg-slate-100 flex items-center justify-center group-hover/btn:bg-blue-600 group-hover/btn:text-white transition-colors">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                                </svg>
                            </div>
                        </Link>
                    </div>
                </div>
            </div>

            {/* Admin Desk Activity */}
            <div className="space-y-8">
                <div className="flex items-center gap-4 ml-2">
                    <div className="h-8 w-1.5 bg-blue-600 rounded-full shadow-[0_0_15px_rgba(37,99,235,0.4)]"></div>
                    <h2 className="text-2xl font-black text-slate-900 tracking-tight">Desk Activity</h2>
                </div>
                <NotificationPanel
                    notifications={notifications}
                    loading={loading}
                    error={error}
                    onRefresh={loadNotifications}
                    onMarkAllRead={handleMarkAllRead}
                    onMarkRead={handleMarkRead}
                    onDelete={handleDelete}
                    emptyMessage="No desk activity. New booking requests and system alerts will appear here."
                    audienceLabel="Admin Desk"
                />
            </div>

            {/* Student Oversight */}
            <div className="space-y-8 pt-8">
                <div className="flex items-center justify-between gap-6 px-2">
                    <div className="flex items-center gap-4">
                        <div className="h-8 w-1.5 bg-amber-500 rounded-full shadow-[0_0_15px_rgba(245,158,11,0.4)]"></div>
                        <h2 className="text-2xl font-black text-slate-900 tracking-tight">Student Oversight</h2>
                    </div>
                    <span className="px-4 py-1.5 rounded-full bg-slate-100 border border-slate-200 text-[10px] font-black text-slate-500 uppercase tracking-widest">
                        {studentNotifications.length} Broadcasts
                    </span>
                </div>
                
                <div className="bg-gradient-to-tr from-slate-50 to-white border border-slate-200/60 rounded-[2.5rem] p-8 shadow-sm">
                    <p className="text-sm text-slate-500 font-medium leading-relaxed italic flex items-center gap-3">
                        <svg className="w-5 h-5 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        Oversight Mode: You can review and modify any notification sent to students to ensure accuracy and professionalism.
                    </p>
                </div>

                {studentNotifications.length === 0 ? (
                    <div className="bg-white/40 backdrop-blur-md border border-dashed border-slate-200 rounded-[3rem] p-20 text-center flex flex-col items-center">
                        <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center mb-6 border border-slate-100">
                            <svg className="w-8 h-8 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z" />
                            </svg>
                        </div>
                        <h3 className="text-xl font-bold text-slate-900 mb-2">No student activity yet</h3>
                        <p className="text-slate-500 max-w-sm text-sm font-medium mx-auto leading-relaxed">Incoming student notifications will be mirrored here for your review.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {studentNotifications.map((notification) => (
                            <div
                                key={notification.id}
                                className={`group bg-white border rounded-[2.5rem] p-8 transition-all duration-500 hover:shadow-2xl hover:shadow-slate-200/50 hover:-translate-y-1 ${
                                    notification.read ? "border-slate-100 opacity-80" : "border-amber-200 shadow-xl shadow-amber-500/5"
                                }`}
                            >
                                <div className="space-y-6">
                                    <div className="flex items-center justify-between gap-4">
                                        <span className="text-[9px] font-black uppercase tracking-widest px-3 py-1.5 rounded-xl bg-slate-900 text-white shadow-lg shadow-slate-900/10">
                                            ID: {notification.recipientId}
                                        </span>
                                        <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">{formatTimestamp(notification.createdAt)}</span>
                                    </div>

                                    <div className="space-y-2">
                                        <h3 className="text-lg font-black text-slate-900 tracking-tight line-clamp-1">{notification.title}</h3>
                                        <p className="text-slate-500 text-sm font-medium leading-relaxed line-clamp-3">{notification.message}</p>
                                    </div>

                                    <div className="pt-6 border-t border-slate-50 flex items-center justify-between gap-4">
                                        <div className={`flex items-center gap-1.5 px-3 py-1 rounded-full border ${notification.read ? "border-emerald-100 text-emerald-600 bg-emerald-50" : "border-amber-100 text-amber-600 bg-amber-50"}`}>
                                            <div className={`w-1 h-1 rounded-full ${notification.read ? 'bg-emerald-500' : 'bg-amber-500'}`}></div>
                                            <span className="text-[9px] font-black uppercase tracking-widest">{notification.read ? "Viewed" : "Pending"}</span>
                                        </div>
                                        <button
                                            onClick={() => openEditModal(notification)}
                                            className="px-4 py-2 rounded-xl bg-slate-50 text-slate-600 font-bold text-[10px] uppercase tracking-widest border border-slate-100 hover:bg-slate-100 transition-all active:scale-95"
                                        >
                                            Modify
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Edit Modal */}
            {editingNotification && (
                <div className="fixed inset-0 bg-slate-950/40 backdrop-blur-xl flex justify-center items-center z-[100] p-6 animate-in fade-in duration-300">
                    <div className="bg-white rounded-[3rem] w-full max-w-xl overflow-hidden shadow-2xl border border-white/50 animate-in zoom-in-95 duration-300">
                        <div className="bg-slate-900 p-8 md:p-10 text-white relative overflow-hidden">
                            <div className="absolute top-0 right-0 -mr-20 -mt-20 w-48 h-48 bg-blue-500/20 rounded-full blur-3xl"></div>
                            <div className="relative z-10">
                                <h3 className="text-3xl font-black tracking-tight mb-2">Refine Alert</h3>
                                <p className="text-slate-400 font-medium">
                                    Updating notification for student <span className="text-blue-400 font-bold tracking-wider">{editingNotification.recipientId}</span>
                                </p>
                            </div>
                        </div>

                        <form className="p-8 md:p-10 space-y-8" onSubmit={handleUpdateStudentNotification}>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-2">Header Text</label>
                                <input
                                    type="text"
                                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-4 px-6 text-slate-900 focus:bg-white focus:border-blue-500 focus:shadow-2xl focus:shadow-blue-500/10 outline-none transition-all font-bold tracking-tight"
                                    value={editForm.title}
                                    onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
                                    required
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-2">Broadcast Message</label>
                                <textarea
                                    className="w-full bg-slate-50 border border-slate-200 rounded-3xl py-5 px-6 text-slate-900 focus:bg-white focus:border-blue-500 focus:shadow-2xl focus:shadow-blue-500/10 outline-none transition-all font-medium min-h-[160px] leading-relaxed"
                                    value={editForm.message}
                                    onChange={(e) => setEditForm({ ...editForm, message: e.target.value })}
                                    required
                                />
                            </div>

                            <div className="flex items-center gap-4 p-5 bg-slate-50 rounded-2xl border border-slate-100 group cursor-pointer" onClick={() => setEditForm({ ...editForm, read: !editForm.read })}>
                                <div className={`w-6 h-6 rounded-lg flex items-center justify-center transition-all ${editForm.read ? 'bg-blue-600 shadow-lg shadow-blue-600/30' : 'bg-white border border-slate-200'}`}>
                                    {editForm.read && <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" /></svg>}
                                </div>
                                <label className="text-xs font-black text-slate-700 uppercase tracking-widest cursor-pointer select-none">
                                    Set as viewed by student
                                </label>
                            </div>

                            <div className="flex gap-4 pt-4">
                                <button
                                    type="button"
                                    className="flex-1 py-5 rounded-[2rem] text-slate-400 font-black text-xs uppercase tracking-[0.2em] hover:bg-slate-50 transition-all"
                                    onClick={() => setEditingNotification(null)}
                                >
                                    Discard
                                </button>
                                <button 
                                    type="submit" 
                                    className="flex-1 py-5 rounded-[2rem] bg-slate-900 text-white font-black text-xs uppercase tracking-[0.2em] shadow-2xl shadow-slate-900/20 hover:bg-slate-800 transition-all active:scale-95"
                                >
                                    Save Changes
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}

export default AdminNotificationsPage;

