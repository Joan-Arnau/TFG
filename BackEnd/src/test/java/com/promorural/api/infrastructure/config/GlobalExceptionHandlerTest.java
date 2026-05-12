package com.promorural.api.infrastructure.config;

import static org.assertj.core.api.Assertions.assertThat;

import com.promorural.api.core.domain.exception.BadRequestException;
import com.promorural.api.core.domain.exception.ConflictException;
import com.promorural.api.core.domain.exception.ResourceNotFoundException;
import jakarta.servlet.http.HttpServletRequest;
import org.junit.jupiter.api.Test;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.mock.web.MockHttpServletRequest;
import org.springframework.security.access.AccessDeniedException;

class GlobalExceptionHandlerTest {

    private final GlobalExceptionHandler handler = new GlobalExceptionHandler();
    private final HttpServletRequest request = new MockHttpServletRequest("GET", "/api/test");

    @Test
    void mapsDomainExceptionsToStableApiErrors() {
        ResponseEntity<ApiError> badRequest = handler.handleBadRequestException(
                new BadRequestException("Invalid payload"), request);
        ResponseEntity<ApiError> notFound = handler.handleNotFoundException(
                new ResourceNotFoundException("Missing resource"), request);
        ResponseEntity<ApiError> conflict = handler.handleConflictException(
                new ConflictException("Already exists"), request);

        assertError(badRequest, HttpStatus.BAD_REQUEST, "BAD_REQUEST", "Invalid payload");
        assertError(notFound, HttpStatus.NOT_FOUND, "RESOURCE_NOT_FOUND", "Missing resource");
        assertError(conflict, HttpStatus.CONFLICT, "CONFLICT", "Already exists");
    }

    @Test
    void mapsSecurityExceptionsWithoutLeakingDetails() {
        ResponseEntity<ApiError> response = handler.handleAccessDeniedException(
                new AccessDeniedException("internal reason"), request);

        assertError(response, HttpStatus.FORBIDDEN, "ACCESS_DENIED", "Access denied");
    }

    @Test
    void hidesUnexpectedRuntimeExceptionDetails() {
        ResponseEntity<ApiError> response = handler.handleRuntimeException(
                new RuntimeException("database password leaked"), request);

        assertError(response, HttpStatus.INTERNAL_SERVER_ERROR, "UNEXPECTED_ERROR", "Unexpected error");
    }

    private void assertError(ResponseEntity<ApiError> response, HttpStatus status, String code, String message) {
        assertThat(response.getStatusCode()).isEqualTo(status);
        assertThat(response.getBody()).isNotNull();
        assertThat(response.getBody().code()).isEqualTo(code);
        assertThat(response.getBody().message()).isEqualTo(message);
        assertThat(response.getBody().path()).isEqualTo("/api/test");
        assertThat(response.getBody().timestamp()).isNotNull();
    }
}
