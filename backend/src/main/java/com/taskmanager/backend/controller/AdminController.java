
package com.taskmanager.backend.controller;

import com.taskmanager.backend.dto.*;
import com.taskmanager.backend.entity.User;
import com.taskmanager.backend.repository.UserRepository;
import com.taskmanager.backend.service.TaskService;

import jakarta.validation.Valid;
import org.springframework.http.*;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@RestController
@RequestMapping("/admin")
@PreAuthorize("hasRole('ADMIN')")
public class AdminController {

    private final TaskService taskService;
    private final UserRepository userRepository;

    public AdminController(
            TaskService taskService,
            UserRepository userRepository
    ) {
        this.taskService = taskService;
        this.userRepository = userRepository;
    }

    @GetMapping("/tasks")
    public List<TaskResponse> getTasks() {
        return taskService.getAllTasks();
    }

    @PostMapping("/tasks")
    public ResponseEntity<TaskResponse> createTask(
            @Valid @RequestBody AdminTaskRequest request
    ) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(taskService.createAdminTask(request));
    }

    @PutMapping("/tasks/{id}")
    public TaskResponse updateTask(
            @PathVariable Long id,
            @Valid @RequestBody AdminTaskRequest request
    ) {
        return taskService.updateAdminTask(id, request);
    }

    @DeleteMapping("/tasks/{id}")
    public ResponseEntity<Void> deleteTask(
            @PathVariable Long id
    ) {
        taskService.deleteAdminTask(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/users")
    public List<UserResponse> getUsers() {
        return userRepository.findAll()
                .stream()
                .map(user -> new UserResponse(
                    user.getId(),
                    user.getName(),
                    user.getEmail(),
                    user.getRole()
                ))
                .toList();
    }

    @Transactional
    @PatchMapping("/users/{id}/role")
    public UserResponse changeRole(
            @PathVariable Long id,
            @Valid @RequestBody ChangeRoleRequest request,
            Authentication authentication
    ) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(
                    HttpStatus.NOT_FOUND, "User not found"
                ));

        // Prevent an admin from removing their own admin access
        if (user.getEmail().equals(authentication.getName())
                && !request.role().equals("ADMIN")) {
            throw new ResponseStatusException(
                HttpStatus.BAD_REQUEST,
                "You cannot remove your own admin role"
            );
        }

        user.setRole(request.role());
        userRepository.save(user);

        return new UserResponse(
            user.getId(),
            user.getName(),
            user.getEmail(),
            user.getRole()
        );
    }
}
