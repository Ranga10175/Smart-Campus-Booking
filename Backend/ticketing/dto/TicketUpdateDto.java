// Backend: src/main/java/com/smartcampus/maintenance/dto/TicketUpdateDto.java

package com.smartcampus.backend.ticketing.dto;

import com.smartcampus.backend.ticketing.model.Ticket;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class TicketUpdateDto {

    private String resourceLocation;
    private String category;

    @Size(min = 20, message = "Description must be at least 20 characters")
    private String description;

    private Ticket.Priority priority;
    private String contactDetails;
}
