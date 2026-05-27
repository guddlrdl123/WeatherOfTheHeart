package com.woth.backend.plaza;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

/**
 * [plazas 테이블 매핑 엔티티]
 * 유저들이 참여하여 소통할 수 있는 개별 광장 공간의 마스터 정보입니다.
 */
@Entity
@Table(name = "plazas")
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor(access = AccessLevel.PRIVATE)
@Builder
public class Plaza {

    // AUTO_INCREMENT 설정 적용 (광장 고유 식별자)
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 100)
    private String title; // 광장 이름 또는 주제

    @Column(nullable = false, columnDefinition = "TEXT")
    private String topic; // 광장 주제 또는 소개 글

    @Column(name = "max_objects", nullable = false)
    @Builder.Default
    private Integer maxObjects = 8; // 광장에 허용되는 최대 오브젝트 수

    @Column(name = "allow_search", nullable = false)
    @Builder.Default
    private Boolean allowSearch = true; // 광장 검색 허용 여부

    @Column(name = "allow_invite", nullable = false)
    @Builder.Default
    private Boolean allowInvite = true; // 광장 초대 허용 여부

    @Column(name = "allow_duplicate_objects", nullable = false)
    @Builder.Default
    private Boolean allowDuplicateObjects = false; // 동일 오브젝트 중복 허용 여부

    @Column(name = "background_key", nullable = false, length = 50)
    private String backgroundKey; // 광장의 배경 날씨 키

    @Column(name = "is_active", nullable = false)
    @Builder.Default
    private Boolean isActive = true; // 광장 활성화 및 노출 여부

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