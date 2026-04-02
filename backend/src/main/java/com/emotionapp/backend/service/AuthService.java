package com.emotionapp.backend.service;

import com.emotionapp.backend.dto.request.LoginRequest;
import com.emotionapp.backend.dto.request.RegisterRequest;
import com.emotionapp.backend.dto.response.AuthResponse;
import com.emotionapp.backend.dto.response.UserResponse;
import com.emotionapp.backend.entity.RefreshToken;
import com.emotionapp.backend.entity.User;
import com.emotionapp.backend.exception.AppException;
import com.emotionapp.backend.repository.RefreshTokenRepository;
import com.emotionapp.backend.repository.UserRepository;
import com.emotionapp.backend.security.JwtUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final RefreshTokenRepository refreshTokenRepository;
    private final JwtUtil jwtUtil;
    private final PasswordEncoder passwordEncoder;

    @Transactional
    public AuthResponse register(RegisterRequest request) {
        if (userRepository.findByEmail(request.getEmail()).isPresent()) {
            throw new AppException(HttpStatus.CONFLICT, "Email already in use");
        }

        User user = User.builder()
                .id(IdGenerator.generateId())
                .name(request.getName())
                .email(request.getEmail())
                .passwordHash(passwordEncoder.encode(request.getPassword()))
                .role(User.Role.student)
                .xp(0)
                .status(User.Status.active)
                .createdAt(LocalDateTime.now())
                .build();

        userRepository.save(user);

        return buildAuthResponse(user);
    }

    @Transactional
    public AuthResponse login(LoginRequest request) {
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new AppException(HttpStatus.UNAUTHORIZED, "Invalid email or password"));

        if (!passwordEncoder.matches(request.getPassword(), user.getPasswordHash())) {
            throw new AppException(HttpStatus.UNAUTHORIZED, "Invalid email or password");
        }

        if (user.getDeletedAt() != null) {
            throw new AppException(HttpStatus.FORBIDDEN, "Account has been deactivated");
        }

        if (user.getStatus() == User.Status.suspended) {
            throw new AppException(HttpStatus.FORBIDDEN, "Account is suspended");
        }

        user.setLastActiveAt(LocalDateTime.now());
        userRepository.save(user);

        return buildAuthResponse(user);
    }

    @Transactional
    public AuthResponse refreshToken(String rawRefreshToken) {
        RefreshToken storedToken = refreshTokenRepository.findByToken(rawRefreshToken)
                .orElseThrow(() -> new AppException(HttpStatus.UNAUTHORIZED, "Invalid refresh token"));

        if (storedToken.getRevokedAt() != null) {
            throw new AppException(HttpStatus.UNAUTHORIZED, "Refresh token has been revoked");
        }

        if (storedToken.getExpiresAt().isBefore(LocalDateTime.now())) {
            throw new AppException(HttpStatus.UNAUTHORIZED, "Refresh token has expired");
        }

        User user = storedToken.getUser();
        String newAccessToken = jwtUtil.generateAccessToken(user.getId(), user.getRole().name());

        UserResponse userResponse = toUserResponse(user);
        return AuthResponse.builder()
                .accessToken(newAccessToken)
                .refreshToken(rawRefreshToken)
                .user(userResponse)
                .build();
    }

    @Transactional
    public void logout(String rawRefreshToken) {
        refreshTokenRepository.findByToken(rawRefreshToken).ifPresent(token -> {
            token.setRevokedAt(LocalDateTime.now());
            refreshTokenRepository.save(token);
        });
    }

    private AuthResponse buildAuthResponse(User user) {
        String accessToken = jwtUtil.generateAccessToken(user.getId(), user.getRole().name());
        String rawRefreshToken = jwtUtil.generateRefreshToken(user.getId());

        long refreshExpMs = 604800000L;
        RefreshToken refreshToken = RefreshToken.builder()
                .id(IdGenerator.generateId())
                .user(user)
                .token(rawRefreshToken)
                .expiresAt(LocalDateTime.now().plusNanos(refreshExpMs * 1_000_000L))
                .createdAt(LocalDateTime.now())
                .build();

        refreshTokenRepository.save(refreshToken);

        return AuthResponse.builder()
                .accessToken(accessToken)
                .refreshToken(rawRefreshToken)
                .user(toUserResponse(user))
                .build();
    }

    private UserResponse toUserResponse(User user) {
        return UserResponse.builder()
                .id(user.getId())
                .name(user.getName())
                .email(user.getEmail())
                .avatar(user.getAvatar())
                .role(user.getRole().name())
                .xp(user.getXp())
                .status(user.getStatus().name())
                .build();
    }
}
