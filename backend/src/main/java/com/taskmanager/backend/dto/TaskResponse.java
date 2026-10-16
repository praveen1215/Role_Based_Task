
package com.taskmanager.backend.dto;

import java.time.LocalDate;
import java.time.LocalDateTime;

public record TaskResponse(
    Long id,
    String title,
    String description,
    String status,
    String priority,
    LocalDate dueDate,
    Long ownerId,
    String ownerName,
    LocalDateTime createdAt,
    LocalDateTime updatedAt
) {}
