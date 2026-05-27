package com.woth.backend.auth;

/**
 * 인증 관련 REST API 컨트롤러입니다.
 * 로그인과 회원가입 요청을 처리하고, 서비스 계층과 응답 변환을 연결합니다.
 */
import com.woth.backend.global.dto.ApiResponse;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.*;

import java.time.format.DateTimeFormatter;

@RestController
@RequestMapping(path = "/api/auth", produces = MediaType.APPLICATION_JSON_VALUE)
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/login")
    public ApiResponse<AuthResponse> login(@RequestBody LoginRequest request) {
        var user = authService.login(request.email(), request.password());
        return ApiResponse.success(toResponse(user));
    }

    @PostMapping("/signup")
    public ApiResponse<AuthResponse> signup(@RequestBody SignupRequest request) {
        var user = authService.signup(request.email(), request.password(), request.nickname());
        return ApiResponse.success(toResponse(user));
    }

    private AuthResponse toResponse(com.woth.backend.user.User user) {
        return new AuthResponse(
                user.getId(),
                user.getEmail(),
                user.getNickname(),
                user.getCreatedAt().format(DateTimeFormatter.ISO_LOCAL_DATE_TIME)
        );
    }

    public record LoginRequest(String email, String password) {
    }

    public record SignupRequest(String email, String password, String nickname) {
    }

    public record AuthResponse(Long id, String email, String nickname, String joinedAt) {
    }
}
