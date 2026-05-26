-- 1. 마스터 데이터: 사물 카탈로그
INSERT INTO room_objects (object_key, object_name, mood, slot_key, image_url) VALUES
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
INSERT INTO monthly_rooms (user_id, year, month, title) VALUES (1, 2026, 6, '2026년 6월의 마음의 날씨');

-- 5. 6월 14일 일기(기억) 작성
INSERT INTO memory_entries
(user_id, monthly_room_id, memory_date, content, room_title, mood, weather, lighting, palette, object_key, slot_key, message)
VALUES
    (1, 1, '2026-06-14', '오늘은 이상하게 비 오는 냄새가 좋았다.', '비 냄새가 남은 저녁', 'quiet', 'rain', 'blue_dim', 'blue_gray', 'window_chair', 'window', '창가에 조용한 기억이 남았습니다.');

-- 6. 일기 작성에 따른 사물 배치 연동 (ON DUPLICATE KEY UPDATE 추가로 슬롯 중복 에러 완전 방어)
INSERT INTO placed_objects (monthly_room_id, memory_entry_id, object_key, slot_key)
VALUES (1, LAST_INSERT_ID(), 'window_chair', 'window')
    ON DUPLICATE KEY UPDATE memory_entry_id = VALUES(memory_entry_id), object_key = VALUES(object_key);


/* ========================================================
   [Part 3] 백엔드 구현용 핵심 비즈니스 쿼리 (인자값 대응)
======================================================== */

-- Q1. [기록 중복 체크] 특정 날짜에 기록이 이미 있는지 확인 (Java 연동 시 매핑 변수 사용)
-- :userId, :targetDate 가 바인딩됩니다.
SELECT EXISTS (
    SELECT 1
    FROM memory_entries
    WHERE user_id = :userId AND memory_date = :targetDate
) AS is_duplicate;

-- Q2. [캘린더 렌더링] 특정 월에 기록이 있는 날짜 목록만 추출 (시작일과 종료일을 계산해서 주입)
-- :startDate ('2026-06-01'), :endDate ('2026-06-30')
SELECT memory_date
FROM memory_entries
WHERE user_id = :userId AND memory_date BETWEEN :startDate AND :endDate
ORDER BY memory_date ASC;

-- Q3. [방 배경 세팅] 선택한 날짜의 방 전체 분위기(날씨, 조명 등) 단건 조회
SELECT room_title, mood, weather, lighting, palette, message
FROM memory_entries
WHERE user_id = :userId AND memory_date = :targetDate;

-- Q4. [가구 렌더링] 특정 월별 방(monthly_room_id)에 배치된 모든 가구 목록과 좌표 조회
-- :monthlyRoomId 가 바인딩됩니다.
SELECT
    latest_memories.object_key,
    ro.object_name,
    latest_memories.slot_key,
    os.position_x,
    os.position_y,
    ro.image_url
FROM (
         -- 각 슬롯(slot_key)별로 가장 최신 날짜(memory_date)의 일기 1건만 뽑아내는 서브쿼리
         SELECT object_key, slot_key,
                ROW_NUMBER() OVER(PARTITION BY slot_key ORDER BY memory_date DESC) as rn
         FROM memory_entries
         WHERE monthly_room_id = 1
     ) latest_memories
         JOIN room_objects ro ON latest_memories.object_key = ro.object_key
         JOIN object_slots os ON latest_memories.slot_key = os.slot_key
WHERE latest_memories.rn = 1;

-- Q5. [자동화] 특정 연도/월 방 개설 여부 확인
-- :userId, :year, :month
SELECT id
FROM monthly_rooms
WHERE user_id = :userId AND year = :year AND month = :month;