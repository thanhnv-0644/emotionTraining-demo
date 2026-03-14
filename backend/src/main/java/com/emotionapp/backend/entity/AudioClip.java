package com.emotionapp.backend.entity;

import jakarta.persistence.*;
import lombok.*;

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

    @Enumerated(EnumType.STRING)
    @Column(name = "targetEmotion")
    private Emotion targetEmotion;

    @Column(name = "`order`")
    private Integer order;

    public enum Emotion {
        happiness, sadness, anger, fear, surprise, disgust, neutral
    }
}
