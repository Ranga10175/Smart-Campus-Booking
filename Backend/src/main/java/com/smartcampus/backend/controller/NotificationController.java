package com.smartcampus.backend.controller;

import com.smartcampus.backend.dto.NotificationUpdateRequest;
import com.smartcampus.backend.model.Notification;
import com.smartcampus.backend.service.NotificationService;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/notifications")
@CrossOrigin(origins = "*")
public class NotificationController {

    private final NotificationService notificationService;

    public NotificationController(NotificationService notificationService) {
        this.notificationService = notificationService;
    }

    @GetMapping("/admin")
    public List<Notification> getAdminNotifications() {
        return notificationService.getAdminNotifications();
    }

    @GetMapping("/student/{userId}")
    public List<Notification> getStudentNotifications(@PathVariable String userId) {
        return notificationService.getStudentNotifications(userId);
    }

    @GetMapping("/admin/student-notifications")
    public List<Notification> getAllStudentNotificationsForAdmin() {
        return notificationService.getAllStudentNotificationsForAdmin();
    }

    @PutMapping("/{notificationId}/read")
    public Notification markAsRead(@PathVariable String notificationId) {
        return notificationService.markAsRead(notificationId);
    }

    @PutMapping("/admin/read-all")
    public List<Notification> markAllAdminNotificationsAsRead() {
        return notificationService.markAllAdminAsRead();
    }

    @PutMapping("/student/{userId}/read-all")
    public List<Notification> markAllStudentNotificationsAsRead(@PathVariable String userId) {
        return notificationService.markAllStudentAsRead(userId);
    }

    @DeleteMapping("/admin/{notificationId}")
    public void deleteAdminNotification(@PathVariable String notificationId) {
        notificationService.deleteAdminNotification(notificationId);
    }

    @DeleteMapping("/student/{userId}/{notificationId}")
    public void deleteStudentNotification(@PathVariable String userId, @PathVariable String notificationId) {
        notificationService.deleteStudentNotification(userId, notificationId);
    }

    @PutMapping("/admin/student/{notificationId}")
    public Notification updateStudentNotificationForAdmin(@PathVariable String notificationId,
                                                          @RequestBody NotificationUpdateRequest request) {
        return notificationService.updateStudentNotificationForAdmin(notificationId, request);
    }
}
