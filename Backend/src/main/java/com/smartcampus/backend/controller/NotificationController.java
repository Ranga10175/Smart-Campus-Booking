package com.smartcampus.backend.controller;

import com.smartcampus.backend.dto.UpdateNotificationRequest;
import com.smartcampus.backend.model.Notification;
import com.smartcampus.backend.service.NotificationService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/notifications")
@CrossOrigin(origins = "*")
public class NotificationController {
    private final NotificationService notificationService;

    public NotificationController(NotificationService notificationService) {
        this.notificationService = notificationService;
    }

    // Admin Notifications
    @GetMapping("/admin")
    public List<Notification> getAdminNotifications() {
        return notificationService.getAdminNotifications();
    }

    @PutMapping("/admin/mark-all-read")
    public void markAllAdminNotificationsAsRead() {
        notificationService.markAllAdminAsRead();
    }

    @DeleteMapping("/admin/{id}")
    public void deleteAdminNotification(@PathVariable String id) {
        notificationService.deleteAdminNotification(id);
    }

    // Student Notifications
    @GetMapping("/student/{userId}")
    public List<Notification> getStudentNotifications(@PathVariable String userId) {
        return notificationService.getStudentNotifications(userId);
    }

    @PutMapping("/student/{userId}/mark-all-read")
    public void markAllStudentNotificationsAsRead(@PathVariable String userId) {
        notificationService.markAllStudentAsRead(userId);
    }

    @DeleteMapping("/student/{userId}/{id}")
    public void deleteStudentNotification(@PathVariable String userId, @PathVariable String id) {
        notificationService.deleteStudentNotification(userId, id);
    }

    // Shared
    @PutMapping("/{id}/read")
    public Notification markNotificationAsRead(@PathVariable String id) {
        return notificationService.markAsRead(id);
    }

    // Admin managing student notifications
    @GetMapping("/admin/students")
    public List<Notification> getAllStudentNotificationsForAdmin() {
        return notificationService.getAllStudentNotifications();
    }

    @PutMapping("/admin/students/{id}")
    public Notification updateStudentNotificationForAdmin(@PathVariable String id, @RequestBody UpdateNotificationRequest request) {
        return notificationService.updateStudentNotificationAsAdmin(id, request.getTitle(), request.getMessage(), request.getRead());
    }
}

