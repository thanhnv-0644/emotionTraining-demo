SET FOREIGN_KEY_CHECKS = 0;
SET NAMES utf8mb4;

-- ============================================================
-- TABLE: users
-- ============================================================
CREATE TABLE `users` (
  `id`           VARCHAR(30)  NOT NULL,
  `name`         VARCHAR(255) NOT NULL,
  `email`        VARCHAR(255) NOT NULL,
  `passwordHash` VARCHAR(255)     NULL COMMENT 'NULL nếu đăng nhập bằng OAuth',
  `avatar`       VARCHAR(500)     NULL,
  `role`         ENUM('student','instructor','admin') NOT NULL DEFAULT 'student',
  `xp`           INT          NOT NULL DEFAULT 0,
  `lastActiveAt` DATETIME         NULL,
  `status`       ENUM('active','inactive','suspended') NOT NULL DEFAULT 'active',
  `createdAt`    DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt`    DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `deletedAt`    DATETIME         NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_users_email` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- TABLE: refresh_tokens
-- ============================================================
CREATE TABLE `refresh_tokens` (
  `id`        VARCHAR(30)  NOT NULL,
  `userId`    VARCHAR(30)  NOT NULL,
  `token`     VARCHAR(512) NOT NULL,
  `expiresAt` DATETIME     NOT NULL,
  `revokedAt` DATETIME         NULL,
  `createdAt` DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_refresh_tokens_token` (`token`),
  CONSTRAINT `fk_refresh_tokens_user` FOREIGN KEY (`userId`) REFERENCES `users` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- TABLE: courses
-- ============================================================
CREATE TABLE `courses` (
  `id`          VARCHAR(30)  NOT NULL,
  `title`       VARCHAR(255) NOT NULL,
  `description` TEXT             NULL,
  `image`       VARCHAR(500)     NULL,
  `price`       INT          NOT NULL DEFAULT 0,
  `isFree`      TINYINT(1)   NOT NULL DEFAULT 0,
  `status`      ENUM('draft','published','archived') NOT NULL DEFAULT 'draft',
  `category`    ENUM('easy','medium','advanced')     NOT NULL DEFAULT 'easy',
  `createdAt`   DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt`   DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `deletedAt`   DATETIME         NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- TABLE: lessons
-- ============================================================
CREATE TABLE `lessons` (
  `id`        VARCHAR(30)  NOT NULL,
  `courseId`  VARCHAR(30)  NOT NULL,
  `title`     VARCHAR(255) NOT NULL,
  `order`     INT          NOT NULL DEFAULT 0,
  `level`     ENUM('beginner','intermediate','advanced') NOT NULL DEFAULT 'beginner',
  `duration`  INT              NULL COMMENT 'seconds',
  `status`    ENUM('draft','published') NOT NULL DEFAULT 'draft',
  `createdAt` DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `deletedAt` DATETIME         NULL,
  PRIMARY KEY (`id`),
  CONSTRAINT `fk_lessons_course` FOREIGN KEY (`courseId`) REFERENCES `courses` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- TABLE: audio_clips
-- ============================================================
CREATE TABLE `audio_clips` (
  `id`            VARCHAR(30)  NOT NULL,
  `lessonId`      VARCHAR(30)  NOT NULL,
  `subject`       VARCHAR(255) NOT NULL,
  `audioUrl`      VARCHAR(500) NOT NULL,
  `duration`      INT              NULL COMMENT 'seconds',
  `targetEmotion` ENUM('happiness','sadness','anger','fear','surprise','disgust','neutral') NOT NULL,
  `order`         INT          NOT NULL DEFAULT 0,
  `createdAt`     DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt`     DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `deletedAt`     DATETIME         NULL,
  PRIMARY KEY (`id`),
  CONSTRAINT `fk_audio_clips_lesson` FOREIGN KEY (`lessonId`) REFERENCES `lessons` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- TABLE: payments
-- ============================================================
CREATE TABLE `payments` (
  `id`              VARCHAR(30)  NOT NULL,
  `userId`          VARCHAR(30)  NOT NULL,
  `courseId`        VARCHAR(30)  NOT NULL,
  `amount`          INT          NOT NULL,
  `currency`        VARCHAR(10)  NOT NULL DEFAULT 'VND',
  `method`          ENUM('momo','vnpay','stripe','bank') NOT NULL,
  `status`          ENUM('pending','completed','failed','cancelled','expired','refunded') NOT NULL DEFAULT 'pending',
  `transactionId`   VARCHAR(255)     NULL,
  `gatewayResponse` JSON             NULL,
  `paidAt`          DATETIME         NULL,
  `failureReason`   TEXT             NULL,
  `expiredAt`       DATETIME         NULL,
  `createdAt`       DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt`       DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  CONSTRAINT `fk_payments_user`   FOREIGN KEY (`userId`)   REFERENCES `users` (`id`),
  CONSTRAINT `fk_payments_course` FOREIGN KEY (`courseId`) REFERENCES `courses` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- TABLE: enrollments
-- ============================================================
CREATE TABLE `enrollments` (
  `id`        VARCHAR(30) NOT NULL,
  `userId`    VARCHAR(30) NOT NULL,
  `courseId`  VARCHAR(30) NOT NULL,
  `paymentId` VARCHAR(30)     NULL COMMENT 'NULL nếu course miễn phí hoặc admin grant',
  `status`    ENUM('active','revoked') NOT NULL DEFAULT 'active',
  `createdAt` DATETIME    NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` DATETIME    NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_enrollments_user_course` (`userId`, `courseId`),
  CONSTRAINT `fk_enrollments_user`    FOREIGN KEY (`userId`)    REFERENCES `users` (`id`),
  CONSTRAINT `fk_enrollments_course`  FOREIGN KEY (`courseId`)  REFERENCES `courses` (`id`),
  CONSTRAINT `fk_enrollments_payment` FOREIGN KEY (`paymentId`) REFERENCES `payments` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- TABLE: user_progresses
-- ============================================================
CREATE TABLE `user_progresses` (
  `id`            VARCHAR(30) NOT NULL,
  `userId`        VARCHAR(30) NOT NULL,
  `lessonId`      VARCHAR(30) NOT NULL,
  `attemptNumber` INT         NOT NULL DEFAULT 1,
  `score`         INT              NULL,
  `completedAt`   DATETIME         NULL,
  `answers`       JSON             NULL,
  `createdAt`     DATETIME    NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  CONSTRAINT `fk_user_progresses_user`   FOREIGN KEY (`userId`)   REFERENCES `users` (`id`),
  CONSTRAINT `fk_user_progresses_lesson` FOREIGN KEY (`lessonId`) REFERENCES `lessons` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- TABLE: reviews
-- ============================================================
CREATE TABLE `reviews` (
  `id`        VARCHAR(30) NOT NULL,
  `userId`    VARCHAR(30) NOT NULL,
  `courseId`  VARCHAR(30) NOT NULL,
  `rating`    TINYINT     NOT NULL COMMENT '1-5 sao',
  `comment`   TEXT            NULL,
  `createdAt` DATETIME    NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` DATETIME    NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `deletedAt` DATETIME        NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_reviews_user_course` (`userId`, `courseId`),
  CONSTRAINT `fk_reviews_user`   FOREIGN KEY (`userId`)   REFERENCES `users` (`id`),
  CONSTRAINT `fk_reviews_course` FOREIGN KEY (`courseId`) REFERENCES `courses` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- TABLE: wishlists
-- ============================================================
CREATE TABLE `wishlists` (
  `id`        VARCHAR(30) NOT NULL,
  `userId`    VARCHAR(30) NOT NULL,
  `courseId`  VARCHAR(30) NOT NULL,
  `createdAt` DATETIME    NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `deletedAt` DATETIME        NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_wishlists_user_course` (`userId`, `courseId`),
  CONSTRAINT `fk_wishlists_user`   FOREIGN KEY (`userId`)   REFERENCES `users` (`id`),
  CONSTRAINT `fk_wishlists_course` FOREIGN KEY (`courseId`) REFERENCES `courses` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

SET FOREIGN_KEY_CHECKS = 1;

CREATE TABLE `search_histories` (
  `id`        VARCHAR(30)  NOT NULL,
  `userId`    VARCHAR(30)  NOT NULL,
  `keyword`   VARCHAR(255) NOT NULL,
  `createdAt` DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `deletedAt` DATETIME         NULL,
  PRIMARY KEY (`id`),
  CONSTRAINT `fk_search_user` FOREIGN KEY (`userId`) REFERENCES `users` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
