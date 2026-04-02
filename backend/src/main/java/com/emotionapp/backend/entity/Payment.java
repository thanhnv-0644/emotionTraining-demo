package com.emotionapp.backend.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "payments")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Payment {

    @Id
    @Column(name = "id", length = 30)
    private String id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "userId", nullable = false)
    private User user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "courseId", nullable = false)
    private Course course;

    @Column(name = "amount")
    private Integer amount;

    @Column(name = "currency", length = 10)
    private String currency;

    @Enumerated(EnumType.STRING)
    @Column(name = "method")
    private Method method;

    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false)
    private Status status;

    @Column(name = "transactionId")
    private String transactionId;

    @Column(name = "gatewayResponse", columnDefinition = "json")
    private String gatewayResponse;

    @Column(name = "paidAt")
    private LocalDateTime paidAt;

    @Column(name = "failureReason")
    private String failureReason;

    @Column(name = "createdAt")
    private LocalDateTime createdAt;

    @Column(name = "expiredAt")
    private LocalDateTime expiredAt;

    @Column(name = "updatedAt")
    private LocalDateTime updatedAt;

    public enum Method {
        momo, vnpay
    }

    public enum Status {
        pending, completed, failed, cancelled, expired, refunded
    }
}
