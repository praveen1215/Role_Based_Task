
package com.taskmanager.backend.dto;

public record RegisterResponse(
    Long id,
    String name,
    String email,
    String role,
    String message
) {}
