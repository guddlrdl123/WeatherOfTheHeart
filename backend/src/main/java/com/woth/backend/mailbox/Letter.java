package com.woth.backend.mailbox;

import com.woth.backend.user.User;
import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

/**
 * [letters 테이블 매핑 엔티티]
 * 유저들이 서로의 우체통을 통해 주고받은 마음 편지 데이터입니다.
 */
@Entity
@Table(name = "letters")
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor(access = AccessLevel.PRIVATE)
@Builder
public class Letter {

    // AUTO_INCREMENT 설정 적용 (편지 고유 식별자)
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "sender_id")
    private User sender;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "receiver_id", nullable = false)
    private User receiver;

    @Column(nullable = false, length = 100)
    private String title; // 편지 제목

    @Column(nullable = false, columnDefinition = "TEXT")
    private String content; // 편지 본문 내용

    @Column(name = "is_read", nullable = false)
    @Builder.Default
    private Boolean isRead = false; // 수신자의 편지 읽음 여부

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at", nullable = false)
    private LocalDateTime updatedAt;

    // INSERT 쿼리가 나가기 직전 실행 (생성일, 수정일을 현재 시간으로 초기화)
    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
    }

    // UPDATE 쿼리가 나가기 직전 실행 (수정일만 현재 시간으로 갱신)
    @PreUpdate
    protected void onUpdate() {
        this.updatedAt = LocalDateTime.now();
    }
}