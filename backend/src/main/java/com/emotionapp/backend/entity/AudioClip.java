package com.emotionapp.backend.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "audio_clips")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AudioClip {

    @Id
    @Column(name = "id", length = 30)
    private String id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "lessonId", nullable = false)
    private Lesson lesson;

    @Column(name = "subject")
    private String subject;

    @Column(name = "audioUrl")
    private String audioUrl;

    @Column(name = "duration")
    private Integer duration;

    @Column(name = "emotions", columnDefinition = "TEXT")
    private String emotions;

    @Column(name = "`order`")
    private Integer order;

    @Column(name = "createdAt")
    private LocalDateTime createdAt;

    @Column(name = "updatedAt")
    private LocalDateTime updatedAt;

    @Column(name = "deletedAt")
    private LocalDateTime deletedAt;

}
