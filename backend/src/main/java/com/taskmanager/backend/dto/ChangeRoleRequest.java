
package com.taskmanager.backend.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;

public record ChangeRoleRequest(

    @NotBlank
    @Pattern(
        regexp = "USER|ADMIN",
        message = "Role must be USER or ADMIN"
    )
    String role

) {}
