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
  if (!value) {
    return "Just now";
  }

  return new Date(value).toLocaleString();
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

    if (!editingNotification) {
      return;
    }

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
    <div className="page-container">
      <h2>Admin Notifications</h2>

      <div className="card notification-intro-card">
        <div className="notification-intro-copy">
          <h3>Admin desk notification center</h3>
          <p>
            Booking request notifications are connected to the live booking flow. Ticket status and
            comment notifications are seeded demo entries until the ticket CRUD module is finished.
          </p>
        </div>
        <Link to="/admin-bookings" className="inline-link-button">
          Open admin desk
        </Link>
      </div>

      <NotificationPanel
        notifications={notifications}
        loading={loading}
        error={error}
        onRefresh={loadNotifications}
        onMarkAllRead={handleMarkAllRead}
        onMarkRead={handleMarkRead}
        onDelete={handleDelete}
        emptyMessage="New booking requests, booking decisions, ticket status changes, and ticket comments will appear here for the admin desk."
        audienceLabel="Admin side"
      />

      <div className="card notification-admin-section">
        <div className="notification-intro-copy">
          <h3>All student notifications</h3>
          <p>
            Admin can review every student notification here and update the title, message, or read status.
          </p>
        </div>
      </div>

      {studentNotifications.length === 0 ? (
        <div className="card notification-feedback">
          <h3>No student notifications yet</h3>
          <p>Student-side booking and ticket notifications will appear here for admin review.</p>
        </div>
      ) : (
        <div className="notification-list">
          {studentNotifications.map((notification) => (
            <div
              key={notification.id}
              className={`card notification-item ${notification.read ? "notification-read" : "notification-unread"}`}
            >
              <div className="notification-item-top">
                <div className="notification-item-copy">
                  <div className="notification-item-badges">
                    <span className="badge badge-neutral">Student {notification.recipientId}</span>
                    {notification.demo && <span className="badge badge-warning">Demo</span>}
                  </div>
                  <h3>{notification.title}</h3>
                  <span className="notification-time">
                    Created {formatTimestamp(notification.createdAt)}
                  </span>
                </div>

                <button
                  type="button"
                  className="notification-secondary-btn"
                  onClick={() => openEditModal(notification)}
                >
                  Edit notification
                </button>
              </div>

              <p className="notification-message">{notification.message}</p>

              <div className="notification-item-footer">
                <div className="notification-meta-row">
                  <span className="notification-reference">Recipient: {notification.recipientId}</span>
                  {notification.updatedBy && (
                    <span className="notification-reference">
                      Updated by {notification.updatedBy} at {formatTimestamp(notification.updatedAt)}
                    </span>
                  )}
                </div>
                <span className={`notification-state ${notification.read ? "is-read" : "is-unread"}`}>
                  {notification.read ? "Read" : "Unread"}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {editingNotification && (
        <div style={{ position: "fixed", top: 0, left: 0, width: "100%", height: "100%", background: "rgba(0,0,0,0.3)", backdropFilter: "blur(6px)", display: "flex", justifyContent: "center", alignItems: "center", zIndex: 1000, animation: "fadeInUp 0.2s ease" }}>
          <div className="card" style={{ width: "min(560px, 92vw)", textAlign: "left", padding: "2rem", margin: "0" }}>
            <h3 style={{ fontFamily: "'Sora', sans-serif", fontSize: "1.35rem", color: "var(--navy)", marginBottom: "0.75rem" }}>
              Update Student Notification
            </h3>
            <p style={{ color: "var(--text-mid)", marginBottom: "1.5rem", fontSize: "0.95rem" }}>
              Update the notification for student <strong>{editingNotification.recipientId}</strong>.
            </p>

            <form className="booking-form" onSubmit={handleUpdateStudentNotification}>
              <div>
                <label style={{ fontSize: "0.85rem", fontWeight: "600", color: "var(--navy-mid)", marginBottom: "6px", display: "block" }}>
                  Notification title
                </label>
                <input
                  type="text"
                  value={editForm.title}
                  onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
                  required
                />
              </div>

              <div>
                <label style={{ fontSize: "0.85rem", fontWeight: "600", color: "var(--navy-mid)", marginBottom: "6px", display: "block" }}>
                  Notification message
                </label>
                <textarea
                  value={editForm.message}
                  onChange={(e) => setEditForm({ ...editForm, message: e.target.value })}
                  rows={5}
                  required
                />
              </div>

              <label className="notification-checkbox-row">
                <input
                  type="checkbox"
                  checked={editForm.read}
                  onChange={(e) => setEditForm({ ...editForm, read: e.target.checked })}
                />
                <span>Mark this student notification as read</span>
              </label>

              <div style={{ display: "flex", gap: "10px", justifyContent: "flex-end" }}>
                <button
                  type="button"
                  className="notification-secondary-btn"
                  onClick={() => setEditingNotification(null)}
                >
                  Cancel
                </button>
                <button type="submit" style={{ width: "auto", marginTop: 0 }}>
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
