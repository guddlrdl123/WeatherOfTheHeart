-- 1. 마스터 데이터: 사물 카탈로그
INSERT INTO object_catalogs (object_key, object_name, mood, slot_key, image_url) VALUES
                                                                                  ('window_chair', '창가 의자', 'quiet', 'window', '/objects/window-chair.png'),
                                                                                  ('small_plant', '작은 식물', 'warm', 'floor', '/objects/small-plant.png'),
                                                                                  ('old_radio', '오래된 라디오', 'longing', 'desk', '/objects/old-radio.png'),
                                                                                  ('desk_lamp', '스탠드 조명', 'uneasy', 'desk', '/objects/desk-lamp.png'),
                                                                                  ('mug_cup', '머그컵', 'warm', 'desk', '/objects/mug-cup.png'),
                                                                                  ('letter', '편지', 'longing', 'wall', '/objects/letter.png'),
                                                                                  ('poster', '포스터', 'warm', 'wall', '/objects/poster.png'),
                                                                                  ('rug', '러그', 'quiet', 'floor', '/objects/rug.png');

-- 2. 마스터 데이터: 슬롯 고정 위치
INSERT INTO object_slots (slot_key, slot_name, position_x, position_y) VALUES
                                                                           ('window', '창가', 280, 180),
                                                                           ('desk', '책상', 520, 330),
                                                                           ('wall', '벽', 420, 120),
                                                                           ('floor', '바닥', 360, 460),
                                                                           ('light', '조명', 600, 100);

-- 3. 테스트 유저 생성
INSERT INTO users (email, password, nickname) VALUES ('test@example.com', 'password1234', '구름');

-- 4. 2026년 6월 월별 방 생성
INSERT INTO private_rooms (user_id, year, month, title) VALUES (1, 2026, 6, '2026년 6월의 마음의 날씨');

-- 5. 6월 14일 일기(기억) 작성
INSERT INTO private_memories
(private_room_id, memory_date, title, content, mood_key, weather_key, object_key, slot_key)
VALUES
    (1, '2026-06-14', '비 냄새가 남은 저녁', '오늘은 이상하게 비 오는 냄새가 좋았다.', 'quiet', 'rain', 'window_chair', 'window');
