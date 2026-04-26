// Backend: src/main/java/com/smartcampus/maintenance/dto/ProgressDto.java

package com.smartcampus.backend.ticketing.dto;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import lombok.Data;

@Data
public class ProgressDto {
    @Min(0) @Max(100)
    private int progress;
}
