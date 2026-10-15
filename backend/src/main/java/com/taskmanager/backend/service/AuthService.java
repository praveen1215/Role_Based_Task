
package com.taskmanager.backend.service;

import com.taskmanager.backend.dto.*;
import com.taskmanager.backend.entity.User;
import com.taskmanager.backend.repository.UserRepository;

import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Locale;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public AuthService(UserRepository userRepository,
                       PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    public RegisterResponse register(RegisterRequest request) {

        String name = request.name().trim();
        String email = request.email().trim().toLowerCase(Locale.ROOT);

        if (userRepository.existsByEmail(email)) {
            throw new IllegalArgumentException("Email already registered");
        }

        String hashedPassword = passwordEncoder.encode(request.password());

        User user = new User(name, email, hashedPassword);

        try {
            user = userRepository.saveAndFlush(user);
        } catch (DataIntegrityViolationException ex) {
            throw new IllegalArgumentException("Email already registered", ex);
        }

        return new RegisterResponse(
            user.getId(),
            user.getName(),
            user.getEmail(),
            user.getRole(),
            "Registration successful"
        );
    }
}
