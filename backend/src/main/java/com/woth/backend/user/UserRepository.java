package com.woth.backend.user;

/**
 * 사용자 엔티티에 대한 JPA 리포지토리입니다.
 * 이메일 기반 조회와 중복 이메일 검사 기능을 제공합니다.
 */
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByEmail(String email);
    boolean existsByEmail(String email);
}
