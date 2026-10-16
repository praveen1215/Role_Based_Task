
package com.taskmanager.backend.dto;

import jakarta.validation.constraints.*;
import java.time.LocalDate;

public record AdminTaskRequest(

    @NotBlank
    @Size(max = 255)
    String title,

    @Size(max = 2000)
    String description,

    @NotBlank
    @Pattern(regexp = "TODO|IN_PROGRESS|DONE")
    String status,

    @NotBlank
    @Pattern(regexp = "LOW|MEDIUM|HIGH")
    String priority,

    @NotNull
    LocalDate dueDate,

    @NotNull
    Long ownerId

) {}
