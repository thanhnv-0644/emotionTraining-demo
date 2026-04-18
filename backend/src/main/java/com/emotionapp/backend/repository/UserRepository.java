package com.emotionapp.backend.repository;

import com.emotionapp.backend.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, String> {
    Optional<User> findByEmail(String email);
    List<User> findByDeletedAtIsNull();
    List<User> findByCreatedAtAfterAndDeletedAtIsNull(LocalDateTime after);
}
