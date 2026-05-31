package com.emotionapp.backend.service;

import com.emotionapp.backend.dto.response.AuthResponse;
import com.emotionapp.backend.dto.response.UserResponse;
import com.emotionapp.backend.entity.RefreshToken;
import com.emotionapp.backend.entity.User;
import com.emotionapp.backend.exception.AppException;
import com.emotionapp.backend.repository.RefreshTokenRepository;
import com.emotionapp.backend.security.IJwtService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class TokenServiceImpl implements ITokenService {

    private static final long REFRESH_TOKEN_EXP_MS = 604_800_000L;

    private final RefreshTokenRepository refreshTokenRepository;
    private final IJwtService jwtService;

    @Override
    @Transactional
    public String createRefreshToken(User user) {
        String rawToken = jwtService.generateRefreshToken(user.getId());

        RefreshToken entity = RefreshToken.builder()
                .id(IdGenerator.generateId())
                .user(user)
                .token(rawToken)
                .expiresAt(LocalDateTime.now().plusNanos(REFRESH_TOKEN_EXP_MS * 1_000_000L))
                .createdAt(LocalDateTime.now())
                .build();

        refreshTokenRepository.save(entity);
        return rawToken;
    }

    @Override
    @Transactional
    public AuthResponse refreshToken(String rawRefreshToken) {
        RefreshToken stored = refreshTokenRepository.findByToken(rawRefreshToken)
                .orElseThrow(() -> new AppException(HttpStatus.UNAUTHORIZED, "Invalid refresh token"));

        if (stored.getRevokedAt() != null) {
            throw new AppException(HttpStatus.UNAUTHORIZED, "Refresh token has been revoked");
        }

        if (stored.getExpiresAt().isBefore(LocalDateTime.now())) {
            throw new AppException(HttpStatus.UNAUTHORIZED, "Refresh token has expired");
        }

        User user = stored.getUser();
        String newAccessToken = jwtService.generateAccessToken(user.getId(), user.getRole().name());

        return AuthResponse.builder()
                .accessToken(newAccessToken)
                .refreshToken(rawRefreshToken)
                .user(toUserResponse(user))
                .build();
    }

    @Override
    @Transactional
    public void logout(String rawRefreshToken) {
        refreshTokenRepository.findByToken(rawRefreshToken).ifPresent(token -> {
            token.setRevokedAt(LocalDateTime.now());
            refreshTokenRepository.save(token);
        });
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
