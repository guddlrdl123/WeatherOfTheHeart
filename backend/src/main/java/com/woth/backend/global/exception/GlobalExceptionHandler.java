package com.woth.backend.global.exception;

import com.woth.backend.global.dto.ApiResponse;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

@RestControllerAdvice
public class GlobalExceptionHandler {

    // 우리가 정의한 비즈니스 에러 처리
    @ExceptionHandler(CustomException.class)
    public ResponseEntity<ApiResponse<Object>> handleCustomException(CustomException e) {
        ErrorCode errorCode = e.getErrorCode();
        ApiResponse<Object> response = ApiResponse.builder()
                .status("ERROR")
                .message(errorCode.getMessage() + " [Code: " + errorCode.getCode() + "]")
                .data(null)
                .build();
        return ResponseEntity.badRequest().body(response);
    }

    // 예상치 못한 시스템 에러 처리
    @ExceptionHandler(Exception.class)
    public ResponseEntity<ApiResponse<Object>> handleServerException(Exception e) {
        ApiResponse<Object> response = ApiResponse.builder()
                .status("ERROR")
                .message("서버 내부 오류가 발생했습니다.")
                .data(null)
                .build();
        return ResponseEntity.internalServerError().body(response);
    }
}