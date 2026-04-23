import React, { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import NotificationPanel from "../components/NotificationPanel";
import {
    deleteStudentNotification,
    getStudentNotifications,
    markAllStudentNotificationsAsRead,
    markNotificationAsRead,
} from "../services/notificationService";

function StudentNotificationsPage() {
    const currentUserId = localStorage.getItem("currentUserId") || "";
    const currentUserName = localStorage.getItem("currentUserName") || "Student";
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const loadNotifications = useCallback(async () => {
        if (!currentUserId) {
            setNotifications([]);
            return;
        }

        setLoading(true);
        setError("");

        try {
            const response = await getStudentNotifications(currentUserId);
            setNotifications(response.data);
        } catch (err) {
            console.error(err);
            setError("Student notifications could not be loaded. Please check the backend service.");
        } finally {
            setLoading(false);
        }
    }, [currentUserId]);

    useEffect(() => {
        loadNotifications();
    }, [loadNotifications]);

    const handleMarkRead = async (notificationId) => {
        try {
            await markNotificationAsRead(notificationId);
            loadNotifications();
        } catch (err) {
            console.error(err);
            setError("Unable to update this notification right now.");
        }
    };

    const handleMarkAllRead = async () => {
        try {
            await markAllStudentNotificationsAsRead(currentUserId);
            loadNotifications();
        } catch (err) {
            console.error(err);
            setError("Unable to mark student notifications as read right now.");
        }
    };

    const handleDelete = async (notificationId) => {
        try {
            await deleteStudentNotification(currentUserId, notificationId);
            loadNotifications();
        } catch (err) {
            console.error(err);
            setError("Unable to delete this student notification right now.");
        }
    };

    if (!currentUserId) {
        return (
            <div className="min-h-[60vh] flex flex-col items-center justify-center p-8 text-center animate-in fade-in zoom-in duration-700">
                <div className="bg-white/40 backdrop-blur-2xl border border-white/60 rounded-[3rem] p-12 shadow-2xl shadow-blue-500/10 max-w-lg w-full">
                    <div className="w-20 h-20 bg-gradient-to-tr from-blue-600 to-indigo-600 rounded-[2rem] flex items-center justify-center mx-auto mb-8 shadow-xl shadow-blue-600/30">
                        <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                        </svg>
                    </div>
                    <h2 className="text-3xl font-black text-slate-900 mb-4 tracking-tight">Access Restricted</h2>
                    <p className="text-slate-500 mb-10 text-lg font-medium leading-relaxed">Please sign in to your student account to view your personalized notifications and alerts.</p>
                    <Link to="/login" className="inline-flex items-center justify-center w-full py-5 rounded-[2rem] bg-slate-900 text-white font-bold shadow-2xl hover:bg-slate-800 transition-all uppercase tracking-widest text-sm active:scale-95">
                        Continue to Login
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-6xl mx-auto space-y-12 pb-24 text-left animate-in fade-in slide-in-from-bottom-4 duration-1000">
            {/* Header Section */}
            <div className="relative group rounded-[3rem] overflow-hidden bg-slate-950 p-10 md:p-16 text-white shadow-2xl shadow-slate-950/20">
                <div className="absolute top-0 right-0 -mr-32 -mt-32 w-96 h-96 bg-blue-600/30 rounded-full blur-[120px] animate-pulse"></div>
                <div className="absolute bottom-0 left-0 -ml-32 -mb-32 w-96 h-96 bg-indigo-600/20 rounded-full blur-[100px]"></div>
                
                <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-12">
                    <div className="max-w-2xl space-y-6">
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/10">
                            <span className="w-2 h-2 rounded-full bg-blue-400"></span>
                            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-blue-100">Live Campus Feed</span>
                        </div>
                        <h1 className="text-4xl md:text-6xl font-black tracking-tight leading-[1.1]">
                            Notification <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-300">Center</span>
                        </h1>
                        <p className="text-blue-100/70 text-lg md:text-xl font-medium leading-relaxed max-w-xl">
                            Hey {currentUserName}, stay updated with your latest booking approvals, campus announcements, and support ticket activities.
                        </p>
                    </div>
                    
                    <div className="flex-shrink-0">
                        <Link to="/my-bookings" className="group/btn inline-flex items-center gap-4 px-8 py-5 rounded-[2rem] bg-white text-slate-950 font-black shadow-2xl transition-all hover:bg-blue-50 active:scale-95">
                            <span className="text-sm uppercase tracking-widest">My Bookings</span>
                            <div className="w-10 h-10 rounded-2xl bg-slate-100 flex items-center justify-center group-hover/btn:bg-blue-600 group-hover/btn:text-white transition-colors">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                                </svg>
                            </div>
                        </Link>
                    </div>
                </div>
            </div>

            {/* Notifications Main Panel */}
            <div className="space-y-8">
                <div className="flex items-center gap-4 ml-2">
                    <div className="h-8 w-1.5 bg-blue-600 rounded-full shadow-[0_0_15px_rgba(37,99,235,0.4)]"></div>
                    <h2 className="text-2xl font-black text-slate-900 tracking-tight">Recent Activity</h2>
                </div>

                <NotificationPanel
                    notifications={notifications}
                    loading={loading}
                    error={error}
                    onRefresh={loadNotifications}
                    onMarkAllRead={handleMarkAllRead}
                    onMarkRead={handleMarkRead}
                    onDelete={handleDelete}
                    emptyMessage="Your inbox is empty. New booking approvals, rejections, and ticket updates will appear here."
                    audienceLabel="Student Portal"
                />
            </div>
        </div>
    );
}

export default StudentNotificationsPage;

