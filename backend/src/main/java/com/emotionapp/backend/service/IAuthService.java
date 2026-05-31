package com.emotionapp.backend.service;

import com.emotionapp.backend.dto.request.LoginRequest;
import com.emotionapp.backend.dto.request.RegisterRequest;
import com.emotionapp.backend.dto.response.AuthResponse;

public interface IAuthService {
    AuthResponse register(RegisterRequest request);
    AuthResponse login(LoginRequest request);
}
