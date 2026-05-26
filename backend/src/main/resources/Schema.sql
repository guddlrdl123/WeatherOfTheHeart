
-- 익명의 사용자, 사용자 정보를 저장합니다.
CREATE TABLE users (
                       id BIGINT AUTO_INCREMENT PRIMARY KEY,
                       email VARCHAR(100) NOT NULL UNIQUE,
                       password VARCHAR(255) NOT NULL,
                       nickname VARCHAR(50) NOT NULL,
                       created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
                       updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
-- 익명의 사용자, 월별 방 정보를 저장합니다.
CREATE TABLE monthly_rooms (
                               id BIGINT AUTO_INCREMENT PRIMARY KEY,
                               user_id BIGINT NOT NULL,
                               year INT NOT NULL,
                               month INT NOT NULL,
                               title VARCHAR(100) NOT NULL,
                               archived_at DATETIME NULL,
                               created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
                               updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

                               CONSTRAINT fk_monthly_rooms_user FOREIGN KEY (user_id) REFERENCES users(id),
                               CONSTRAINT uk_user_year_month UNIQUE (user_id, year, month)
);
-- 날짜별 기억을 저장합니다.
CREATE TABLE memory_entries (
                                id BIGINT AUTO_INCREMENT PRIMARY KEY,
                                user_id BIGINT NOT NULL,
                                monthly_room_id BIGINT NOT NULL,
                                memory_date DATE NOT NULL,
                                content TEXT NOT NULL,
                                room_title VARCHAR(100) NOT NULL,
                                mood VARCHAR(30) NOT NULL,
                                weather VARCHAR(30) NOT NULL,
                                lighting VARCHAR(30) NOT NULL,
                                palette VARCHAR(30) NOT NULL,
                                object_key VARCHAR(50) NOT NULL,
                                slot_key VARCHAR(50) NOT NULL,
                                message VARCHAR(255) NULL,
                                created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
                                updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

                                CONSTRAINT fk_memory_entries_user FOREIGN KEY (user_id) REFERENCES users(id),
                                CONSTRAINT fk_memory_entries_monthly_room FOREIGN KEY (monthly_room_id) REFERENCES monthly_rooms(id),
                                CONSTRAINT uk_user_memory_date UNIQUE (user_id, memory_date),

    -- 성능 최적화: 유저별 월간 일기 목록 조회용 복합 인덱스
                                INDEX idx_memories_user_date (user_id, memory_date DESC)
);
-- 사물 카탈로그를 저장합니다.
CREATE TABLE room_objects (
                              id BIGINT AUTO_INCREMENT PRIMARY KEY,
                              object_key VARCHAR(50) NOT NULL UNIQUE,
                              object_name VARCHAR(50) NOT NULL,
                              mood VARCHAR(30) NOT NULL,
                              slot_key VARCHAR(50) NOT NULL,
                              image_url VARCHAR(255) NULL,
                              is_active BOOLEAN NOT NULL DEFAULT TRUE,
                              created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
                              updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
-- 사물 배치 위치를 저장합니다.
CREATE TABLE object_slots (
                              id BIGINT AUTO_INCREMENT PRIMARY KEY,
                              slot_key VARCHAR(50) NOT NULL UNIQUE,
                              slot_name VARCHAR(50) NOT NULL,
                              position_x INT NOT NULL,
                              position_y INT NOT NULL,
                              is_active BOOLEAN NOT NULL DEFAULT TRUE,
                              created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
                              updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);


-- 로그인 유지 기능을 넣을 경우 사용합니다.
CREATE TABLE refresh_tokens (
                                id BIGINT AUTO_INCREMENT PRIMARY KEY,
                                user_id BIGINT NOT NULL,
                                token VARCHAR(255) NOT NULL,
                                expires_at DATETIME NOT NULL,
                                created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,

                                CONSTRAINT fk_refresh_tokens_user FOREIGN KEY (user_id) REFERENCES users(id)
);