package com.smartcampus.backend.repository;

import com.smartcampus.backend.model.Notification;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;
import java.util.Optional;

public interface NotificationRepository extends MongoRepository<Notification, String> {

    Optional<Notification> findByEventKey(String eventKey);

    List<Notification> findByRecipientTypeAndRecipientIdOrderByCreatedAtDesc(String recipientType, String recipientId);

    List<Notification> findByRecipientTypeAndRecipientId(String recipientType, String recipientId);

    List<Notification> findByRecipientTypeOrderByCreatedAtDesc(String recipientType);
}
