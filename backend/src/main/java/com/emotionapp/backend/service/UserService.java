package com.emotionapp.backend.service;

import com.emotionapp.backend.dto.request.AdminUpdateUserRequest;
import com.emotionapp.backend.dto.request.UpdateProfileRequest;
import com.emotionapp.backend.dto.response.UserResponse;
import com.emotionapp.backend.entity.User;
import com.emotionapp.backend.exception.AppException;
import com.emotionapp.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;

    public UserResponse getMe(String userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new AppException(HttpStatus.NOT_FOUND, "User not found"));
        return toResponse(user);
    }

    public List<UserResponse> getAllUsers() {
        return userRepository.findByDeletedAtIsNull()
                .stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    @Transactional
    public void deleteUser(String userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new AppException(HttpStatus.NOT_FOUND, "User not found"));
        if (user.getDeletedAt() != null) {
            throw new AppException(HttpStatus.CONFLICT, "User already deactivated");
        }
        LocalDateTime now = LocalDateTime.now();
        user.setDeletedAt(now);
        user.setUpdatedAt(now);
        userRepository.save(user);
    }

    @Transactional
    public UserResponse adminUpdateUser(String userId, AdminUpdateUserRequest request) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new AppException(HttpStatus.NOT_FOUND, "User not found"));

        if (request.getName() != null && !request.getName().isBlank()) {
            user.setName(request.getName());
        }

        if (request.getRole() != null) {
            try {
                user.setRole(User.Role.valueOf(request.getRole()));
            } catch (IllegalArgumentException e) {
                throw new AppException(HttpStatus.BAD_REQUEST, "Invalid role: " + request.getRole());
            }
        }

        if (request.getStatus() != null) {
            User.Status newStatus;
            try {
                newStatus = User.Status.valueOf(request.getStatus());
            } catch (IllegalArgumentException e) {
                throw new AppException(HttpStatus.BAD_REQUEST, "Invalid status: " + request.getStatus());
            }
            user.setStatus(newStatus);
            // Khôi phục tài khoản đã bị xoá mềm khi admin set active
            if (newStatus == User.Status.active) {
                user.setDeletedAt(null);
            }
        }

        if (request.getXp() != null) {
            if (request.getXp() < 0) {
                throw new AppException(HttpStatus.BAD_REQUEST, "XP cannot be negative");
            }
            user.setXp(request.getXp());
        }

        user.setUpdatedAt(LocalDateTime.now());
        userRepository.save(user);
        return toResponse(user);
    }

    @Transactional
    public UserResponse updateProfile(String userId, UpdateProfileRequest request) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new AppException(HttpStatus.NOT_FOUND, "User not found"));

        if (request.getName() != null && !request.getName().isBlank()) {
            user.setName(request.getName());
        }
        if (request.getAvatar() != null) {
            user.setAvatar(request.getAvatar());
        }
        user.setUpdatedAt(LocalDateTime.now());

        userRepository.save(user);
        return toResponse(user);
    }

    private UserResponse toResponse(User user) {
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
