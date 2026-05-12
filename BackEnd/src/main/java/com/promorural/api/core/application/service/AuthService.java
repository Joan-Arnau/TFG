package com.promorural.api.core.application.service;

import com.promorural.api.core.application.dto.auth.LoginRequest;
import com.promorural.api.core.application.dto.auth.LoginResponse;
import com.promorural.api.core.application.dto.auth.RegisterRequest;
import com.promorural.api.core.domain.entity.Role;
import com.promorural.api.core.domain.entity.User;
import com.promorural.api.core.domain.repository.UserRepository;
import com.promorural.api.infrastructure.security.JwtService;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthService {

    private final AuthenticationManager authenticationManager;
    private final JwtService jwtService;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public AuthService(
            AuthenticationManager authenticationManager,
            JwtService jwtService,
            UserRepository userRepository,
            PasswordEncoder passwordEncoder
    ) {
        this.authenticationManager = authenticationManager;
        this.jwtService = jwtService;
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    /**
     * Authenticates a user and returns a JWT upon successful login.
     * @param request Login credentials (username and password).
     * @return LoginResponse containing the JWT and user role.
     * @throws BadCredentialsException if authentication fails.
     */
    public LoginResponse login(LoginRequest request) {
        try {
            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(request.username(), request.password())
            );

            User user = (User) authentication.getPrincipal();
            String token = jwtService.generateToken(user);
            return new LoginResponse(token, user.getRole().name()); 
        } catch (AuthenticationException e) {
            throw new BadCredentialsException("Invalid username or password", e);
        }
    }

    /**
     * Registers a new merchant user.
     * @param request Registration details (username, password).
     * @throws IllegalArgumentException if username already exists.
     */
    public void register(RegisterRequest request) {
        if (userRepository.findByUsername(request.username()).isPresent()) {
            throw new IllegalArgumentException("Username already exists");
        }

        User user = new User();
        user.setUsername(request.username());
        user.setPassword(passwordEncoder.encode(request.password()));
        user.setRole(Role.ROLE_MERCHANT);
        userRepository.save(user);
    }
}
