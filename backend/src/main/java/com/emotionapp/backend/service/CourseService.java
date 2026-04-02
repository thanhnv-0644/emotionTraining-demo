package com.emotionapp.backend.service;

import com.emotionapp.backend.dto.request.CreateCourseRequest;
import com.emotionapp.backend.dto.request.UpdateCourseRequest;
import com.emotionapp.backend.dto.response.CourseDetailResponse;
import com.emotionapp.backend.dto.response.CourseResponse;
import com.emotionapp.backend.dto.response.LessonResponse;
import com.emotionapp.backend.entity.AudioClip;
import com.emotionapp.backend.entity.Course;
import com.emotionapp.backend.entity.Lesson;
import com.emotionapp.backend.exception.AppException;
import com.emotionapp.backend.repository.AudioClipRepository;
import com.emotionapp.backend.repository.CourseRepository;
import com.emotionapp.backend.repository.EnrollmentRepository;
import com.emotionapp.backend.repository.LessonRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CourseService {

    private final CourseRepository courseRepository;
    private final LessonRepository lessonRepository;
    private final AudioClipRepository audioClipRepository;
    private final EnrollmentRepository enrollmentRepository;

    public List<CourseResponse> getAllPublished() {
        return courseRepository.findByStatusAndDeletedAtIsNull(Course.Status.published)
                .stream()
                .map(c -> toCourseResponse(c, null))
                .collect(Collectors.toList());
    }

    public CourseDetailResponse getCourseById(String id, String userId) {
        Course course = courseRepository.findById(id)
                .orElseThrow(() -> new AppException(HttpStatus.NOT_FOUND, "Course not found"));

        List<Lesson> lessons = lessonRepository.findByCourseIdOrderByOrder(id);
        boolean enrolled = userId != null && enrollmentRepository.existsByUserIdAndCourseId(userId, id);

        List<LessonResponse> lessonResponses = lessons.stream()
                .map(l -> toLessonResponse(l))
                .collect(Collectors.toList());

        return CourseDetailResponse.builder()
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
                .lessonCount(lessons.size())
                .lessons(lessonResponses)
                .build();
    }

    @Transactional
    public CourseResponse createCourse(CreateCourseRequest request) {
        Course.Category category;
        try {
            category = Course.Category.valueOf(request.getCategory());
        } catch (IllegalArgumentException e) {
            throw new AppException(HttpStatus.BAD_REQUEST, "Invalid category: " + request.getCategory());
        }

        Course course = Course.builder()
                .id(IdGenerator.generateId())
                .title(request.getTitle())
                .description(request.getDescription())
                .image(request.getImage())
                .price(request.getPrice())
                .isFree(request.getPrice() == 0)
                .status(Course.Status.draft)
                .category(category)
                .createdAt(LocalDateTime.now())
                .updatedAt(LocalDateTime.now())
                .build();

        courseRepository.save(course);
        return toCourseResponse(course, null);
    }

    @Transactional
    public CourseResponse updateCourse(String id, UpdateCourseRequest request) {
        Course course = courseRepository.findById(id)
                .orElseThrow(() -> new AppException(HttpStatus.NOT_FOUND, "Course not found"));

        if (request.getTitle() != null) course.setTitle(request.getTitle());
        if (request.getDescription() != null) course.setDescription(request.getDescription());
        if (request.getImage() != null) course.setImage(request.getImage());
        course.setPrice(request.getPrice());
        course.setFree(request.getPrice() == 0);

        if (request.getStatus() != null) {
            try {
                course.setStatus(Course.Status.valueOf(request.getStatus()));
            } catch (IllegalArgumentException e) {
                throw new AppException(HttpStatus.BAD_REQUEST, "Invalid status: " + request.getStatus());
            }
        }
        if (request.getCategory() != null) {
            try {
                course.setCategory(Course.Category.valueOf(request.getCategory()));
            } catch (IllegalArgumentException e) {
                throw new AppException(HttpStatus.BAD_REQUEST, "Invalid category: " + request.getCategory());
            }
        }
        course.setUpdatedAt(LocalDateTime.now());

        courseRepository.save(course);
        return toCourseResponse(course, null);
    }

    @Transactional
    public void deleteCourse(String id) {
        Course course = courseRepository.findById(id)
                .orElseThrow(() -> new AppException(HttpStatus.NOT_FOUND, "Course not found"));

        LocalDateTime now = LocalDateTime.now();

        // Delete all audio clips of all lessons in this course
        List<Lesson> lessons = lessonRepository.findByCourseId(id);
        for (Lesson lesson : lessons) {
            List<AudioClip> audioClips = audioClipRepository.findByLessonId(lesson.getId());
            for (AudioClip clip : audioClips) {
                clip.setDeletedAt(now);
                clip.setUpdatedAt(now);
                audioClipRepository.save(clip);
            }
            // Delete lesson
            lesson.setDeletedAt(now);
            lesson.setUpdatedAt(now);
            lessonRepository.save(lesson);
        }

        // Delete course
        course.setDeletedAt(now);
        course.setUpdatedAt(now);
        courseRepository.save(course);
    }

    public List<CourseResponse> getAllForAdmin() {
        return courseRepository.findByDeletedAtIsNull()
                .stream()
                .map(c -> toCourseResponse(c, null))
                .collect(Collectors.toList());
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

    private LessonResponse toLessonResponse(Lesson lesson) {
        int clipCount = audioClipRepository.findByLessonIdOrderByOrder(lesson.getId()).size();
        return LessonResponse.builder()
                .id(lesson.getId())
                .courseId(lesson.getCourse().getId())
                .title(lesson.getTitle())
                .order(lesson.getOrder())
                .level(lesson.getLevel() != null ? lesson.getLevel().name() : null)
                .duration(lesson.getDuration())
                .status(lesson.getStatus().name())
                .audioClipCount(clipCount)
                .build();
    }
}
