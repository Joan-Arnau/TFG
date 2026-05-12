package com.promorural.api.infrastructure.security;

import static org.assertj.core.api.Assertions.assertThat;

import com.promorural.api.core.domain.entity.Role;
import com.promorural.api.core.domain.entity.User;
import com.promorural.api.infrastructure.config.AppProperties;
import java.util.List;
import org.junit.jupiter.api.Test;

class JwtServiceTest {

    private static final String SECRET = "test-secret-key-with-at-least-32-characters";

    @Test
    void generatedTokenContainsUsernameAndIsValidForSameUser() {
        JwtService jwtService = jwtService(60_000L);
        User user = user("merchant@example.test");

        String token = jwtService.generateToken(user);

        assertThat(jwtService.extractUsername(token)).isEqualTo("merchant@example.test");
        assertThat(jwtService.isTokenValid(token, user)).isTrue();
    }

    @Test
    void generatedTokenIsNotValidForDifferentUser() {
        JwtService jwtService = jwtService(60_000L);
        String token = jwtService.generateToken(user("merchant@example.test"));

        assertThat(jwtService.isTokenValid(token, user("other@example.test"))).isFalse();
    }

    private JwtService jwtService(long expirationMs) {
        AppProperties.JwtProperties jwt = new AppProperties.JwtProperties(SECRET, expirationMs);
        AppProperties properties = new AppProperties("ca", List.of("ca", "es", "en"), jwt);
        return new JwtService(properties);
    }

    private User user(String username) {
        User user = new User();
        user.setUsername(username);
        user.setPassword("encoded");
        user.setRole(Role.ROLE_MERCHANT);
        return user;
    }
}
