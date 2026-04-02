package com.emotionapp.backend.service;

import com.emotionapp.backend.dto.request.CreateReviewRequest;
import com.emotionapp.backend.dto.request.UpdateReviewRequest;
import com.emotionapp.backend.dto.response.ReviewResponse;
import com.emotionapp.backend.entity.Course;
import com.emotionapp.backend.entity.Review;
import com.emotionapp.backend.entity.User;
import com.emotionapp.backend.exception.AppException;
import com.emotionapp.backend.repository.CourseRepository;
import com.emotionapp.backend.repository.EnrollmentRepository;
import com.emotionapp.backend.repository.ReviewRepository;
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
public class ReviewService {

    private final ReviewRepository reviewRepository;
    private final CourseRepository courseRepository;
    private final UserRepository userRepository;
    private final EnrollmentRepository enrollmentRepository;

    public List<ReviewResponse> getReviewsByCourse(String courseId) {
        return reviewRepository.findByCourseIdAndDeletedAtIsNullOrderByCreatedAtDesc(courseId)
                .stream()
                .map(this::toReviewResponse)
                .collect(Collectors.toList());
    }

    @Transactional
    public ReviewResponse createReview(String courseId, String userId, CreateReviewRequest request) {
        Course course = courseRepository.findById(courseId)
                .orElseThrow(() -> new AppException(HttpStatus.NOT_FOUND, "Course not found"));

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new AppException(HttpStatus.NOT_FOUND, "User not found"));

        // Check if user is enrolled in the course
        boolean enrolled = enrollmentRepository.existsByUserIdAndCourseId(userId, courseId);
        if (!enrolled) {
            throw new AppException(HttpStatus.FORBIDDEN, "You must be enrolled in this course to leave a review");
        }

        LocalDateTime now = LocalDateTime.now();

        // Check if user already has a review (including deleted ones)
        var existingReview = reviewRepository.findByUserIdAndCourseId(userId, courseId);

        if (existingReview.isPresent()) {
            // Restore old review
            Review review = existingReview.get();
            review.setRating(request.getRating());
            review.setComment(request.getComment());
            review.setDeletedAt(null);
            review.setUpdatedAt(now);
            reviewRepository.save(review);
            return toReviewResponse(review);
        } else {
            // Create new review
            Review review = Review.builder()
                    .id(IdGenerator.generateId())
                    .user(user)
                    .course(course)
                    .rating(request.getRating())
                    .comment(request.getComment())
                    .createdAt(now)
                    .updatedAt(now)
                    .build();

            reviewRepository.save(review);
            return toReviewResponse(review);
        }
    }

    @Transactional
    public ReviewResponse updateReview(String courseId, String userId, UpdateReviewRequest request) {
        Review review = reviewRepository.findByUserIdAndCourseIdAndDeletedAtIsNull(userId, courseId)
                .orElseThrow(() -> new AppException(HttpStatus.NOT_FOUND, "Review not found"));

        if (request.getRating() != null) {
            review.setRating(request.getRating());
        }
        if (request.getComment() != null) {
            review.setComment(request.getComment());
        }
        review.setUpdatedAt(LocalDateTime.now());

        reviewRepository.save(review);
        return toReviewResponse(review);
    }

    @Transactional
    public void deleteReview(String courseId, String userId) {
        Review review = reviewRepository.findByUserIdAndCourseIdAndDeletedAtIsNull(userId, courseId)
                .orElseThrow(() -> new AppException(HttpStatus.NOT_FOUND, "Review not found"));

        review.setDeletedAt(LocalDateTime.now());
        review.setUpdatedAt(LocalDateTime.now());
        reviewRepository.save(review);
    }

    private ReviewResponse toReviewResponse(Review review) {
        return ReviewResponse.builder()
                .id(review.getId())
                .userId(review.getUser().getId())
                .userName(review.getUser().getName())
                .rating(review.getRating())
                .comment(review.getComment())
                .createdAt(review.getCreatedAt())
                .updatedAt(review.getUpdatedAt())
                .build();
    }
}

