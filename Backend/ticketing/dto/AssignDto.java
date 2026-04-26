// Backend: src/main/java/com/smartcampus/maintenance/dto/AssignDto.java

package com.smartcampus.backend.ticketing.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class AssignDto {
    @NotBlank
    private String technicianId;
}
