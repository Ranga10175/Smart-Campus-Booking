// Backend: src/main/java/com/smartcampus/maintenance/dto/CommentDto.java

package com.smartcampus.backend.ticketing.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class CommentDto {
    @NotBlank
    private String content;
}
