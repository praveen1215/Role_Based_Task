
package com.taskmanager.backend.service;

import com.taskmanager.backend.dto.TaskRequest;
import com.taskmanager.backend.dto.TaskResponse;
import com.taskmanager.backend.entity.Task;
import com.taskmanager.backend.entity.User;
import com.taskmanager.backend.repository.TaskRepository;
import com.taskmanager.backend.repository.UserRepository;

import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;

@Service
@Transactional
public class TaskService {

    private final TaskRepository taskRepository;
    private final UserRepository userRepository;

    public TaskService(
            TaskRepository taskRepository,
            UserRepository userRepository
    ) {
        this.taskRepository = taskRepository;
        this.userRepository = userRepository;
    }

    // Get the currently logged-in user
    private User getCurrentUser(Authentication authentication) {
        if (authentication == null || !authentication.isAuthenticated()) {
            throw new ResponseStatusException(
                HttpStatus.UNAUTHORIZED, "Please log in"
            );
        }

        return userRepository.findByEmail(authentication.getName())
                .orElseThrow(() -> new ResponseStatusException(
                    HttpStatus.UNAUTHORIZED, "User not found"
                ));
    }

    // Convert a Task entity to a response
    private TaskResponse toResponse(Task task) {
        return new TaskResponse(
            task.getId(),
            task.getTitle(),
            task.getDescription(),
            task.getStatus(),
            task.getPriority(),
            task.getDueDate(),
            task.getOwner().getId(),
            task.getOwner().getName(),
            task.getCreatedAt(),
            task.getUpdatedAt()
        );
    }

    // Find a task owned by the logged-in user
    private Task getOwnTask(Long taskId, User user) {
        return taskRepository.findByIdAndOwnerId(taskId, user.getId())
                .orElseThrow(() -> new ResponseStatusException(
                    HttpStatus.NOT_FOUND, "Task not found"
                ));
    }

    // CREATE TASK
    public TaskResponse createTask(
            TaskRequest request,
            Authentication authentication
    ) {
        User user = getCurrentUser(authentication);

        Task task = new Task();
        task.setTitle(request.title().trim());
        task.setDescription(request.description());
        task.setStatus(request.status());
        task.setPriority(request.priority());
        task.setDueDate(request.dueDate());
        task.setOwner(user);

        return toResponse(taskRepository.save(task));
    }

    // VIEW MY TASKS
    public List<TaskResponse> getMyTasks(Authentication authentication) {
        User user = getCurrentUser(authentication);

        return taskRepository.findByOwnerId(user.getId())
                .stream()
                .map(this::toResponse)
                .toList();
    }

    // VIEW ONE TASK
    public TaskResponse getTask(
            Long taskId,
            Authentication authentication
    ) {
        User user = getCurrentUser(authentication);
        Task task = getOwnTask(taskId, user);

        return toResponse(task);
    }

    // UPDATE TASK
    public TaskResponse updateTask(
            Long taskId,
            TaskRequest request,
            Authentication authentication
    ) {
        User user = getCurrentUser(authentication);
        Task task = getOwnTask(taskId, user);

        task.setTitle(request.title().trim());
        task.setDescription(request.description());
        task.setStatus(request.status());
        task.setPriority(request.priority());
        task.setDueDate(request.dueDate());

        return toResponse(taskRepository.save(task));
    }

    // DELETE TASK
    public void deleteTask(
            Long taskId,
            Authentication authentication
    ) {
        User user = getCurrentUser(authentication);
        Task task = getOwnTask(taskId, user);

        taskRepository.delete(task);
    }
}
