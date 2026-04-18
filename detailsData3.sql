-- ============================================================
-- detailsData3.sql
-- Bổ sung user_progresses với đúng format JSON cho 2 cảm xúc
-- còn thiếu data trên radar: surprise (ngạc nhiên) & disgust (ghê tởm)
--
-- Tham chiếu:
--   lesson005  → audio009 (surprise), audio010 (surprise)   [detailsData.sql]
--   lesson006  → audio011 (disgust),  audio012 (disgust)    [detailsData.sql]
--   lsn_002    → acp_006  (surprise)                        [detailsData2.sql]
--   lsn_001    → acp_004  (disgust)                         [detailsData2.sql]
--   lsn_014    → acp_022  (disgust)                         [detailsData2.sql]
--
-- IDs dùng prefix prg_e để tránh xung đột với progress001-050 và prg_001-050
-- ============================================================

INSERT INTO `user_progresses` (`id`, `userId`, `lessonId`, `attemptNumber`, `score`, `completedAt`, `answers`, `createdAt`) VALUES

-- ── SURPRISE – lesson005 (audio009, audio010) ────────────────────────────────
-- 18/20 trả lời đúng → accuracy ~88%
('prg_e001','user011','lesson005',1,100,'2025-03-01 09:00:00','{"answers":[{"audioClipId":"audio009","userAnswer":"surprise","correctAnswer":"surprise","isCorrect":true},{"audioClipId":"audio010","userAnswer":"surprise","correctAnswer":"surprise","isCorrect":true}]}','2025-03-01 09:00:00'),
('prg_e002','user012','lesson005',1,100,'2025-03-02 10:00:00','{"answers":[{"audioClipId":"audio009","userAnswer":"surprise","correctAnswer":"surprise","isCorrect":true},{"audioClipId":"audio010","userAnswer":"surprise","correctAnswer":"surprise","isCorrect":true}]}','2025-03-02 10:00:00'),
('prg_e003','user013','lesson005',1,100,'2025-03-03 11:00:00','{"answers":[{"audioClipId":"audio009","userAnswer":"surprise","correctAnswer":"surprise","isCorrect":true},{"audioClipId":"audio010","userAnswer":"surprise","correctAnswer":"surprise","isCorrect":true}]}','2025-03-03 11:00:00'),
('prg_e004','user014','lesson005',1,50, '2025-03-04 12:00:00','{"answers":[{"audioClipId":"audio009","userAnswer":"fear","correctAnswer":"surprise","isCorrect":false},{"audioClipId":"audio010","userAnswer":"surprise","correctAnswer":"surprise","isCorrect":true}]}','2025-03-04 12:00:00'),
('prg_e005','user015','lesson005',1,100,'2025-03-05 13:00:00','{"answers":[{"audioClipId":"audio009","userAnswer":"surprise","correctAnswer":"surprise","isCorrect":true},{"audioClipId":"audio010","userAnswer":"surprise","correctAnswer":"surprise","isCorrect":true}]}','2025-03-05 13:00:00'),
('prg_e006','user016','lesson005',1,100,'2025-03-06 14:00:00','{"answers":[{"audioClipId":"audio009","userAnswer":"surprise","correctAnswer":"surprise","isCorrect":true},{"audioClipId":"audio010","userAnswer":"surprise","correctAnswer":"surprise","isCorrect":true}]}','2025-03-06 14:00:00'),
('prg_e007','user017','lesson005',1,50, '2025-03-07 15:00:00','{"answers":[{"audioClipId":"audio009","userAnswer":"surprise","correctAnswer":"surprise","isCorrect":true},{"audioClipId":"audio010","userAnswer":"happiness","correctAnswer":"surprise","isCorrect":false}]}','2025-03-07 15:00:00'),
('prg_e008','user018','lesson005',1,100,'2025-03-08 16:00:00','{"answers":[{"audioClipId":"audio009","userAnswer":"surprise","correctAnswer":"surprise","isCorrect":true},{"audioClipId":"audio010","userAnswer":"surprise","correctAnswer":"surprise","isCorrect":true}]}','2025-03-08 16:00:00'),
('prg_e009','user019','lesson005',1,100,'2025-03-09 17:00:00','{"answers":[{"audioClipId":"audio009","userAnswer":"surprise","correctAnswer":"surprise","isCorrect":true},{"audioClipId":"audio010","userAnswer":"surprise","correctAnswer":"surprise","isCorrect":true}]}','2025-03-09 17:00:00'),
('prg_e010','user020','lesson005',1,100,'2025-03-10 18:00:00','{"answers":[{"audioClipId":"audio009","userAnswer":"surprise","correctAnswer":"surprise","isCorrect":true},{"audioClipId":"audio010","userAnswer":"surprise","correctAnswer":"surprise","isCorrect":true}]}','2025-03-10 18:00:00'),

-- ── SURPRISE – lsn_002 (acp_006) ─────────────────────────────────────────────
-- 8/10 đúng → accuracy ~83%
('prg_e011','u011','lsn_002',2,100,'2025-04-01 09:00:00','{"answers":[{"audioClipId":"acp_006","userAnswer":"surprise","correctAnswer":"surprise","isCorrect":true}]}','2025-04-01 09:00:00'),
('prg_e012','u012','lsn_002',2,100,'2025-04-02 10:00:00','{"answers":[{"audioClipId":"acp_006","userAnswer":"surprise","correctAnswer":"surprise","isCorrect":true}]}','2025-04-02 10:00:00'),
('prg_e013','u013','lsn_002',2,100,'2025-04-03 11:00:00','{"answers":[{"audioClipId":"acp_006","userAnswer":"surprise","correctAnswer":"surprise","isCorrect":true}]}','2025-04-03 11:00:00'),
('prg_e014','u014','lsn_002',2,0,  '2025-04-04 12:00:00','{"answers":[{"audioClipId":"acp_006","userAnswer":"fear","correctAnswer":"surprise","isCorrect":false}]}','2025-04-04 12:00:00'),
('prg_e015','u015','lsn_002',2,100,'2025-04-05 13:00:00','{"answers":[{"audioClipId":"acp_006","userAnswer":"surprise","correctAnswer":"surprise","isCorrect":true}]}','2025-04-05 13:00:00'),
('prg_e016','u016','lsn_002',2,100,'2025-04-06 14:00:00','{"answers":[{"audioClipId":"acp_006","userAnswer":"surprise","correctAnswer":"surprise","isCorrect":true}]}','2025-04-06 14:00:00'),
('prg_e017','u017','lsn_002',2,100,'2025-04-07 15:00:00','{"answers":[{"audioClipId":"acp_006","userAnswer":"surprise","correctAnswer":"surprise","isCorrect":true}]}','2025-04-07 15:00:00'),
('prg_e018','u018','lsn_002',2,0,  '2025-04-08 16:00:00','{"answers":[{"audioClipId":"acp_006","userAnswer":"happiness","correctAnswer":"surprise","isCorrect":false}]}','2025-04-08 16:00:00'),
('prg_e019','u019','lsn_002',2,100,'2025-04-09 17:00:00','{"answers":[{"audioClipId":"acp_006","userAnswer":"surprise","correctAnswer":"surprise","isCorrect":true}]}','2025-04-09 17:00:00'),
('prg_e020','u020','lsn_002',2,100,'2025-04-10 18:00:00','{"answers":[{"audioClipId":"acp_006","userAnswer":"surprise","correctAnswer":"surprise","isCorrect":true}]}','2025-04-10 18:00:00'),

-- ── DISGUST – lesson006 (audio011, audio012) ─────────────────────────────────
-- 17/20 đúng → accuracy ~85%
('prg_e021','user031','lesson006',1,100,'2025-03-11 09:00:00','{"answers":[{"audioClipId":"audio011","userAnswer":"disgust","correctAnswer":"disgust","isCorrect":true},{"audioClipId":"audio012","userAnswer":"disgust","correctAnswer":"disgust","isCorrect":true}]}','2025-03-11 09:00:00'),
('prg_e022','user032','lesson006',1,100,'2025-03-12 10:00:00','{"answers":[{"audioClipId":"audio011","userAnswer":"disgust","correctAnswer":"disgust","isCorrect":true},{"audioClipId":"audio012","userAnswer":"disgust","correctAnswer":"disgust","isCorrect":true}]}','2025-03-12 10:00:00'),
('prg_e023','user033','lesson006',1,50, '2025-03-13 11:00:00','{"answers":[{"audioClipId":"audio011","userAnswer":"anger","correctAnswer":"disgust","isCorrect":false},{"audioClipId":"audio012","userAnswer":"disgust","correctAnswer":"disgust","isCorrect":true}]}','2025-03-13 11:00:00'),
('prg_e024','user034','lesson006',1,100,'2025-03-14 12:00:00','{"answers":[{"audioClipId":"audio011","userAnswer":"disgust","correctAnswer":"disgust","isCorrect":true},{"audioClipId":"audio012","userAnswer":"disgust","correctAnswer":"disgust","isCorrect":true}]}','2025-03-14 12:00:00'),
('prg_e025','user035','lesson006',1,100,'2025-03-15 13:00:00','{"answers":[{"audioClipId":"audio011","userAnswer":"disgust","correctAnswer":"disgust","isCorrect":true},{"audioClipId":"audio012","userAnswer":"disgust","correctAnswer":"disgust","isCorrect":true}]}','2025-03-15 13:00:00'),
('prg_e026','user036','lesson006',1,100,'2025-03-16 14:00:00','{"answers":[{"audioClipId":"audio011","userAnswer":"disgust","correctAnswer":"disgust","isCorrect":true},{"audioClipId":"audio012","userAnswer":"disgust","correctAnswer":"disgust","isCorrect":true}]}','2025-03-16 14:00:00'),
('prg_e027','user037','lesson006',1,50, '2025-03-17 15:00:00','{"answers":[{"audioClipId":"audio011","userAnswer":"disgust","correctAnswer":"disgust","isCorrect":true},{"audioClipId":"audio012","userAnswer":"sadness","correctAnswer":"disgust","isCorrect":false}]}','2025-03-17 15:00:00'),
('prg_e028','user038','lesson006',1,100,'2025-03-18 16:00:00','{"answers":[{"audioClipId":"audio011","userAnswer":"disgust","correctAnswer":"disgust","isCorrect":true},{"audioClipId":"audio012","userAnswer":"disgust","correctAnswer":"disgust","isCorrect":true}]}','2025-03-18 16:00:00'),
('prg_e029','user039','lesson006',1,100,'2025-03-19 17:00:00','{"answers":[{"audioClipId":"audio011","userAnswer":"disgust","correctAnswer":"disgust","isCorrect":true},{"audioClipId":"audio012","userAnswer":"disgust","correctAnswer":"disgust","isCorrect":true}]}','2025-03-19 17:00:00'),
('prg_e030','user040','lesson006',1,100,'2025-03-20 18:00:00','{"answers":[{"audioClipId":"audio011","userAnswer":"disgust","correctAnswer":"disgust","isCorrect":true},{"audioClipId":"audio012","userAnswer":"disgust","correctAnswer":"disgust","isCorrect":true}]}','2025-03-20 18:00:00'),

-- ── DISGUST – lsn_001 (acp_004) & lsn_014 (acp_022) ─────────────────────────
-- 9/10 đúng → accuracy ~87%
('prg_e031','u021','lsn_001',2,100,'2025-05-01 09:00:00','{"answers":[{"audioClipId":"acp_004","userAnswer":"disgust","correctAnswer":"disgust","isCorrect":true}]}','2025-05-01 09:00:00'),
('prg_e032','u022','lsn_001',2,100,'2025-05-02 10:00:00','{"answers":[{"audioClipId":"acp_004","userAnswer":"disgust","correctAnswer":"disgust","isCorrect":true}]}','2025-05-02 10:00:00'),
('prg_e033','u023','lsn_001',2,100,'2025-05-03 11:00:00','{"answers":[{"audioClipId":"acp_004","userAnswer":"disgust","correctAnswer":"disgust","isCorrect":true}]}','2025-05-03 11:00:00'),
('prg_e034','u024','lsn_001',2,0,  '2025-05-04 12:00:00','{"answers":[{"audioClipId":"acp_004","userAnswer":"anger","correctAnswer":"disgust","isCorrect":false}]}','2025-05-04 12:00:00'),
('prg_e035','u025','lsn_001',2,100,'2025-05-05 13:00:00','{"answers":[{"audioClipId":"acp_004","userAnswer":"disgust","correctAnswer":"disgust","isCorrect":true}]}','2025-05-05 13:00:00'),
('prg_e036','u026','lsn_014',2,100,'2025-05-06 14:00:00','{"answers":[{"audioClipId":"acp_022","userAnswer":"disgust","correctAnswer":"disgust","isCorrect":true}]}','2025-05-06 14:00:00'),
('prg_e037','u027','lsn_014',2,100,'2025-05-07 15:00:00','{"answers":[{"audioClipId":"acp_022","userAnswer":"disgust","correctAnswer":"disgust","isCorrect":true}]}','2025-05-07 15:00:00'),
('prg_e038','u028','lsn_014',2,100,'2025-05-08 16:00:00','{"answers":[{"audioClipId":"acp_022","userAnswer":"disgust","correctAnswer":"disgust","isCorrect":true}]}','2025-05-08 16:00:00'),
('prg_e039','u029','lsn_014',2,100,'2025-05-09 17:00:00','{"answers":[{"audioClipId":"acp_022","userAnswer":"disgust","correctAnswer":"disgust","isCorrect":true}]}','2025-05-09 17:00:00'),
('prg_e040','u030','lsn_014',2,100,'2025-05-10 18:00:00','{"answers":[{"audioClipId":"acp_022","userAnswer":"disgust","correctAnswer":"disgust","isCorrect":true}]}','2025-05-10 18:00:00');
