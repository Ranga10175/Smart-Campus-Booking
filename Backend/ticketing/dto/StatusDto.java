// Backend: src/main/java/com/smartcampus/maintenance/dto/StatusDto.java

package com.smartcampus.backend.ticketing.dto;

import com.smartcampus.backend.ticketing.model.Ticket;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class StatusDto {
    @NotNull
    private Ticket.Status status;
}
