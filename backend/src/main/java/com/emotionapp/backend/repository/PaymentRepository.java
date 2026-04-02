package com.emotionapp.backend.repository;

import com.emotionapp.backend.entity.Payment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface PaymentRepository extends JpaRepository<Payment, String> {
    List<Payment> findByUserId(String userId);
    Optional<Payment> findByUserIdAndCourseIdAndStatus(String userId, String courseId, Payment.Status status);
    List<Payment> findByStatusAndExpiredAtBefore(Payment.Status status, LocalDateTime now);
    List<Payment> findByStatusAndCreatedAtBefore(Payment.Status status, LocalDateTime threshold);
    Optional<Payment> findByTransactionId(String transactionId);
}
