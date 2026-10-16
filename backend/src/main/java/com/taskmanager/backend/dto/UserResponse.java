
package com.taskmanager.backend.dto;

public record UserResponse(
    Long id,
    String name,
    String email,
    String role
) {}
