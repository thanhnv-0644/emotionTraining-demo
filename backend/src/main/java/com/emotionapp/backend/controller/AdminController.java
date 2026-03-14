package com.emotionapp.backend.controller;

import com.emotionapp.backend.dto.request.CreateAudioClipRequest;
import com.emotionapp.backend.dto.request.CreateCourseRequest;
import com.emotionapp.backend.dto.request.CreateLessonRequest;
import com.emotionapp.backend.dto.request.UpdateAudioClipRequest;
import com.emotionapp.backend.dto.request.UpdateCourseRequest;
import com.emotionapp.backend.dto.request.UpdateLessonRequest;
import com.emotionapp.backend.dto.response.ApiResponse;
import com.emotionapp.backend.dto.response.AudioClipResponse;
import com.emotionapp.backend.dto.response.CourseResponse;
import com.emotionapp.backend.dto.response.LessonResponse;
import com.emotionapp.backend.dto.response.UserResponse;
import com.emotionapp.backend.service.AudioClipService;
import com.emotionapp.backend.service.CourseService;
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
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
public class AdminController {

    private final CourseService courseService;
    private final LessonService lessonService;
    private final AudioClipService audioClipService;
    private final UserService userService;

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

    @PostMapping("/lessons/{lessonId}/audio-clips")
    public ResponseEntity<ApiResponse<AudioClipResponse>> createClip(
            @PathVariable String lessonId,
            @RequestBody CreateAudioClipRequest request) {
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

    @PutMapping("/users/{id}/status")
    public ResponseEntity<ApiResponse<UserResponse>> updateUserStatus(
            @PathVariable String id,
            @RequestBody Map<String, String> body) {
        String status = body.get("status");
        return ResponseEntity.ok(ApiResponse.success("User status updated", userService.updateUserStatus(id, status)));
    }
}
