package com.woth.backend.like;

import com.woth.backend.user.User;
import com.woth.backend.plaza.PlazaEntry;
import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

/**
 * [object_likes 테이블 매핑 엔티티]
 * 유저들이 광장에 올라온 다른 사람의 피드(PlazaEntry)에 누른 좋아요 기록 데이터입니다.
 */
@Entity
@Table(name = "object_likes", uniqueConstraints = {
        // 한 유저가 하나의 광장 게시글에 좋아요를 중복으로 누르지 못하도록 복합 유니크 제약 적용
        @UniqueConstraint(name = "uk_user_plaza_entry", columnNames = {"user_id", "plaza_entry_id"})
})
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor(access = AccessLevel.PRIVATE)
@Builder
public class ObjectLike {

    // AUTO_INCREMENT 설정 적용 (좋아요 고유 식별자)
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "plaza_entry_id", nullable = false)
    private PlazaEntry plazaEntry;

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