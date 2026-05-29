    -- schema.sql은 현재 실행하지 않으므로, 기존 users 테이블의 timestamp default는 수동 migration으로 맞춥니다.
ALTER TABLE users
    MODIFY COLUMN created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    MODIFY COLUMN updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP;
