
package com.taskmanager.backend.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import java.time.LocalDate;

public record TaskRequest(

    @NotBlank(message = "Title is required")
    @Size(max = 255, message = "Title is too long")
    String title,

    @Size(max = 2000, message = "Description is too long")
    String description,

    @NotBlank(message = "Status is required")
    @Pattern(
        regexp = "TODO|IN_PROGRESS|DONE",
        message = "Invalid task status"
    )
    String status,

    @NotBlank(message = "Priority is required")
    @Pattern(
        regexp = "LOW|MEDIUM|HIGH",
        message = "Invalid task priority"
    )
    String priority,

    @NotNull(message = "Due date is required")
    LocalDate dueDate

) {}
