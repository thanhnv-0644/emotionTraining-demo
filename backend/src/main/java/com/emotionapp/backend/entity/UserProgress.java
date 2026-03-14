package com.emotionapp.backend.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "user_progresses")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UserProgress {

    @Id
    @Column(name = "id", length = 30)
    private String id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "userId", nullable = false)
    private User user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "lessonId", nullable = false)
    private Lesson lesson;

    @Column(name = "attemptNumber")
    private Integer attemptNumber;

    @Column(name = "score")
    private Integer score;

    @Column(name = "completedAt")
    private LocalDateTime completedAt;

    @Column(name = "answers", columnDefinition = "json")
    private String answers;

    @Column(name = "createdAt")
    private LocalDateTime createdAt;
}
