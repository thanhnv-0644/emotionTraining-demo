package com.emotionapp.backend.service;

import com.emotionapp.backend.dto.response.AuthResponse;
import com.emotionapp.backend.entity.User;

public interface ITokenService {
    String createRefreshToken(User user);
    AuthResponse refreshToken(String rawRefreshToken);
    void logout(String rawRefreshToken);
}
