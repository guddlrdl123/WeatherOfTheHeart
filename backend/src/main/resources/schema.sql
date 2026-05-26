/* ========================================================
   [Part 1] DDL: 데이터베이스 스키마 정의
   의존성 순서: users -> monthly_rooms -> memory_entries 순서로 생성
======================================================== */

-- 1. 사용자 정보 테이블: 가입된 회원 및 '나그네(익명)' 정보를 관리합니다.
CREATE TABLE users (
                       id BIGINT AUTO_INCREMENT PRIMARY KEY,          -- 유저 고유 식별자
                       email VARCHAR(100) NOT NULL UNIQUE,           -- 로그인용 이메일
                       password VARCHAR(255) NOT NULL,               -- 암호화된 비밀번호
                       nickname VARCHAR(50) NOT NULL,                -- 화면에 표시될 닉네임
                       created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
                       updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- 2. 월별 방 정보 테이블: 유저당 월별로 생성되는 고유한 방 공간을 정의합니다.
CREATE TABLE monthly_rooms (
                               id BIGINT AUTO_INCREMENT PRIMARY KEY,         -- 방 고유 식별자
                               user_id BIGINT NOT NULL,                      -- 해당 방의 주인 유저
                               year INT NOT NULL,                            -- 방이 생성된 연도 (예: 2026)
                               month INT NOT NULL,                           -- 방이 생성된 월 (예: 6)
                               title VARCHAR(100) NOT NULL,                  -- 방의 제목(테마)
                               archived_at DATETIME NULL,                    -- 방 보관(종료) 시점
                               created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
                               updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

                               CONSTRAINT fk_monthly_rooms_user FOREIGN KEY (user_id) REFERENCES users(id),
                               CONSTRAINT uk_user_year_month UNIQUE (user_id, year, month) -- 한 유저는 같은 연/월에 하나의 방만 가짐
);

-- 3. 일기(기억) 테이블: 방의 상태 변화와 가구 배치의 근거가 되는 핵심 데이터입니다.
CREATE TABLE memory_entries (
                                id BIGINT AUTO_INCREMENT PRIMARY KEY,         -- 일기 고유 식별자
                                user_id BIGINT NOT NULL,                      -- 작성자 유저
                                monthly_room_id BIGINT NOT NULL,              -- 종속된 월별 방
                                memory_date DATE NOT NULL,                    -- 일기 작성 날짜
                                content TEXT NOT NULL,                        -- 일기 본문
                                room_title VARCHAR(100) NOT NULL,             -- 당시 방의 제목
                                mood VARCHAR(30) NOT NULL,                    -- 감정 태그 (배경 연동)
                                weather VARCHAR(30) NOT NULL,                 -- 날씨 태그 (배경 연동)
                                lighting VARCHAR(30) NOT NULL,                -- 조명 태그 (배경 연동)
                                palette VARCHAR(30) NOT NULL,                 -- 색상 팔레트 정보
                                object_key VARCHAR(50) NOT NULL,              -- 배치할 사물 코드 (room_objects 참조)
                                slot_key VARCHAR(50) NOT NULL,                -- 사물을 놓을 위치 코드 (object_slots 참조)
                                message VARCHAR(255) NULL,                    -- 사물과 함께 남긴 메시지
                                created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
                                updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

                                CONSTRAINT fk_memory_entries_user FOREIGN KEY (user_id) REFERENCES users(id),
                                CONSTRAINT fk_memory_entries_monthly_room FOREIGN KEY (monthly_room_id) REFERENCES monthly_rooms(id),
                                CONSTRAINT uk_user_memory_date UNIQUE (user_id, memory_date), -- 유저는 하루에 한 개의 일기만 작성 가능

    -- 성능 최적화: 유저의 특정 월간 기록을 빠르게 조회하기 위한 인덱스
                                INDEX idx_memories_user_date (user_id, memory_date DESC)
);

-- 4. 사물 카탈로그 테이블: 사용 가능한 모든 가구의 마스터 데이터를 관리합니다.
CREATE TABLE room_objects (
                              id BIGINT AUTO_INCREMENT PRIMARY KEY,
                              object_key VARCHAR(50) NOT NULL UNIQUE,       -- 사물 고유 식별 코드
                              object_name VARCHAR(50) NOT NULL,             -- 사물 이름
                              mood VARCHAR(30) NOT NULL,                    -- 사물과 어울리는 감정 테마
                              slot_key VARCHAR(50) NOT NULL,                -- 주로 배치되는 기본 위치
                              image_url VARCHAR(255) NULL,                  -- 사물 이미지 경로
                              is_active BOOLEAN NOT NULL DEFAULT TRUE,      -- 사용 가능 여부
                              created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
                              updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- 5. 사물 배치 위치 테이블: 방 내부에 존재하는 각 슬롯(창가, 책상 등)의 좌표 정보입니다.
CREATE TABLE object_slots (
                              id BIGINT AUTO_INCREMENT PRIMARY KEY,
                              slot_key VARCHAR(50) NOT NULL UNIQUE,         -- 슬롯 식별 코드
                              slot_name VARCHAR(50) NOT NULL,               -- 슬롯 이름 (예: 창가)
                              position_x INT NOT NULL,                      -- 화면 표시 X 좌표
                              position_y INT NOT NULL,                      -- 화면 표시 Y 좌표
                              is_active BOOLEAN NOT NULL DEFAULT TRUE,      -- 사용 가능 여부
                              created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
                              updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- 6. 인증 정보 테이블: 유저의 로그인 상태 유지를 위한 리프레시 토큰 저장소
CREATE TABLE refresh_tokens (
                                id BIGINT AUTO_INCREMENT PRIMARY KEY,
                                user_id BIGINT NOT NULL,                      -- 토큰 발급 유저
                                token VARCHAR(255) NOT NULL,                  -- 암호화된 토큰 값
                                expires_at DATETIME NOT NULL,                 -- 만료 시간
                                created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,

                                CONSTRAINT fk_refresh_tokens_user FOREIGN KEY (user_id) REFERENCES users(id)
);