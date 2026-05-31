package com.emotionapp.backend.security;

public interface IJwtService {
    String generateAccessToken(String userId, String role);
    String generateRefreshToken(String userId);
    String getUserIdFromToken(String token);
    String getRoleFromToken(String token);
    boolean isTokenValid(String token);
}
