package com.promorural.api.service;

import com.promorural.api.dto.AuthDtos.LoginRequest;
import com.promorural.api.dto.AuthDtos.LoginResponse;
import com.promorural.api.dto.AuthDtos.RegisterRequest;
import com.promorural.api.entity.Role;
import com.promorural.api.entity.User;
import com.promorural.api.repository.UserRepository;
import com.promorural.api.security.JwtService;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
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

    public LoginResponse login(LoginRequest request) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.username(), request.password())
        );

        User user = (User) authentication.getPrincipal();
        String token = jwtService.generateToken(user);
        return new LoginResponse(token, user.getRole().name());
    }

    public void register(RegisterRequest request) {
        if (userRepository.findByUsername(request.username()).isPresent()) {
            throw new RuntimeException("Username already exists");
        }

        User user = new User();
        user.setUsername(request.username());
        user.setPassword(passwordEncoder.encode(request.password()));
        user.setRole(Role.ROLE_MERCHANT);
        userRepository.save(user);
    }
}
