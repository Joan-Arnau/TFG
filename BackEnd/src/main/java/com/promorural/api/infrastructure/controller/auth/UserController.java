package com.promorural.api.infrastructure.controller.auth;

import com.promorural.api.core.application.dto.auth.ChangePasswordRequest;
import com.promorural.api.core.application.dto.auth.UserProfileResponse;
import com.promorural.api.core.application.service.use_case.auth.UserUseCase;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;
import com.promorural.api.core.application.validation.ValidationGroups;

@RestController
@RequestMapping("/api/user")
public class UserController {

    private final UserUseCase userUseCase;

    public UserController(UserUseCase userUseCase) {
        this.userUseCase = userUseCase;
    }

    /**
     * Endpoint to get the profile of the authenticated user.
     */
    @GetMapping("/profile")
    public ResponseEntity<UserProfileResponse> getProfile() {
        return ResponseEntity.ok(userUseCase.getCurrentUserProfile());
    }

    /**
     * Endpoint to change the password of the authenticated user.
     */
    @PutMapping("/change-password")
    public ResponseEntity<Void> changePassword(
            @Validated(ValidationGroups.Update.class) @RequestBody ChangePasswordRequest request) {
        userUseCase.changePassword(request);
        return ResponseEntity.ok().build();
    }
}
