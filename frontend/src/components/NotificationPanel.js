import React from "react";

const SOURCE_LABELS = {
  BOOKING: "Booking",
  TICKET: "Ticket",
  COMMENT: "Comment",
};

const CATEGORY_LABELS = {
  BOOKING_CREATED: "New Request",
  BOOKING_APPROVED: "Approved",
  BOOKING_REJECTED: "Rejected",
  BOOKING_CANCELLED: "Cancelled",
  TICKET_STATUS_CHANGED: "Status Changed",
  TICKET_COMMENT_ADDED: "New Comment",
};

function formatNotificationTime(createdAt) {
  if (!createdAt) {
    return "Just now";
  }

  const created = new Date(createdAt);
  const diffInMinutes = Math.max(1, Math.round((Date.now() - created.getTime()) / 60000));

  if (diffInMinutes < 60) {
    return `${diffInMinutes} min ago`;
  }

  const diffInHours = Math.round(diffInMinutes / 60);
  if (diffInHours < 24) {
    return `${diffInHours} hour${diffInHours === 1 ? "" : "s"} ago`;
  }

  const diffInDays = Math.round(diffInHours / 24);
  if (diffInDays < 7) {
    return `${diffInDays} day${diffInDays === 1 ? "" : "s"} ago`;
  }

  return created.toLocaleString();
}

function getCategoryBadgeClass(category) {
  switch (category) {
    case "BOOKING_APPROVED":
      return "badge-success";
    case "BOOKING_REJECTED":
      return "badge-danger";
    case "BOOKING_CREATED":
      return "badge-pending";
    case "BOOKING_CANCELLED":
      return "badge-warning";
    default:
      return "badge-neutral";
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
  const unreadCount = notifications.filter((notification) => !notification.read).length;
  const demoCount = notifications.filter((notification) => notification.demo).length;

  return (
    <div className="notification-panel">
      <div className="card notification-summary-card">
        <div className="notification-summary">
          <div className="notification-stat">
            <span className="notification-stat-label">{audienceLabel}</span>
            <strong>{notifications.length}</strong>
            <span>Total notifications</span>
          </div>
          <div className="notification-stat">
            <span className="notification-stat-label">Unread</span>
            <strong>{unreadCount}</strong>
            <span>Waiting for review</span>
          </div>
          <div className="notification-stat">
            <span className="notification-stat-label">Demo ticket data</span>
            <strong>{demoCount}</strong>
            <span>Used until ticket CRUD is ready</span>
          </div>
        </div>

        <div className="notification-toolbar">
          <button type="button" className="refresh-btn" onClick={onRefresh} disabled={loading}>
            {loading ? "Refreshing..." : "Refresh"}
          </button>
          <button
            type="button"
            className="notification-secondary-btn"
            onClick={onMarkAllRead}
            disabled={loading || notifications.length === 0 || unreadCount === 0}
          >
            Mark all as read
          </button>
        </div>
      </div>

      {error && (
        <div className="card notification-feedback notification-feedback-error">
          <h3>Unable to load notifications</h3>
          <p>{error}</p>
        </div>
      )}

      {!error && notifications.length === 0 && !loading && (
        <div className="card notification-feedback">
          <h3>No notifications yet</h3>
          <p>{emptyMessage}</p>
        </div>
      )}

      <div className="notification-list">
        {notifications.map((notification) => (
          <div
            key={notification.id}
            className={`card notification-item ${notification.read ? "notification-read" : "notification-unread"}`}
          >
            <div className="notification-item-top">
              <div className="notification-item-copy">
                <div className="notification-item-badges">
                  <span className={`badge ${getCategoryBadgeClass(notification.category)}`}>
                    {CATEGORY_LABELS[notification.category] || notification.category}
                  </span>
                  <span className="badge badge-neutral">
                    {SOURCE_LABELS[notification.source] || notification.source}
                  </span>
                  {notification.demo && <span className="badge badge-warning">Demo</span>}
                </div>
                <h3>{notification.title}</h3>
                <span className="notification-time">{formatNotificationTime(notification.createdAt)}</span>
              </div>

              {!notification.read && (
                <button
                  type="button"
                  className="notification-secondary-btn"
                  onClick={() => onMarkRead(notification.id)}
                >
                  Mark read
                </button>
              )}
            </div>

            <p className="notification-message">{notification.message}</p>

            <div className="notification-item-footer">
              {notification.relatedId && (
                <span className="notification-reference">Reference: {notification.relatedId}</span>
              )}
              <div className="notification-item-actions">
                <span className={`notification-state ${notification.read ? "is-read" : "is-unread"}`}>
                  {notification.read ? "Read" : "Unread"}
                </span>
                {onDelete && (
                  <button
                    type="button"
                    className="notification-danger-btn"
                    onClick={() => onDelete(notification.id)}
                  >
                    Delete
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default NotificationPanel;
