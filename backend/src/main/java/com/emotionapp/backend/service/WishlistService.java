package com.emotionapp.backend.service;

import com.emotionapp.backend.dto.response.WishlistResponse;
import com.emotionapp.backend.entity.Course;
import com.emotionapp.backend.entity.User;
import com.emotionapp.backend.entity.Wishlist;
import com.emotionapp.backend.exception.AppException;
import com.emotionapp.backend.repository.CourseRepository;
import com.emotionapp.backend.repository.UserRepository;
import com.emotionapp.backend.repository.WishlistRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class WishlistService {

    private final WishlistRepository wishlistRepository;
    private final CourseRepository courseRepository;
    private final UserRepository userRepository;

    public List<WishlistResponse> getMyWishlist(String userId) {
        return wishlistRepository.findByUserId(userId).stream()
                .filter(w -> w.getDeletedAt() == null)
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    @Transactional
    public WishlistResponse addToWishlist(String userId, String courseId) {
        if (wishlistRepository.existsByUserIdAndCourseId(userId, courseId)) {
            throw new AppException(HttpStatus.CONFLICT, "Course already in wishlist");
        }

        Course course = courseRepository.findById(courseId)
                .orElseThrow(() -> new AppException(HttpStatus.NOT_FOUND, "Course not found"));

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new AppException(HttpStatus.NOT_FOUND, "User not found"));

        Wishlist wishlist = Wishlist.builder()
                .id("wish_" + UUID.randomUUID().toString().replace("-", "").substring(0, 10))
                .user(user)
                .course(course)
                .createdAt(LocalDateTime.now())
                .build();

        wishlistRepository.save(wishlist);
        return toResponse(wishlist);
    }

    @Transactional
    public void removeFromWishlist(String userId, String courseId) {
        if (!wishlistRepository.existsByUserIdAndCourseId(userId, courseId)) {
            throw new AppException(HttpStatus.NOT_FOUND, "Course not found in wishlist");
        }
        wishlistRepository.deleteByUserIdAndCourseId(userId, courseId);
    }

    private WishlistResponse toResponse(Wishlist w) {
        Course course = w.getCourse();
        return WishlistResponse.builder()
                .courseId(course.getId())
                .title(course.getTitle())
                .description(course.getDescription())
                .image(course.getImage())
                .price(course.getPrice())
                .isFree(course.isFree())
                .category(course.getCategory().name())
                .addedAt(w.getCreatedAt())
                .build();
    }
}
