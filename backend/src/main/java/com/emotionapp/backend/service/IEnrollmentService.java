package com.emotionapp.backend.service;

import com.emotionapp.backend.dto.request.AdminEnrollRequest;
import com.emotionapp.backend.dto.response.CourseResponse;
import com.emotionapp.backend.dto.response.EnrollmentResponse;

import java.util.List;

public interface IEnrollmentService {
    CourseResponse enrollFree(String userId, String courseId);
    List<CourseResponse> getMyEnrollments(String userId);
    List<EnrollmentResponse> adminGetAllEnrollments(String userId, String courseId);
    EnrollmentResponse adminEnroll(AdminEnrollRequest request);
    void adminRevokeEnrollment(String enrollmentId);
}
