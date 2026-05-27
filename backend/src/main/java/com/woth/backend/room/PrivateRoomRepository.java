package com.woth.backend.room;

/**
 * 개인 방 엔티티에 대한 JPA 리포지토리입니다.
 * 사용자, 년, 월을 기준으로 개인 방을 조회할 수 있습니다.
 */
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface PrivateRoomRepository extends JpaRepository<PrivateRoom, Long> {
    Optional<PrivateRoom> findByUserIdAndYearAndMonth(Long userId, Integer year, Integer month);
}
