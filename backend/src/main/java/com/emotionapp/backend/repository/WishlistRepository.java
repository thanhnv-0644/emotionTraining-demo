package com.emotionapp.backend.repository;

import com.emotionapp.backend.entity.Wishlist;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface WishlistRepository extends JpaRepository<Wishlist, String> {
    List<Wishlist> findByUserId(String userId);
    boolean existsByUserIdAndCourseId(String userId, String courseId);

    @Modifying
    @Query("DELETE FROM Wishlist w WHERE w.user.id = :userId AND w.course.id = :courseId")
    void deleteByUserIdAndCourseId(String userId, String courseId);
}
