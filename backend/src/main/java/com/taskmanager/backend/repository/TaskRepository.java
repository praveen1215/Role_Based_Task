
package com.taskmanager.backend.repository;

import com.taskmanager.backend.entity.Task;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface TaskRepository extends JpaRepository<Task, Long> {

    // Find all tasks belonging to a user
    List<Task> findByOwnerId(Long ownerId);

    // Find a specific task belonging to a user
    Optional<Task> findByIdAndOwnerId(Long id, Long ownerId);
}
