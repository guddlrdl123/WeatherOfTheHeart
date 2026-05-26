package com.woth.backend.user;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

/**
 * [users 테이블 매핑 엔티티]
 * 익명 사용자 및 회원 정보를 저장하고 관리하는 도메인 클래스입니다.
 */
@Entity
@Table(name = "users")
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED) // JPA 규격상 기본 생성자는 필수 (무분별한 객체 생성 방지)
@AllArgsConstructor(access = AccessLevel.PRIVATE)  // 빌더 패턴 사용을 위한 전체 생성자
@Builder                                           // 일관성 있는 객체 생성을 위한 빌더 패턴 적용
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id; // AUTO_INCREMENT 설정 적용

    @Column(nullable = false, unique = true, length = 100) // NOT NULL, UNIQUE 제약조건
    private String email;

    @Column(nullable = false) // 로그인 비밀번호 (암호화되어 저장됨)
    private String password;

    @Column(nullable = false, length = 50) // 화면에 노출될 유저의 닉네임
    private String nickname;

    @Column(name = "created_at", nullable = false, updatable = false) // 생성일은 수정 불가능
    private LocalDateTime createdAt;

    @Column(name = "updated_at", nullable = false)
    private LocalDateTime updatedAt;

    // 데이터가 처음 저장(Insert)되기 직전에 실행되어 시간을 채워줍니다.
    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
    }

    // 데이터가 수정(Update)되기 직전에 실행되어 수정 시간을 갱신합니다.
    @PreUpdate
    protected void onUpdate() {
        this.updatedAt = LocalDateTime.now();
    }
}