package com.woth.backend.plaza;

import com.woth.backend.user.User;
import com.woth.backend.memory.PrivateMemory;
import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

/**
 * [plaza_entries 테이블 매핑 엔티티]
 * 유저가 특정 광장에 자신의 일기(기록)를 공유하여 입장한 게시글 데이터입니다.
 */
@Entity
@Table(name = "plaza_entries")
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor(access = AccessLevel.PRIVATE)
@Builder
public class PlazaEntry {

    // AUTO_INCREMENT 설정 적용 (광장 입장 기록 고유 식별자)
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "plaza_id", nullable = false)
    private Plaza plaza;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "private_memory_id", nullable = false)
    private PrivateMemory privateMemory;

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