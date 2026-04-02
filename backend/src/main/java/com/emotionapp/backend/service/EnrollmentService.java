package com.emotionapp.backend.service;

import com.emotionapp.backend.dto.request.AdminEnrollRequest;
import com.emotionapp.backend.dto.response.CourseResponse;
import com.emotionapp.backend.dto.response.EnrollmentResponse;
import com.emotionapp.backend.entity.Course;
import com.emotionapp.backend.entity.Enrollment;
import com.emotionapp.backend.entity.User;
import com.emotionapp.backend.exception.AppException;
import com.emotionapp.backend.repository.CourseRepository;
import com.emotionapp.backend.repository.EnrollmentRepository;
import com.emotionapp.backend.repository.LessonRepository;
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
public class EnrollmentService {

    private final EnrollmentRepository enrollmentRepository;
    private final CourseRepository courseRepository;
    private final UserRepository userRepository;
    private final LessonRepository lessonRepository;

    @Transactional
    public CourseResponse enrollFree(String userId, String courseId) {
        Course course = courseRepository.findById(courseId)
                .orElseThrow(() -> new AppException(HttpStatus.NOT_FOUND, "Course not found"));

        if (!course.isFree()) {
            throw new AppException(HttpStatus.BAD_REQUEST, "This course is not free. Payment required.");
        }

        if (course.getStatus() != Course.Status.published) {
            throw new AppException(HttpStatus.BAD_REQUEST, "Course is not available for enrollment");
        }

        if (enrollmentRepository.existsByUserIdAndCourseId(userId, courseId)) {
            throw new AppException(HttpStatus.CONFLICT, "Already enrolled in this course");
        }

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new AppException(HttpStatus.NOT_FOUND, "User not found"));

        Enrollment enrollment = Enrollment.builder()
                .id(IdGenerator.generateId())
                .user(user)
                .course(course)
                .status(Enrollment.Status.active)
                .createdAt(LocalDateTime.now())
                .build();

        enrollmentRepository.save(enrollment);
        return toCourseResponse(course, userId);
    }

    public List<CourseResponse> getMyEnrollments(String userId) {
        return enrollmentRepository.findByUserId(userId)
                .stream()
                .filter(e -> e.getStatus() == Enrollment.Status.active)
                .map(e -> toCourseResponse(e.getCourse(), userId))
                .collect(Collectors.toList());
    }

    // ─── Admin APIs ───────────────────────────────────────────────────────────

    public List<EnrollmentResponse> adminGetAllEnrollments(String userId, String courseId) {
        List<Enrollment> enrollments;
        if (userId != null) {
            enrollments = enrollmentRepository.findByUserId(userId);
        } else if (courseId != null) {
            enrollments = enrollmentRepository.findByCourseId(courseId);
        } else {
            enrollments = enrollmentRepository.findAll();
        }
        return enrollments.stream().map(this::toEnrollmentResponse).collect(Collectors.toList());
    }

    @Transactional
    public EnrollmentResponse adminEnroll(AdminEnrollRequest request) {
        String userId   = request.getUserId();
        String courseId = request.getCourseId();

        userRepository.findById(userId)
                .orElseThrow(() -> new AppException(HttpStatus.NOT_FOUND, "User not found"));
        courseRepository.findById(courseId)
                .orElseThrow(() -> new AppException(HttpStatus.NOT_FOUND, "Course not found"));

        if (enrollmentRepository.existsByUserIdAndCourseId(userId, courseId)) {
            throw new AppException(HttpStatus.CONFLICT, "User already enrolled in this course");
        }

        User user     = userRepository.findById(userId).get();
        Course course = courseRepository.findById(courseId).get();

        LocalDateTime now = LocalDateTime.now();
        Enrollment enrollment = Enrollment.builder()
                .id(IdGenerator.generateId())
                .user(user)
                .course(course)
                .status(Enrollment.Status.active)
                .createdAt(now)
                .updatedAt(now)
                .build();

        enrollmentRepository.save(enrollment);
        return toEnrollmentResponse(enrollment);
    }

    @Transactional
    public void adminRevokeEnrollment(String enrollmentId) {
        Enrollment enrollment = enrollmentRepository.findById(enrollmentId)
                .orElseThrow(() -> new AppException(HttpStatus.NOT_FOUND, "Enrollment not found"));
        if (enrollment.getStatus() == Enrollment.Status.revoked) {
            throw new AppException(HttpStatus.CONFLICT, "Enrollment already revoked");
        }
        enrollment.setStatus(Enrollment.Status.revoked);
        enrollment.setUpdatedAt(LocalDateTime.now());
        enrollmentRepository.save(enrollment);
    }

    private EnrollmentResponse toEnrollmentResponse(Enrollment e) {
        return EnrollmentResponse.builder()
                .id(e.getId())
                .userId(e.getUser().getId())
                .userName(e.getUser().getName())
                .courseId(e.getCourse().getId())
                .courseTitle(e.getCourse().getTitle())
                .paymentId(e.getPayment() != null ? e.getPayment().getId() : null)
                .status(e.getStatus().name())
                .createdAt(e.getCreatedAt())
                .updatedAt(e.getUpdatedAt())
                .build();
    }

    private CourseResponse toCourseResponse(Course course, String userId) {
        int lessonCount = lessonRepository.findByCourseIdOrderByOrder(course.getId()).size();
        boolean enrolled = userId != null && enrollmentRepository.existsByUserIdAndCourseId(userId, course.getId());
        return CourseResponse.builder()
                .id(course.getId())
                .title(course.getTitle())
                .description(course.getDescription())
                .image(course.getImage())
                .price(course.getPrice())
                .isFree(course.isFree())
                .status(course.getStatus().name())
                .category(course.getCategory().name())
                .createdAt(course.getCreatedAt())
                .enrolled(enrolled)
                .lessonCount(lessonCount)
                .build();
    }
}
