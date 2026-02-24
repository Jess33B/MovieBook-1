package com.moviebooking.service;

import com.moviebooking.dto.AuthResponse;
import com.moviebooking.dto.LoginRequest;
import com.moviebooking.dto.RegisterRequest;
import com.moviebooking.entity.User;
import com.moviebooking.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthService {

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtService jwtService;

    public AuthResponse login(LoginRequest loginRequest) {
        Authentication authentication = authenticationManager.authenticate(
            new UsernamePasswordAuthenticationToken(
                loginRequest.getUsernameOrEmail(),
                loginRequest.getPassword()
            )
        );

        User user = userRepository.findByUsernameOrEmail(
            loginRequest.getUsernameOrEmail(), 
            loginRequest.getUsernameOrEmail()
        ).orElseThrow(() -> new UsernameNotFoundException("User not found"));

        String token = jwtService.generateToken(
            user.getUsername(),
            user.getUserId(),
            user.getRole().name(),
            user.getEmail(),
            user.getFullName()
        );

        return new AuthResponse(
            token, 
            user.getUserId(), 
            user.getUsername(), 
            user.getEmail(), 
            user.getRole().name(), 
            user.getFullName()
        );
    }

    public AuthResponse register(RegisterRequest registerRequest) {
        if (userRepository.existsByUsername(registerRequest.getUsername())) {
            throw new RuntimeException("Username already exists");
        }

        if (userRepository.existsByEmail(registerRequest.getEmail())) {
            throw new RuntimeException("Email already exists");
        }

        User user = new User();
        user.setUsername(registerRequest.getUsername());
        user.setEmail(registerRequest.getEmail());
        user.setPassword(passwordEncoder.encode(registerRequest.getPassword()));
        user.setFullName(registerRequest.getFullName());
        user.setPhoneNumber(registerRequest.getPhoneNumber());

        User savedUser = userRepository.save(user);

        String token = jwtService.generateToken(
            savedUser.getUsername(),
            savedUser.getUserId(),
            savedUser.getRole().name(),
            savedUser.getEmail(),
            savedUser.getFullName()
        );

        return new AuthResponse(
            token, 
            savedUser.getUserId(), 
            savedUser.getUsername(), 
            savedUser.getEmail(), 
            savedUser.getRole().name(), 
            savedUser.getFullName()
        );
    }
}
