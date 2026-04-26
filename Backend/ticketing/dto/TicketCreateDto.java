// Backend: src/main/java/com/smartcampus/maintenance/dto/TicketCreateDto.java

package com.smartcampus.backend.ticketing.dto;

import com.smartcampus.backend.ticketing.model.Ticket;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class TicketCreateDto {

    @NotBlank(message = "Resource/Location is required")
    private String resourceLocation;

    @NotBlank(message = "Category is required")
    private String category;

    @NotBlank(message = "Description is required")
    @Size(min = 20, message = "Description must be at least 20 characters")
    private String description;

    @NotNull(message = "Priority is required")
    private Ticket.Priority priority;

    @NotBlank(message = "Contact details are required")
    private String contactDetails;
}
