package com.promorural.api.core.application.service;

import com.promorural.api.core.application.dto.auth.ChangePasswordRequest;
import com.promorural.api.core.application.dto.auth.UserProfileResponse;
import com.promorural.api.core.domain.entity.User;
import com.promorural.api.core.domain.repository.UserRepository;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public UserService(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    /**
     * Retrieves the profile information of the currently authenticated user.
     * @return UserProfileResponse DTO.
     */
    public UserProfileResponse getCurrentUserProfile() {
        User user = getCurrentUser();
        return new UserProfileResponse(user.getUsername(), user.getRole().name());
    }

    /**
     * Changes the password for the currently authenticated user.
     * @param request The ChangePasswordRequest containing old and new passwords.
     * @throws IllegalArgumentException if the old password does not match.
     */
    @Transactional
    public void changePassword(ChangePasswordRequest request) {
        User user = getCurrentUser();

        if (!passwordEncoder.matches(request.oldPassword(), user.getPassword())) {
            throw new IllegalArgumentException("Current password does not match");
        }

        user.setPassword(passwordEncoder.encode(request.newPassword()));
        userRepository.save(user);
    }

    /**
     * Helper to get the current authenticated user from SecurityContext.
     */
    private User getCurrentUser() {
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        return userRepository.findByUsername(username)
                .orElseThrow(() -> new UsernameNotFoundException("User not found: " + username));
    }
}
