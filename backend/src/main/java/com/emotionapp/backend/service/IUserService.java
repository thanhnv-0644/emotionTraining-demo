package com.emotionapp.backend.service;

import com.emotionapp.backend.dto.request.AdminUpdateUserRequest;
import com.emotionapp.backend.dto.request.ChangePasswordRequest;
import com.emotionapp.backend.dto.request.UpdateProfileRequest;
import com.emotionapp.backend.dto.response.UserResponse;
import com.emotionapp.backend.entity.User;

import java.util.List;

public interface IUserService {
    UserResponse getMe(String userId);
    List<UserResponse> getAllUsers();
    void deleteUser(String userId);
    UserResponse adminUpdateUser(String userId, AdminUpdateUserRequest request);
    void changePassword(String userId, ChangePasswordRequest request);
    UserResponse updateProfile(String userId, UpdateProfileRequest request);
    User getUserEntityById(String userId);
    void addXp(String userId, int xpGain);
}
