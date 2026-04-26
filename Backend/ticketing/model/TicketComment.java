package com.smartcampus.backend.ticketing.model;
import lombok.*;
import java.time.Instant;
@Data @Builder @NoArgsConstructor @AllArgsConstructor
public class TicketComment { private String id; private String authorId; private String authorName; private String authorRole; private String content; private Instant createdAt; private Instant updatedAt; }
