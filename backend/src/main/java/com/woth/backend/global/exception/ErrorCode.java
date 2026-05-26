package com.woth.backend.global.exception;

import lombok.Getter;
import lombok.RequiredArgsConstructor;

@Getter
@RequiredArgsConstructor
public enum ErrorCode {
    // 도메인별 에러 코드를 여기에 추가하며 관리
    USER_NOT_FOUND("USER_001", "존재하지 않는 유저입니다."),
    ROOM_NOT_FOUND("ROOM_001", "존재하지 않는 방입니다."),
    INVALID_INPUT("GLOBAL_001", "입력값이 올바르지 않습니다.");

    private final String code;
    private final String message;
}
