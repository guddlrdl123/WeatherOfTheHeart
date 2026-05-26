package com.woth.backend.object;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

/**
 * [object_catalogs 테이블 매핑 엔티티]
 * 상점 및 방에 배치할 수 있는 모든 가구와 사물들의 도감(카탈로그) 마스터 데이터입니다.
 */
@Entity
@Table(name = "object_catalogs")
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor(access = AccessLevel.PRIVATE)
@Builder
public class ObjectCatalog {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id; // 사물 등록 일련번호

    @Column(name = "object_key", nullable = false, unique = true, length = 50)
    private String objectKey;  // 사물 식별 고유 문자열 코드 (예: sofa_blue_01) [cite: 225]

    @Column(name = "object_name", nullable = false, length = 50)
    private String objectName; // 사물의 명칭 (예: 파란색 소파)

    @Column(nullable = false, length = 30)
    private String mood;     // 사물이 대변하는 감정 태그 (마음 상태) [cite: 112]

    @Column(name = "slot_key", nullable = false, length = 50)
    private String slotKey;  // 사물이 들어갈 수 있는 고유 배치 슬롯 구역

    @Column(name = "image_url", length = 255)
    private String imageUrl; // S3 저장소 자산 에셋 경로 주소

    @Column(name = "is_active", nullable = false)
    @Builder.Default
    private Boolean isActive = true; // 현재 가구의 인게임 활성화/출시 여부

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt; // DB의 created_at 컬럼 매핑 (최초 등록 후 수정 불가) [cite: 227]

    @Column(name = "updated_at", nullable = false)
    private LocalDateTime updatedAt; // DB의 updated_at 컬럼 매핑 (수정 시마다 갱신) [cite: 228]

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