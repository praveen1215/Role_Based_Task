
package com.taskmanager.backend.config;

import com.taskmanager.backend.entity.User;
import com.taskmanager.backend.repository.UserRepository;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Component;

import java.util.Locale;

@Component
public class AdminSeeder implements CommandLineRunner {

    private final UserRepository userRepository;
    private final BCryptPasswordEncoder passwordEncoder;

    @Value("${ADMIN_NAME}")
    private String adminName;

    @Value("${ADMIN_EMAIL}")
    private String adminEmail;

    @Value("${ADMIN_PASSWORD}")
    private String adminPassword;

    public AdminSeeder(
            UserRepository userRepository,
            BCryptPasswordEncoder passwordEncoder
    ) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void run(String... args) {
        String email = adminEmail.trim().toLowerCase(Locale.ROOT);

        if (email.isEmpty() || adminPassword.length() < 5) {
            throw new IllegalStateException(
                "Admin email or password configuration is invalid"
            );
        }

        if (userRepository.existsByEmail(email)) {
            System.out.println("Admin seed skipped: email already exists");
            return;
        }

      
            User admin = User.createAdmin(
                adminName,
                email,
                passwordEncoder.encode(adminPassword)
            );

            userRepository.save(admin);

        System.out.println("Initial admin account created");
    }
}
