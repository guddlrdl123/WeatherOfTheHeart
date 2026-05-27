-- 기존 DB에 남아 있던 legacy mood NOT NULL 컬럼 때문에 insert가 실패해 제거합니다.
ALTER TABLE private_memories
    DROP COLUMN mood;
