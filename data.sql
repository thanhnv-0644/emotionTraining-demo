
-- =============================================
-- USERS
-- =============================================
INSERT INTO users (id, name, email, passwordHash, avatar, role, xp, lastActiveAt, status, createdAt) VALUES
('user_001', 'Nguyễn Văn An', 'an@gmail.com', '$2a$10$abc123hashedpassword', NULL, 'student', 0, NOW(), 'active', NOW()),
('user_002', 'Trần Thị Bình', 'binh@gmail.com', '$2a$10$abc123hashedpassword', NULL, 'student', 150, NOW(), 'active', NOW()),
('user_003', 'Admin User', 'admin@gmail.com', '$2a$10$abc123hashedpassword', NULL, 'admin', 0, NOW(), 'active', NOW());

-- =============================================
-- COURSES
-- =============================================
INSERT INTO courses (id, title, description, image, price, isFree, status, category, createdAt, updatedAt) VALUES
('course_001', 'Nhận diện cảm xúc cơ bản', 'Học cách nhận diện 6 cảm xúc cơ bản qua giọng nói', NULL, 0, 1, 'published', 'easy', NOW(), NOW()),
('course_002', 'Cảm xúc nâng cao', 'Phân tích cảm xúc phức tạp trong giao tiếp', NULL, 99000, 0, 'published', 'medium', NOW(), NOW()),
('course_003', 'Chuyên sâu cảm xúc', 'Khóa học chuyên sâu dành cho chuyên gia', NULL, 299000, 0, 'published', 'advanced', NOW(), NOW());

-- =============================================
-- LESSONS
-- =============================================
INSERT INTO lessons (id, courseId, title, `order`, level, duration, status, createdAt, updatedAt) VALUES
('lesson_001', 'course_001', 'Giới thiệu về cảm xúc', 1, 'beginner', 300, 'published', NOW(), NOW()),
('lesson_002', 'course_001', 'Nhận diện niềm vui', 2, 'beginner', 450, 'published', NOW(), NOW()),
('lesson_003', 'course_001', 'Nhận diện nỗi buồn', 3, 'beginner', 450, 'published', NOW(), NOW()),
('lesson_004', 'course_002', 'Cảm xúc hỗn hợp', 1, 'intermediate', 600, 'published', NOW(), NOW()),
('lesson_005', 'course_002', 'Cảm xúc trong công việc', 2, 'intermediate', 600, 'published', NOW(), NOW());

-- =============================================
-- AUDIO CLIPS
-- =============================================
INSERT INTO audio_clips (id, lessonId, subject, audioUrl, duration, targetEmotion, `order`) VALUES
('clip_001', 'lesson_001', 'Giọng nói trung tính', '/uploads/audio/clip_001.mp3', 10, 'neutral', 1),
('clip_002', 'lesson_002', 'Giọng nói vui vẻ 1', '/uploads/audio/clip_002.mp3', 8, 'happiness', 1),
('clip_003', 'lesson_002', 'Giọng nói vui vẻ 2', '/uploads/audio/clip_003.mp3', 12, 'happiness', 2),
('clip_004', 'lesson_003', 'Giọng nói buồn 1', '/uploads/audio/clip_004.mp3', 9, 'sadness', 1),
('clip_005', 'lesson_003', 'Giọng nói tức giận', '/uploads/audio/clip_005.mp3', 11, 'anger', 2);

-- =============================================
-- PAYMENTS
-- =============================================
INSERT INTO payments (id, userId, courseId, amount, currency, method, status, transactionId, paidAt, expiredAt, createdAt, updatedAt) VALUES
('pay_001', 'user_002', 'course_002', 99000,  'VND', 'momo',  'completed', 'TXN001', NOW(), NULL,                                NOW(), NOW()),
('pay_002', 'user_002', 'course_003', 299000, 'VND', 'vnpay', 'pending',   NULL,     NULL,  DATE_ADD(NOW(), INTERVAL 15 MINUTE), NOW(), NOW());

-- =============================================
-- ENROLLMENTS
-- =============================================
INSERT INTO enrollments (id, userId, courseId, paymentId, status, createdAt) VALUES
('enroll_001', 'user_001', 'course_001', NULL, 'active', NOW()),  -- free course
('enroll_002', 'user_002', 'course_001', NULL, 'active', NOW()),  -- free course
('enroll_003', 'user_002', 'course_002', 'pay_001', 'active', NOW());

-- =============================================
-- USER PROGRESSES
-- =============================================
INSERT INTO user_progresses (id, userId, lessonId, attemptNumber, score, completedAt, answers, createdAt) VALUES
('prog_001', 'user_001', 'lesson_001', 1, 80, NOW(), '{"answers":[{"audioClipId":"clip_001","userAnswer":"neutral","correctAnswer":"neutral","isCorrect":true}]}', NOW()),
('prog_002', 'user_002', 'lesson_001', 1, 100, NOW(), '{"answers":[{"audioClipId":"clip_001","userAnswer":"neutral","correctAnswer":"neutral","isCorrect":true}]}', NOW()),
('prog_003', 'user_002', 'lesson_002', 1, 50, NULL, '{"answers":[{"audioClipId":"clip_002","userAnswer":"sadness","correctAnswer":"happiness","isCorrect":false}]}', NOW());

-- =============================================
-- REVIEWS
-- =============================================
INSERT INTO reviews (id, userId, courseId, rating, comment, createdAt, updatedAt) VALUES
('review_001', 'user_002', 'course_001', 5, 'Khóa học rất hay, dễ hiểu!', NOW(), NOW()),
('review_002', 'user_001', 'course_001', 4, 'Nội dung tốt nhưng cần thêm bài tập', NOW(), NOW());

-- =============================================
-- WISHLISTS
-- =============================================
INSERT INTO wishlists (id, userId, courseId, createdAt) VALUES
('wish_001', 'user_001', 'course_002', NOW()),
('wish_002', 'user_001', 'course_003', NOW()),
('wish_003', 'user_002', 'course_003', NOW());

-- =============================================
-- REFRESH TOKENS
-- =============================================
INSERT INTO refresh_tokens (id, userId, token, expiresAt, createdAt) VALUES
('token_001', 'user_001', 'sample-refresh-token-user001', DATE_ADD(NOW(), INTERVAL 7 DAY), NOW()),
('token_002', 'user_002', 'sample-refresh-token-user002', DATE_ADD(NOW(), INTERVAL 7 DAY), NOW());

-- =============================================
-- SEARCH HISTORIES
-- =============================================
INSERT INTO search_histories (id, userId, keyword, createdAt) VALUES
('search_001', 'user_001', 'nhận diện cảm xúc', DATE_SUB(NOW(), INTERVAL 5 DAY)),
('search_002', 'user_001', 'khóa học giọng nói', DATE_SUB(NOW(), INTERVAL 4 DAY)),
('search_003', 'user_001', 'cảm xúc vui vẻ', DATE_SUB(NOW(), INTERVAL 3 DAY)),
('search_004', 'user_002', 'cảm xúc nâng cao', DATE_SUB(NOW(), INTERVAL 5 DAY)),
('search_005', 'user_002', 'phân tích cảm xúc', DATE_SUB(NOW(), INTERVAL 4 DAY)),
('search_006', 'user_002', 'nhận diện nỗi buồn', DATE_SUB(NOW(), INTERVAL 3 DAY)),
('search_007', 'user_002', 'cảm xúc hỗn hợp', DATE_SUB(NOW(), INTERVAL 2 DAY)),
('search_008', 'user_001', 'giao tiếp cảm xúc', DATE_SUB(NOW(), INTERVAL 1 DAY)),
('search_009', 'user_002', 'cảm xúc trong công việc', NOW()),
('search_010', 'user_001', 'khóa chuyên sâu', NOW());

-- =============================================
-- DATA MẪU: n5qQYjGnLyC7pk0sFQAQGkM0wO
-- =============================================

-- PAYMENTS
INSERT INTO payments (id, userId, courseId, amount, currency, method, status, transactionId, paidAt, expiredAt, createdAt, updatedAt) VALUES
('pay_003', 'n5qQYjGnLyC7pk0sFQAQGkM0wO', 'course_002', 99000, 'VND', 'momo', 'completed', 'TXN003', DATE_SUB(NOW(), INTERVAL 6 DAY), NULL, DATE_SUB(NOW(), INTERVAL 6 DAY), DATE_SUB(NOW(), INTERVAL 6 DAY));

-- ENROLLMENTS
INSERT INTO enrollments (id, userId, courseId, paymentId, status, createdAt) VALUES
('enroll_004', 'n5qQYjGnLyC7pk0sFQAQGkM0wO', 'course_001', NULL,      'active', DATE_SUB(NOW(), INTERVAL 7 DAY)),
('enroll_005', 'n5qQYjGnLyC7pk0sFQAQGkM0wO', 'course_002', 'pay_003', 'active', DATE_SUB(NOW(), INTERVAL 6 DAY));

-- USER PROGRESSES
INSERT INTO user_progresses (id, userId, lessonId, attemptNumber, score, completedAt, answers, createdAt) VALUES
-- lesson_001 (beginner): thử lần 1 thất bại, lần 2 hoàn thành
('prog_004', 'n5qQYjGnLyC7pk0sFQAQGkM0wO', 'lesson_001', 1, 60, DATE_SUB(NOW(), INTERVAL 6 DAY),
 '{"answers":[{"audioClipId":"clip_001","userAnswer":"happiness","correctAnswer":"neutral","isCorrect":false}]}',
 DATE_SUB(NOW(), INTERVAL 6 DAY)),
('prog_005', 'n5qQYjGnLyC7pk0sFQAQGkM0wO', 'lesson_001', 2, 100, DATE_SUB(NOW(), INTERVAL 5 DAY),
 '{"answers":[{"audioClipId":"clip_001","userAnswer":"neutral","correctAnswer":"neutral","isCorrect":true}]}',
 DATE_SUB(NOW(), INTERVAL 5 DAY)),
-- lesson_002 (beginner): hoàn thành, 1 đúng 1 sai
('prog_006', 'n5qQYjGnLyC7pk0sFQAQGkM0wO', 'lesson_002', 1, 75, DATE_SUB(NOW(), INTERVAL 4 DAY),
 '{"answers":[{"audioClipId":"clip_002","userAnswer":"happiness","correctAnswer":"happiness","isCorrect":true},{"audioClipId":"clip_003","userAnswer":"sadness","correctAnswer":"happiness","isCorrect":false}]}',
 DATE_SUB(NOW(), INTERVAL 4 DAY)),
-- lesson_003 (beginner): hoàn thành hoàn hảo
('prog_007', 'n5qQYjGnLyC7pk0sFQAQGkM0wO', 'lesson_003', 1, 100, DATE_SUB(NOW(), INTERVAL 3 DAY),
 '{"answers":[{"audioClipId":"clip_004","userAnswer":"sadness","correctAnswer":"sadness","isCorrect":true},{"audioClipId":"clip_005","userAnswer":"anger","correctAnswer":"anger","isCorrect":true}]}',
 DATE_SUB(NOW(), INTERVAL 3 DAY)),
-- lesson_004 (intermediate): đang làm, chưa hoàn thành
('prog_008', 'n5qQYjGnLyC7pk0sFQAQGkM0wO', 'lesson_004', 1, NULL, NULL,
 '{"answers":[]}',
 DATE_SUB(NOW(), INTERVAL 1 DAY));

-- REVIEWS
INSERT INTO reviews (id, userId, courseId, rating, comment, createdAt, updatedAt) VALUES
('review_003', 'n5qQYjGnLyC7pk0sFQAQGkM0wO', 'course_001', 5, 'Khóa học rất bổ ích, giúp tôi nhận biết cảm xúc tốt hơn!', DATE_SUB(NOW(), INTERVAL 2 DAY), DATE_SUB(NOW(), INTERVAL 2 DAY));

-- WISHLISTS
INSERT INTO wishlists (id, userId, courseId, createdAt) VALUES
('wish_004', 'n5qQYjGnLyC7pk0sFQAQGkM0wO', 'course_003', DATE_SUB(NOW(), INTERVAL 3 DAY));

-- SEARCH HISTORIES
INSERT INTO search_histories (id, userId, keyword, createdAt) VALUES
('search_011', 'n5qQYjGnLyC7pk0sFQAQGkM0wO', 'nhận diện cảm xúc',        DATE_SUB(NOW(), INTERVAL 7 DAY)),
('search_012', 'n5qQYjGnLyC7pk0sFQAQGkM0wO', 'khóa học cảm xúc cơ bản',   DATE_SUB(NOW(), INTERVAL 6 DAY)),
('search_013', 'n5qQYjGnLyC7pk0sFQAQGkM0wO', 'niềm vui giọng nói',         DATE_SUB(NOW(), INTERVAL 4 DAY)),
('search_014', 'n5qQYjGnLyC7pk0sFQAQGkM0wO', 'cảm xúc nâng cao',           DATE_SUB(NOW(), INTERVAL 2 DAY)),
('search_015', 'n5qQYjGnLyC7pk0sFQAQGkM0wO', 'khóa chuyên sâu cảm xúc',   DATE_SUB(NOW(), INTERVAL 1 DAY));
