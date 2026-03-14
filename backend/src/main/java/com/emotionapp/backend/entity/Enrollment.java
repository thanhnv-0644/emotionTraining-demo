package com.emotionapp.backend.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "enrollments")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Enrollment {

    @Id
    @Column(name = "id", length = 30)
    private String id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "userId", nullable = false)
    private User user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "courseId", nullable = false)
    private Course course;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "paymentId")
    private Payment payment;

    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false)
    private Status status;

    @Column(name = "createdAt")
    private LocalDateTime createdAt;

    public enum Status {
        active, revoked
    }
}
