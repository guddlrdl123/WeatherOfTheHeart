package com.woth.backend.config;

/**
 * 브라우저에서 프론트엔드 도메인으로부터 온 API 요청을 허용하기 위한 CORS 설정입니다.
 * 프론트엔드가 `http://localhost:5174`에서 백엔드 `/api/**` 엔드포인트를 호출할 수 있도록 합니다.
 */
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class CorsConfig implements WebMvcConfigurer {

    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/api/**")
                .allowedOrigins("http://localhost:5174")
                .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS")
                .allowedHeaders("*")
                .allowCredentials(true)
                .maxAge(3600);
    }
}
