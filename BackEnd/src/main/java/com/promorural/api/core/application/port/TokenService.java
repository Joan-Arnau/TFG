package com.promorural.api.core.application.port;

import com.promorural.api.core.domain.entity.User;

public interface TokenService {

    String generateToken(User user);

    String extractUsername(String token);

    boolean isTokenValid(String token, User user);
}
