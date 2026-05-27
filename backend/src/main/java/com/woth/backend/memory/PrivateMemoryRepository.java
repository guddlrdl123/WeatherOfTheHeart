package com.woth.backend.memory;

/**
 * 개인 메모 엔티티에 대한 JPA 리포지토리입니다.
 * 사용자 개인 방에 속한 메모 조회 및 중복 검사 메서드를 제공합니다.
 */
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDate;
import java.util.List;

public interface PrivateMemoryRepository extends JpaRepository<PrivateMemory, Long> {
    List<PrivateMemory> findByPrivateRoomUserId(Long userId);
    boolean existsByPrivateRoomUserIdAndMemoryDate(Long userId, LocalDate memoryDate);
}
