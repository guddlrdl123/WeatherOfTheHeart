-- 프론트 mock 관리자 대신 백엔드 users 테이블에서 관리자 여부를 관리하기 위한 컬럼입니다.
SET @is_admin_column_exists := (
    SELECT COUNT(*)
    FROM INFORMATION_SCHEMA.COLUMNS
    WHERE TABLE_SCHEMA = DATABASE()
      AND TABLE_NAME = 'users'
      AND COLUMN_NAME = 'is_admin'
);
SET @add_is_admin_sql := IF(
    @is_admin_column_exists = 0,
    'ALTER TABLE users ADD COLUMN is_admin TINYINT(1) NOT NULL DEFAULT 0',
    'SELECT 1'
);
PREPARE add_is_admin_stmt FROM @add_is_admin_sql;
EXECUTE add_is_admin_stmt;
DEALLOCATE PREPARE add_is_admin_stmt;

-- 기존 users 테이블에 timestamp default가 없으면 관리자 계정 INSERT가 실패하므로 먼저 보정합니다.
ALTER TABLE users
    MODIFY COLUMN created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    MODIFY COLUMN updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP;

-- 개발용 관리자 계정입니다. 이미 있으면 관리자 권한과 비밀번호를 최신 값으로 맞춥니다.
INSERT INTO users (email, password, nickname, is_admin)
VALUES ('admin@maeum.weather', 'admin1234', 'Admin', b'1')
ON DUPLICATE KEY UPDATE
    password = 'admin1234',
    nickname = 'Admin',
    is_admin = b'1';
