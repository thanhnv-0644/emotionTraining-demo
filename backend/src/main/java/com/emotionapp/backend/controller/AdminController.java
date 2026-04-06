package com.emotionapp.backend.controller;

import com.emotionapp.backend.dto.request.AdminEnrollRequest;
import com.emotionapp.backend.dto.request.AdminUpdateUserRequest;
import com.emotionapp.backend.dto.request.CreateAudioClipRequest;
import com.emotionapp.backend.dto.request.CreateCourseRequest;
import com.emotionapp.backend.dto.request.CreateLessonRequest;
import com.emotionapp.backend.dto.request.UpdateAudioClipRequest;
import com.emotionapp.backend.dto.request.UpdateCourseRequest;
import com.emotionapp.backend.dto.request.UpdateLessonRequest;
import com.emotionapp.backend.dto.response.ApiResponse;
import com.emotionapp.backend.dto.response.AudioClipResponse;
import com.emotionapp.backend.dto.response.CourseResponse;
import com.emotionapp.backend.dto.response.EnrollmentResponse;
import com.emotionapp.backend.dto.response.LessonResponse;
import com.emotionapp.backend.dto.response.PaymentResponse;
import com.emotionapp.backend.dto.response.ProgressResponse;
import com.emotionapp.backend.dto.response.ReviewResponse;
import com.emotionapp.backend.dto.response.UserResponse;
import com.emotionapp.backend.dto.response.AdminAnalyticsResponse;
import com.emotionapp.backend.entity.Payment;
import com.emotionapp.backend.entity.Review;
import com.emotionapp.backend.entity.UserProgress;
import com.emotionapp.backend.repository.PaymentRepository;
import com.emotionapp.backend.repository.ReviewRepository;
import com.emotionapp.backend.repository.UserProgressRepository;
import com.emotionapp.backend.service.AnalyticsService;
import com.emotionapp.backend.service.AudioClipService;
import com.emotionapp.backend.service.EnrollmentService;
import com.emotionapp.backend.service.CourseService;
import com.emotionapp.backend.service.FileStorageService;
import com.emotionapp.backend.service.LessonService;
import com.emotionapp.backend.service.UserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
public class AdminController {

    private final CourseService courseService;
    private final LessonService lessonService;
    private final AudioClipService audioClipService;
    private final UserService userService;
    private final EnrollmentService enrollmentService;
    private final FileStorageService fileStorageService;
    private final AnalyticsService analyticsService;
    private final PaymentRepository paymentRepository;
    private final ReviewRepository reviewRepository;
    private final UserProgressRepository userProgressRepository;

    // ── Courses ──────────────────────────────────────────────────────────────

    @GetMapping("/courses")
    public ResponseEntity<ApiResponse<List<CourseResponse>>> getAllCourses() {
        return ResponseEntity.ok(ApiResponse.success(courseService.getAllForAdmin()));
    }

    @PostMapping("/courses")
    public ResponseEntity<ApiResponse<CourseResponse>> createCourse(
            @Valid @RequestBody CreateCourseRequest request) {
        return ResponseEntity.ok(ApiResponse.success("Course created", courseService.createCourse(request)));
    }

    @PutMapping("/courses/{id}")
    public ResponseEntity<ApiResponse<CourseResponse>> updateCourse(
            @PathVariable String id,
            @RequestBody UpdateCourseRequest request) {
        return ResponseEntity.ok(ApiResponse.success("Course updated", courseService.updateCourse(id, request)));
    }

    @DeleteMapping("/courses/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteCourse(@PathVariable String id) {
        courseService.deleteCourse(id);
        return ResponseEntity.ok(ApiResponse.success("Course archived", null));
    }

    // ── Lessons ───────────────────────────────────────────────────────────────

    @GetMapping("/courses/{courseId}/lessons")
    public ResponseEntity<ApiResponse<List<LessonResponse>>> getLessonsByCourse(
            @PathVariable String courseId) {
        return ResponseEntity.ok(ApiResponse.success(lessonService.getLessonsByCourse(courseId)));
    }

    @PostMapping("/courses/{courseId}/lessons")
    public ResponseEntity<ApiResponse<LessonResponse>> createLesson(
            @PathVariable String courseId,
            @Valid @RequestBody CreateLessonRequest request) {
        return ResponseEntity.ok(ApiResponse.success("Lesson created", lessonService.createLesson(courseId, request)));
    }

    @PutMapping("/lessons/{id}")
    public ResponseEntity<ApiResponse<LessonResponse>> updateLesson(
            @PathVariable String id,
            @RequestBody UpdateLessonRequest request) {
        return ResponseEntity.ok(ApiResponse.success("Lesson updated", lessonService.updateLesson(id, request)));
    }

    @DeleteMapping("/lessons/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteLesson(@PathVariable String id) {
        lessonService.deleteLesson(id);
        return ResponseEntity.ok(ApiResponse.success("Lesson deleted", null));
    }

    // ── Audio Clips ───────────────────────────────────────────────────────────

    @GetMapping("/lessons/{lessonId}/audio-clips")
    public ResponseEntity<ApiResponse<List<AudioClipResponse>>> getClipsByLesson(
            @PathVariable String lessonId) {
        return ResponseEntity.ok(ApiResponse.success(audioClipService.getClipsByLesson(lessonId)));
    }

    @PostMapping(value = "/lessons/{lessonId}/audio-clips", consumes = "multipart/form-data")
    public ResponseEntity<ApiResponse<AudioClipResponse>> createClip(
            @PathVariable String lessonId,
            @RequestParam("file") MultipartFile file,
            @RequestParam("subject") String subject,
            @RequestParam("targetEmotion") String targetEmotion,
            @RequestParam(value = "duration", required = false) Integer duration) throws IOException {
        String audioUrl = fileStorageService.saveFile(file);
        CreateAudioClipRequest request = new CreateAudioClipRequest();
        request.setSubject(subject);
        request.setAudioUrl(audioUrl);
        request.setTargetEmotion(targetEmotion);
        request.setDuration(duration);
        return ResponseEntity.ok(ApiResponse.success("Audio clip created", audioClipService.createClip(lessonId, request)));
    }

    @PutMapping("/audio-clips/{id}")
    public ResponseEntity<ApiResponse<AudioClipResponse>> updateClip(
            @PathVariable String id,
            @RequestBody UpdateAudioClipRequest request) {
        return ResponseEntity.ok(ApiResponse.success("Audio clip updated", audioClipService.updateClip(id, request)));
    }

    @DeleteMapping("/audio-clips/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteClip(@PathVariable String id) {
        audioClipService.deleteClip(id);
        return ResponseEntity.ok(ApiResponse.success("Audio clip deleted", null));
    }

    // ── Users ─────────────────────────────────────────────────────────────────

    @GetMapping("/users")
    public ResponseEntity<ApiResponse<List<UserResponse>>> getAllUsers() {
        return ResponseEntity.ok(ApiResponse.success(userService.getAllUsers()));
    }

    @PutMapping("/users/{id}")
    public ResponseEntity<ApiResponse<UserResponse>> updateUser(
            @PathVariable String id,
            @RequestBody AdminUpdateUserRequest request) {
        return ResponseEntity.ok(ApiResponse.success("User updated", userService.adminUpdateUser(id, request)));
    }

    @DeleteMapping("/users/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteUser(@PathVariable String id) {
        userService.deleteUser(id);
        return ResponseEntity.ok(ApiResponse.success("User deactivated", null));
    }

    // ── Enrollments ───────────────────────────────────────────────────────────

    @GetMapping("/enrollments")
    public ResponseEntity<ApiResponse<List<EnrollmentResponse>>> getAllEnrollments(
            @RequestParam(required = false) String userId,
            @RequestParam(required = false) String courseId) {
        return ResponseEntity.ok(ApiResponse.success(
                enrollmentService.adminGetAllEnrollments(userId, courseId)));
    }

    @PostMapping("/enrollments")
    public ResponseEntity<ApiResponse<EnrollmentResponse>> adminEnroll(
            @RequestBody AdminEnrollRequest request) {
        return ResponseEntity.ok(ApiResponse.success("Enrolled successfully",
                enrollmentService.adminEnroll(request)));
    }

    @DeleteMapping("/enrollments/{id}")
    public ResponseEntity<ApiResponse<Void>> revokeEnrollment(@PathVariable String id) {
        enrollmentService.adminRevokeEnrollment(id);
        return ResponseEntity.ok(ApiResponse.success("Enrollment revoked", null));
    }

    // ── Analytics ─────────────────────────────────────────────────────────────

    @GetMapping("/analytics")
    public ResponseEntity<ApiResponse<AdminAnalyticsResponse>> getAnalytics(
            @RequestParam(required = false) String from,
            @RequestParam(required = false) String to) {
        LocalDateTime fromDate = from != null ? LocalDateTime.parse(from + "T00:00:00") : null;
        LocalDateTime toDate   = to   != null ? LocalDateTime.parse(to   + "T23:59:59") : null;
        return ResponseEntity.ok(ApiResponse.success(analyticsService.getAdminAnalytics(fromDate, toDate)));
    }

    // ── Payments ──────────────────────────────────────────────────────────────

    @GetMapping("/payments")
    public ResponseEntity<ApiResponse<List<PaymentResponse>>> getAllPayments(
            @RequestParam(required = false) String status) {
        List<Payment> payments = status != null
                ? paymentRepository.findAll().stream()
                    .filter(p -> p.getStatus().name().equalsIgnoreCase(status))
                    .toList()
                : paymentRepository.findAll();
        List<PaymentResponse> result = payments.stream().map(p -> PaymentResponse.builder()
                .id(p.getId())
                .courseId(p.getCourse().getId())
                .courseTitle(p.getCourse().getTitle())
                .amount(p.getAmount())
                .currency(p.getCurrency())
                .method(p.getMethod() != null ? p.getMethod().name() : null)
                .status(p.getStatus().name())
                .transactionId(p.getTransactionId())
                .failureReason(p.getFailureReason())
                .paidAt(p.getPaidAt())
                .expiredAt(p.getExpiredAt())
                .createdAt(p.getCreatedAt())
                .build()).toList();
        return ResponseEntity.ok(ApiResponse.success(result));
    }

    // ── User Progress ─────────────────────────────────────────────────────────

    @GetMapping("/progress")
    public ResponseEntity<ApiResponse<List<ProgressResponse>>> getAllProgress(
            @RequestParam(required = false) String userId) {
        List<UserProgress> progresses = userId != null
                ? userProgressRepository.findByUserId(userId)
                : userProgressRepository.findByCompletedAtIsNotNull();
        List<ProgressResponse> result = progresses.stream().map(p -> ProgressResponse.builder()
                .id(p.getId())
                .userId(p.getUser().getId())
                .userName(p.getUser().getName())
                .lessonId(p.getLesson().getId())
                .lessonTitle(p.getLesson().getTitle())
                .attemptNumber(p.getAttemptNumber())
                .score(p.getScore())
                .completedAt(p.getCompletedAt())
                .answers(p.getAnswers())
                .createdAt(p.getCreatedAt())
                .build()).toList();
        return ResponseEntity.ok(ApiResponse.success(result));
    }

    // ── Reviews ───────────────────────────────────────────────────────────────

    @GetMapping("/reviews")
    public ResponseEntity<ApiResponse<List<ReviewResponse>>> getAllReviews(
            @RequestParam(required = false) String courseId) {
        List<Review> reviews = courseId != null
                ? reviewRepository.findByCourseIdAndDeletedAtIsNullOrderByCreatedAtDesc(courseId)
                : reviewRepository.findAll().stream()
                    .filter(r -> r.getDeletedAt() == null)
                    .toList();
        List<ReviewResponse> result = reviews.stream().map(r -> ReviewResponse.builder()
                .id(r.getId())
                .userId(r.getUser().getId())
                .userName(r.getUser().getName())
                .courseId(r.getCourse().getId())
                .courseTitle(r.getCourse().getTitle())
                .rating(r.getRating())
                .comment(r.getComment())
                .createdAt(r.getCreatedAt())
                .updatedAt(r.getUpdatedAt())
                .build()).toList();
        return ResponseEntity.ok(ApiResponse.success(result));
    }

    @DeleteMapping("/reviews/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteReview(@PathVariable String id) {
        Review review = reviewRepository.findById(id)
                .orElseThrow(() -> new com.emotionapp.backend.exception.AppException(
                        org.springframework.http.HttpStatus.NOT_FOUND, "Review not found"));
        review.setDeletedAt(java.time.LocalDateTime.now());
        reviewRepository.save(review);
        return ResponseEntity.ok(ApiResponse.success("Review deleted", null));
    }
}
