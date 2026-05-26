package com.woth.backend.memory;

import com.woth.backend.room.PrivateRoom;
import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDate;
import java.time.LocalDateTime;

/**
 * [private_memories 테이블 매핑 엔티티]
 * 유저가 나만의 방 공간에 매일 기록하는 감정 일기(메모) 데이터입니다.
 */
@Entity
@Table(name = "private_memories")
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor(access = AccessLevel.PRIVATE)
@Builder
public class PrivateMemory {

    // AUTO_INCREMENT 설정 적용 (일기 고유 식별자)
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "private_room_id", nullable = false)
    private PrivateRoom privateRoom;

    @Column(nullable = false, length = 100)
    private String title; // 일기 제목

    @Column(nullable = false, columnDefinition = "TEXT")
    private String content; // 일기 본문 내용

    @Column(nullable = false, length = 30)
    private String mood; // 마음 상태 / 감정 태그 (예: sunny, rainy 등)

    @Column(name = "memory_date", nullable = false)
    private LocalDate memoryDate; // 일기를 기록한 날짜 (연-월-일)

    @Column(name = "image_url", length = 255)
    private String imageUrl; // S3에 업로드된 첨부 이미지 경로

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