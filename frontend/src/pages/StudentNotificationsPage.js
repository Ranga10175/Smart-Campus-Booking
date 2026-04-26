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
      <div className="page-container">
        <h2>My Notifications</h2>
        <p>Please sign in to view your student notifications.</p>
      </div>
    );
  }

  return (
    <div className="page-container">
      <h2>My Notifications</h2>

      <div className="card notification-intro-card">
        <div className="notification-intro-copy">
          <h3>{currentUserName}&apos;s notification center</h3>
          <p>
            Booking notifications are live from the backend. Ticket status updates and ticket comment
            notifications are currently demo data until ticket CRUD is completed.
          </p>
        </div>
        <Link to="/my-bookings" className="inline-link-button">
          Open my bookings
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
        emptyMessage="Your booking approvals, rejections, ticket status updates, and ticket comments will appear here."
        audienceLabel="Student side"
      />
    </div>
  );
}

export default StudentNotificationsPage;
