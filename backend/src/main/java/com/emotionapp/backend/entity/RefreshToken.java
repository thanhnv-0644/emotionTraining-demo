package com.emotionapp.backend.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "refresh_tokens")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class RefreshToken {

    @Id
    @Column(name = "id", length = 30)
    private String id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "userId", nullable = false)
    private User user;

    @Column(name = "token", nullable = false, unique = true, length = 512)
    private String token;

    @Column(name = "expiresAt", nullable = false)
    private LocalDateTime expiresAt;

    @Column(name = "revokedAt")
    private LocalDateTime revokedAt;

    @Column(name = "createdAt")
    private LocalDateTime createdAt;
}
