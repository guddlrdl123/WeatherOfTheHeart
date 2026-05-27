package com.woth.backend.plaza;

/**
 * 플라자 엔티티에 대한 JPA 리포지토리입니다.
 * 활성화된 광장 목록을 정렬하여 조회하는 메서드를 제공합니다.
 */
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface PlazaRepository extends JpaRepository<Plaza, Long> {
    List<Plaza> findAllByIsActiveTrueOrderByCreatedAtDesc();
}
