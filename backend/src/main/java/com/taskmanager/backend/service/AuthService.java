
package com.taskmanager.backend.service;

import com.taskmanager.backend.dto.*;
import com.taskmanager.backend.entity.User;
import com.taskmanager.backend.repository.UserRepository;

import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.taskmanager.backend.dto.LoginRequest;
import com.taskmanager.backend.dto.LoginResponse;
import com.taskmanager.backend.security.JwtService;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.server.ResponseStatusException;
import org.springframework.http.HttpStatus;

import java.util.Locale;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    
    public AuthService(UserRepository userRepository,
                       PasswordEncoder passwordEncoder,
                       JwtService jwtService) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
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

    
public LoginResponse login(LoginRequest request) {

    // Normalize email to match registration
    String email = request.email().trim().toLowerCase(
        java.util.Locale.ROOT
    );

    // Find registered user
    User user = userRepository.findByEmail(email)
        .orElseThrow(() -> new ResponseStatusException(
            HttpStatus.UNAUTHORIZED,
            "Invalid email or password"
        ));

    // Compare entered password with stored BCrypt hash
    if (!passwordEncoder.matches(
            request.password(),
            user.getPasswordHash()
    )) {
        throw new ResponseStatusException(
            HttpStatus.UNAUTHORIZED,
            "Invalid email or password"
        );
    }

    // Generate signed JWT
    String token = jwtService.generateToken(user);

    // Return user details without password
    return new LoginResponse(
        token,
        "Bearer",
        user.getId(),
        user.getName(),
        user.getEmail(),
        user.getRole()
    );
}

}
