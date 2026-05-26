package com.woth.backend.global.dto;

import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;

@Getter
@AllArgsConstructor(access = AccessLevel.PRIVATE)
@Builder
public class ApiResponse<T> {
    private String status;
    private String message;
    private T data;
public static <T> ApiResponse<T> success(T data) {
    return ApiResponse.<T>builder()
            .status("success")
            .message("요청이 성공적으로 처리되었습니다.")
            .data(data)
            .build();

}
}

