package com.woth.backend.config;

/**
 * 브라우저에서 프론트엔드 도메인으로부터 온 API 요청을 허용하기 위한 CORS 설정입니다.
 * 로컬 프론트엔드 개발 서버에서 백엔드 `/api/**` 엔드포인트를 호출할 수 있도록 합니다.
 */
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class CorsConfig implements WebMvcConfigurer {

    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/api/**")
                // 이번 CORS 수정: Vite 개발 서버 포트가 5173/5174 등으로 바뀌어도 API 호출을 허용합니다.
                .allowedOriginPatterns(
                        "http://localhost:*",
                        "http://127.0.0.1:*"
                )
                // 우편 읽음 처리는 PATCH를 사용하므로 preflight 요청에서도 PATCH를 허용합니다.
                .allowedMethods("GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS")
                .allowedHeaders("*")
                .allowCredentials(true)
                .maxAge(3600);
    }
}
