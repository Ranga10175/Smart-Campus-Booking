package com.smartcampus.backend.service;

import com.smartcampus.backend.model.Notification;
import com.smartcampus.backend.repository.NotificationRepository;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.List;

@Service
public class NotificationService {
    public static final String AUDIENCE_ADMIN = "ADMIN";
    public static final String AUDIENCE_STUDENT = "STUDENT";

    private final NotificationRepository notificationRepository;

    public NotificationService(NotificationRepository notificationRepository) {
        this.notificationRepository = notificationRepository;
    }

    public List<Notification> getAdminNotifications() {
        return notificationRepository.findByAudienceOrderByCreatedAtDesc(AUDIENCE_ADMIN);
    }

    public List<Notification> getStudentNotifications(String userId) {
        return notificationRepository.findByAudienceAndRecipientIdOrderByCreatedAtDesc(AUDIENCE_STUDENT, userId);
    }

    public List<Notification> getAllStudentNotifications() {
        return notificationRepository.findByAudienceOrderByCreatedAtDesc(AUDIENCE_STUDENT);
    }

    public Notification createAdminNotification(String category, String title, String message, String relatedId) {
        Notification notification = base(category, title, message, relatedId);
        notification.setAudience(AUDIENCE_ADMIN);
        notification.setRecipientId(null);
        return notificationRepository.save(notification);
    }

    public Notification createStudentNotification(String recipientId, String category, String title, String message, String relatedId) {
        Notification notification = base(category, title, message, relatedId);
        notification.setAudience(AUDIENCE_STUDENT);
        notification.setRecipientId(recipientId);
        return notificationRepository.save(notification);
    }

    public Notification markAsRead(String id) {
        Notification notification = notificationRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Notification not found"));
        if (!notification.isRead()) {
            notification.setRead(true);
            notification.setUpdatedAt(Instant.now());
        }
        return notificationRepository.save(notification);
    }

    public void markAllAdminAsRead() {
        List<Notification> notifications = getAdminNotifications();
        Instant now = Instant.now();
        for (Notification notification : notifications) {
            if (!notification.isRead()) {
                notification.setRead(true);
                notification.setUpdatedAt(now);
            }
        }
        notificationRepository.saveAll(notifications);
    }

    public void markAllStudentAsRead(String userId) {
        List<Notification> notifications = getStudentNotifications(userId);
        Instant now = Instant.now();
        for (Notification notification : notifications) {
            if (!notification.isRead()) {
                notification.setRead(true);
                notification.setUpdatedAt(now);
            }
        }
        notificationRepository.saveAll(notifications);
    }

    public void deleteAdminNotification(String id) {
        Notification notification = notificationRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Notification not found"));
        if (!AUDIENCE_ADMIN.equals(notification.getAudience())) {
            throw new RuntimeException("Not an admin notification");
        }
        notificationRepository.deleteById(id);
    }

    public void deleteStudentNotification(String userId, String id) {
        Notification notification = notificationRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Notification not found"));
        if (!AUDIENCE_STUDENT.equals(notification.getAudience()) || !userId.equals(notification.getRecipientId())) {
            throw new RuntimeException("Not a student notification for this user");
        }
        notificationRepository.deleteById(id);
    }

    public Notification updateStudentNotificationAsAdmin(String id, String title, String message, Boolean read) {
        Notification notification = notificationRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Notification not found"));
        if (!AUDIENCE_STUDENT.equals(notification.getAudience())) {
            throw new RuntimeException("Not a student notification");
        }
        if (title != null) {
            notification.setTitle(title);
        }
        if (message != null) {
            notification.setMessage(message);
        }
        if (read != null) {
            notification.setRead(read);
        }
        notification.setUpdatedAt(Instant.now());
        notification.setUpdatedBy("ADMIN");
        return notificationRepository.save(notification);
    }

    private Notification base(String category, String title, String message, String relatedId) {
        Notification notification = new Notification();
        notification.setSource("BOOKING");
        notification.setCategory(category);
        notification.setTitle(title);
        notification.setMessage(message);
        notification.setRelatedId(relatedId);
        notification.setRead(false);
        notification.setDemo(false);
        notification.setCreatedAt(Instant.now());
        notification.setUpdatedAt(null);
        notification.setUpdatedBy(null);
        return notification;
    }
}

