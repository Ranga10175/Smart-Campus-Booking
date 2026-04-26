package com.smartcampus.backend.service;

import com.smartcampus.backend.dto.NotificationUpdateRequest;
import com.smartcampus.backend.model.Booking;
import com.smartcampus.backend.model.Notification;
import com.smartcampus.backend.repository.NotificationRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.Comparator;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.UUID;
import java.util.concurrent.CopyOnWriteArrayList;

@Service
public class NotificationService {

    private static final Logger logger = LoggerFactory.getLogger(NotificationService.class);
    private static final String ADMIN_TYPE = "ADMIN_DESK";
    private static final String ADMIN_ID = "ADMIN_DESK";
    private static final String STUDENT_TYPE = "STUDENT";

    private final NotificationRepository notificationRepository;
    private final List<Notification> fallbackNotifications = new CopyOnWriteArrayList<>();
    private volatile boolean useFallbackStorage = false;

    public NotificationService(NotificationRepository notificationRepository) {
        this.notificationRepository = notificationRepository;
    }

    public List<Notification> getAdminNotifications() {
        seedAdminTicketNotifications();
        return findNotificationsSorted(ADMIN_TYPE, ADMIN_ID);
    }

    public List<Notification> getStudentNotifications(String userId) {
        if (userId == null || userId.isBlank()) {
            throw new RuntimeException("Student user id is required");
        }

        seedStudentTicketNotifications(userId);
        return findNotificationsSorted(STUDENT_TYPE, userId);
    }

    public List<Notification> getAllStudentNotificationsForAdmin() {
        return findNotificationsByRecipientTypeSorted(STUDENT_TYPE);
    }

    public Notification markAsRead(String notificationId) {
        Notification notification = findNotificationById(notificationId);

        notification.setRead(true);
        notification.setUpdatedAt(Instant.now());
        return saveNotification(notification);
    }

    public List<Notification> markAllAdminAsRead() {
        return markAllAsRead(ADMIN_TYPE, ADMIN_ID);
    }

    public List<Notification> markAllStudentAsRead(String userId) {
        return markAllAsRead(STUDENT_TYPE, userId);
    }

    public void deleteAdminNotification(String notificationId) {
        Notification notification = findNotificationById(notificationId);
        if (!ADMIN_TYPE.equals(notification.getRecipientType()) || !ADMIN_ID.equals(notification.getRecipientId())) {
            throw new RuntimeException("Admin notification not found");
        }

        deleteNotification(notificationId);
    }

    public void deleteStudentNotification(String userId, String notificationId) {
        Notification notification = findNotificationById(notificationId);
        if (!STUDENT_TYPE.equals(notification.getRecipientType()) || !userId.equals(notification.getRecipientId())) {
            throw new RuntimeException("Student notification not found");
        }

        deleteNotification(notificationId);
    }

    public Notification updateStudentNotificationForAdmin(String notificationId, NotificationUpdateRequest request) {
        Notification notification = findNotificationById(notificationId);
        if (!STUDENT_TYPE.equals(notification.getRecipientType())) {
            throw new RuntimeException("Only student notifications can be updated here");
        }

        if (request.getTitle() != null && !request.getTitle().isBlank()) {
            notification.setTitle(request.getTitle().trim());
        }

        if (request.getMessage() != null && !request.getMessage().isBlank()) {
            notification.setMessage(request.getMessage().trim());
        }

        if (request.getRead() != null) {
            notification.setRead(request.getRead());
        }

        notification.setUpdatedAt(Instant.now());
        notification.setUpdatedBy(ADMIN_ID);
        return saveNotification(notification);
    }

    public void createBookingCreatedNotifications(Booking booking) {
        saveIfMissing(
                "BOOKING_CREATED_ADMIN_" + booking.getId(),
                ADMIN_TYPE,
                ADMIN_ID,
                "BOOKING_CREATED",
                "BOOKING",
                "New reservation request submitted",
                booking.getUserName() + " (" + booking.getUserId() + ") requested " + booking.getResourceName()
                        + " on " + booking.getDate() + " from " + booking.getStartTime() + " to " + booking.getEndTime() + ".",
                "BOOKING",
                booking.getId(),
                false,
                Instant.now()
        );

        saveIfMissing(
                "BOOKING_CREATED_STUDENT_" + booking.getId(),
                STUDENT_TYPE,
                booking.getUserId(),
                "BOOKING_CREATED",
                "BOOKING",
                "Reservation request submitted",
                "Your reservation request for " + booking.getResourceName() + " on " + booking.getDate()
                        + " from " + booking.getStartTime() + " to " + booking.getEndTime() + " has been submitted.",
                "BOOKING",
                booking.getId(),
                false,
                Instant.now()
        );
    }

    public void createBookingApprovedNotifications(Booking booking) {
        saveIfMissing(
                "BOOKING_APPROVED_ADMIN_" + booking.getId(),
                ADMIN_TYPE,
                ADMIN_ID,
                "BOOKING_APPROVED",
                "BOOKING",
                "Reservation approved",
                "Booking for " + booking.getUserName() + " (" + booking.getUserId() + ") was approved for "
                        + booking.getResourceName() + ".",
                "BOOKING",
                booking.getId(),
                false,
                Instant.now()
        );

        saveIfMissing(
                "BOOKING_APPROVED_STUDENT_" + booking.getId(),
                STUDENT_TYPE,
                booking.getUserId(),
                "BOOKING_APPROVED",
                "BOOKING",
                "Your reservation is approved",
                "Your reservation for " + booking.getResourceName() + " on " + booking.getDate() + " has been approved.",
                "BOOKING",
                booking.getId(),
                false,
                Instant.now()
        );
    }

    public void createBookingRejectedNotifications(Booking booking) {
        String rejectionReason = booking.getRejectionReason() == null || booking.getRejectionReason().isBlank()
                ? "No rejection reason was provided."
                : booking.getRejectionReason();

        saveIfMissing(
                "BOOKING_REJECTED_ADMIN_" + booking.getId(),
                ADMIN_TYPE,
                ADMIN_ID,
                "BOOKING_REJECTED",
                "BOOKING",
                "Reservation rejected",
                "Booking for " + booking.getUserName() + " (" + booking.getUserId() + ") was rejected. Reason: "
                        + rejectionReason,
                "BOOKING",
                booking.getId(),
                false,
                Instant.now()
        );

        saveIfMissing(
                "BOOKING_REJECTED_STUDENT_" + booking.getId(),
                STUDENT_TYPE,
                booking.getUserId(),
                "BOOKING_REJECTED",
                "BOOKING",
                "Your reservation is rejected",
                "Your reservation for " + booking.getResourceName() + " was rejected. Reason: " + rejectionReason,
                "BOOKING",
                booking.getId(),
                false,
                Instant.now()
        );
    }

    public void createBookingCancelledNotifications(Booking booking) {
        saveIfMissing(
                "BOOKING_CANCELLED_ADMIN_" + booking.getId(),
                ADMIN_TYPE,
                ADMIN_ID,
                "BOOKING_CANCELLED",
                "BOOKING",
                "Reservation cancelled",
                booking.getUserName() + " (" + booking.getUserId() + ") cancelled the booking for "
                        + booking.getResourceName() + " on " + booking.getDate() + ".",
                "BOOKING",
                booking.getId(),
                false,
                Instant.now()
        );

        saveIfMissing(
                "BOOKING_CANCELLED_STUDENT_" + booking.getId(),
                STUDENT_TYPE,
                booking.getUserId(),
                "BOOKING_CANCELLED",
                "BOOKING",
                "Your reservation was cancelled",
                "Your reservation for " + booking.getResourceName() + " on " + booking.getDate() + " is now cancelled.",
                "BOOKING",
                booking.getId(),
                false,
                Instant.now()
        );
    }

    public void createBookingDeletedNotifications(Booking booking) {
        saveIfMissing(
                "BOOKING_DELETED_ADMIN_" + booking.getId(),
                ADMIN_TYPE,
                ADMIN_ID,
                "BOOKING_CANCELLED",
                "BOOKING",
                "Booking removed by admin",
                "Booking for " + booking.getUserName() + " (" + booking.getUserId() + ") was deleted from the schedule.",
                "BOOKING",
                booking.getId(),
                false,
                Instant.now()
        );

        saveIfMissing(
                "BOOKING_DELETED_STUDENT_" + booking.getId(),
                STUDENT_TYPE,
                booking.getUserId(),
                "BOOKING_CANCELLED",
                "BOOKING",
                "Your booking was removed by admin",
                "Your booking for " + booking.getResourceName() + " on " + booking.getDate() + " was removed by the admin desk.",
                "BOOKING",
                booking.getId(),
                false,
                Instant.now()
        );
    }

    private List<Notification> markAllAsRead(String recipientType, String recipientId) {
        List<Notification> notifications = findNotifications(recipientType, recipientId);
        notifications.forEach(notification -> {
            notification.setRead(true);
            notification.setUpdatedAt(Instant.now());
        });
        saveAllNotifications(notifications);
        return findNotificationsSorted(recipientType, recipientId);
    }

    private void seedAdminTicketNotifications() {
        saveIfMissing(
                "ADMIN_TICKET_STATUS_DEMO_1",
                ADMIN_TYPE,
                ADMIN_ID,
                "TICKET_STATUS_CHANGED",
                "TICKET",
                "Ticket status changed",
                "Ticket TCK-105 has been moved to RESOLVED by the support workflow.",
                "TICKET",
                "TCK-105",
                true,
                Instant.now().minus(3, ChronoUnit.HOURS)
        );

        saveIfMissing(
                "ADMIN_TICKET_COMMENT_DEMO_1",
                ADMIN_TYPE,
                ADMIN_ID,
                "TICKET_COMMENT_ADDED",
                "COMMENT",
                "New comment added",
                "A new student comment was added to ticket TCK-106. Review the latest update from the issue thread.",
                "TICKET",
                "TCK-106",
                true,
                Instant.now().minus(90, ChronoUnit.MINUTES)
        );
    }

    private void seedStudentTicketNotifications(String userId) {
        saveIfMissing(
                "STUDENT_" + userId + "_TICKET_STATUS_DEMO_1",
                STUDENT_TYPE,
                userId,
                "TICKET_STATUS_CHANGED",
                "TICKET",
                "Your ticket has been resolved",
                "Ticket TCK-105 has been marked as RESOLVED. You can review the latest response from the support team.",
                "TICKET",
                "TCK-105",
                true,
                Instant.now().minus(2, ChronoUnit.HOURS)
        );

        saveIfMissing(
                "STUDENT_" + userId + "_TICKET_COMMENT_DEMO_1",
                STUDENT_TYPE,
                userId,
                "TICKET_COMMENT_ADDED",
                "COMMENT",
                "New comment added",
                "A new comment was added to ticket TCK-106. Open the ticket thread to check the update.",
                "TICKET",
                "TCK-106",
                true,
                Instant.now().minus(30, ChronoUnit.MINUTES)
        );
    }

    private void saveIfMissing(String eventKey, String recipientType, String recipientId, String category,
                               String source, String title, String message, String relatedType,
                               String relatedId, boolean demo, Instant createdAt) {
        if (findNotificationByEventKey(eventKey) != null) {
            return;
        }

        Notification notification = new Notification();
        notification.setEventKey(eventKey);
        notification.setRecipientType(recipientType);
        notification.setRecipientId(recipientId);
        notification.setCategory(category);
        notification.setSource(source);
        notification.setTitle(title);
        notification.setMessage(message);
        notification.setRelatedType(relatedType);
        notification.setRelatedId(relatedId);
        notification.setRead(false);
        notification.setDemo(demo);
        notification.setCreatedAt(createdAt);
        notification.setUpdatedAt(createdAt);
        notification.setUpdatedBy(demo ? "SYSTEM_DEMO" : source);

        saveNotification(notification);
    }

    private Notification findNotificationByEventKey(String eventKey) {
        if (useFallbackStorage) {
            return fallbackNotifications.stream()
                    .filter(notification -> eventKey.equals(notification.getEventKey()))
                    .findFirst()
                    .orElse(null);
        }

        try {
            return notificationRepository.findByEventKey(eventKey).orElse(null);
        } catch (RuntimeException ex) {
            enableFallback("find notification by event key", ex);
            return findNotificationByEventKey(eventKey);
        }
    }

    private Notification findNotificationById(String notificationId) {
        if (useFallbackStorage) {
            return fallbackNotifications.stream()
                    .filter(notification -> notificationId.equals(notification.getId()))
                    .findFirst()
                    .orElseThrow(() -> new RuntimeException("Notification not found"));
        }

        try {
            return notificationRepository.findById(notificationId)
                    .orElseThrow(() -> new RuntimeException("Notification not found"));
        } catch (RuntimeException ex) {
            enableFallback("find notification by id", ex);
            return findNotificationById(notificationId);
        }
    }

    private List<Notification> findNotifications(String recipientType, String recipientId) {
        if (useFallbackStorage) {
            return fallbackNotifications.stream()
                    .filter(notification ->
                            recipientType.equals(notification.getRecipientType()) &&
                            recipientId.equals(notification.getRecipientId()))
                    .toList();
        }

        try {
            return notificationRepository.findByRecipientTypeAndRecipientId(recipientType, recipientId);
        } catch (RuntimeException ex) {
            enableFallback("find notifications", ex);
            return findNotifications(recipientType, recipientId);
        }
    }

    private List<Notification> findNotificationsSorted(String recipientType, String recipientId) {
        if (useFallbackStorage) {
            return deduplicateByEventKey(fallbackNotifications.stream()
                    .filter(notification ->
                            recipientType.equals(notification.getRecipientType()) &&
                            recipientId.equals(notification.getRecipientId()))
                    .sorted(Comparator.comparing(Notification::getCreatedAt, Comparator.nullsLast(Comparator.naturalOrder())).reversed())
                    .toList());
        }

        try {
            return deduplicateByEventKey(
                    notificationRepository.findByRecipientTypeAndRecipientIdOrderByCreatedAtDesc(recipientType, recipientId)
            );
        } catch (RuntimeException ex) {
            enableFallback("find sorted notifications", ex);
            return findNotificationsSorted(recipientType, recipientId);
        }
    }

    private List<Notification> findNotificationsByRecipientTypeSorted(String recipientType) {
        if (useFallbackStorage) {
            return deduplicateByEventKey(fallbackNotifications.stream()
                    .filter(notification -> recipientType.equals(notification.getRecipientType()))
                    .sorted(Comparator.comparing(Notification::getCreatedAt, Comparator.nullsLast(Comparator.naturalOrder())).reversed())
                    .toList());
        }

        try {
            return deduplicateByEventKey(notificationRepository.findByRecipientTypeOrderByCreatedAtDesc(recipientType));
        } catch (RuntimeException ex) {
            enableFallback("find notifications by recipient type", ex);
            return findNotificationsByRecipientTypeSorted(recipientType);
        }
    }

    private Notification saveNotification(Notification notification) {
        if (useFallbackStorage) {
            return saveNotificationInFallback(notification);
        }

        try {
            return notificationRepository.save(notification);
        } catch (RuntimeException ex) {
            enableFallback("save notification", ex);
            return saveNotificationInFallback(notification);
        }
    }

    private void saveAllNotifications(List<Notification> notifications) {
        if (useFallbackStorage) {
            notifications.forEach(this::saveNotificationInFallback);
            return;
        }

        try {
            notificationRepository.saveAll(notifications);
        } catch (RuntimeException ex) {
            enableFallback("save notifications", ex);
            notifications.forEach(this::saveNotificationInFallback);
        }
    }

    private Notification saveNotificationInFallback(Notification notification) {
        if (notification.getId() == null || notification.getId().isBlank()) {
            notification.setId(UUID.randomUUID().toString());
        }

        fallbackNotifications.removeIf(existing -> notification.getId().equals(existing.getId()));
        fallbackNotifications.add(notification);
        return notification;
    }

    private void deleteNotification(String notificationId) {
        if (useFallbackStorage) {
            fallbackNotifications.removeIf(notification -> notificationId.equals(notification.getId()));
            return;
        }

        try {
            notificationRepository.deleteById(notificationId);
        } catch (RuntimeException ex) {
            enableFallback("delete notification", ex);
            fallbackNotifications.removeIf(notification -> notificationId.equals(notification.getId()));
        }
    }

    private void enableFallback(String action, RuntimeException ex) {
        if (!useFallbackStorage) {
            logger.warn("Switching notifications to in-memory fallback because MongoDB failed during {}: {}", action, ex.getMessage());
            useFallbackStorage = true;
        }
    }

    private List<Notification> deduplicateByEventKey(List<Notification> notifications) {
        Set<String> seen = new HashSet<>();
        return notifications.stream()
                .filter(notification -> seen.add(notification.getEventKey() == null || notification.getEventKey().isBlank()
                        ? notification.getId()
                        : notification.getEventKey()))
                .toList();
    }
}
