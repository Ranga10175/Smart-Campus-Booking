package com.smartcampus.backend.ticketing.model;
import lombok.*;
import java.time.Instant;
import java.util.*;
@Data @Builder @NoArgsConstructor @AllArgsConstructor
public class Ticket {
  private String id; private String ticketNumber; private String resourceLocation; private String category; private String description; private Priority priority; private Status status; private String contactDetails;
  @Builder.Default private List<String> images = new ArrayList<>();
  private String reportedById; private String reportedByName; private String assignedToId; private String assignedToName;
  @Builder.Default private int progress = 0;
  private String resolutionNotes; private String rejectionReason; private Instant createdAt; private Instant updatedAt; private Instant assignedAt; private Instant resolvedAt;
  @Builder.Default private List<TicketComment> comments = new ArrayList<>();
  public enum Priority { LOW, MEDIUM, HIGH }
  public enum Status { OPEN, ASSIGNED, IN_PROGRESS, RESOLVED, REJECTED, CLOSED }
}
