
package com.taskmanager.backend.entity;

import jakarta.persistence.*;
import java.time.Instant;

@Entity
@Table(name = "users")
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 100)
    private String name;

    @Column(nullable = false, unique = true, length = 255)
    private String email;

    @Column(name = "password_hash", nullable = false)
    private String passwordHash;

    @Column(nullable = false)
    private String role = "USER";

    @Column(name = "created_at", nullable = false)
    private Instant createdAt;

    protected User() {}

    public User(String name, String email, String passwordHash) {
        this.name = name;
        this.email = email;
        this.passwordHash = passwordHash;
        this.role = "USER";
        this.createdAt = Instant.now();
    }

    public Long getId() { return id; }
    public String getName() { return name; }
    public String getEmail() { return email; }
    public String getRole() { return role; }
    
    public String getPasswordHash() {
    return passwordHash;
    }
    
    
public static User createAdmin(
        String name,
        String email,
        String passwordHash
) {
    User admin = new User(name, email, passwordHash);
    admin.role = "ADMIN";
    return admin;
}

public void setRole(String role) {
    if (!"USER".equals(role) && !"ADMIN".equals(role)) {
        throw new IllegalArgumentException("Invalid user role");
    }

    this.role = role;
}


}
