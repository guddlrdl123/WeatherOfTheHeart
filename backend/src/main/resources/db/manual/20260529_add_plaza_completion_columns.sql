-- 광장 완성 이미지/우편 발송 기능에 필요한 기존 DB 보정 SQL입니다.
-- DBeaver에서는 한 줄씩 선택해서 Ctrl+Enter로 실행하거나, 전체 파일을 "Execute SQL Script"로 실행하세요.
-- 이미 추가된 컬럼에서 Duplicate column 에러가 나면 그 줄은 건너뛰고 다음 줄을 실행하면 됩니다.

-- 1. 광장 완료 시각
ALTER TABLE plazas
    ADD COLUMN completed_at DATETIME NULL;

-- 2. 최신 프론트의 광장 배경 타입/색상 설정을 DB에 보존합니다.
ALTER TABLE plazas
    ADD COLUMN background_type VARCHAR(20) NOT NULL DEFAULT 'weather';

ALTER TABLE plazas
    ADD COLUMN background_color VARCHAR(20) NULL;

-- 3. 광장 오브젝트 배치 좌표
ALTER TABLE plaza_entries
    ADD COLUMN position_x INT NULL;

ALTER TABLE plaza_entries
    ADD COLUMN position_y INT NULL;

-- 4. 우편이 어떤 광장에서 왔는지와 AI 생성 이미지를 저장합니다.
ALTER TABLE letters
    ADD COLUMN plaza_id BIGINT NULL;

ALTER TABLE letters
    ADD COLUMN generated_image_data LONGTEXT NULL;

-- 5. 예전 letters.content NOT NULL 컬럼 때문에 우편 저장이 실패하는 문제를 해결합니다.
-- 현재 Letter 엔티티는 content가 아니라 message를 사용합니다.
ALTER TABLE letters
    MODIFY COLUMN content TEXT NULL;

-- 6. 같은 사용자에게 같은 광장 우편을 중복 발송하지 않도록 조회 속도를 보강합니다.
CREATE INDEX idx_letters_receiver_plaza
    ON letters (receiver_id, plaza_id);
