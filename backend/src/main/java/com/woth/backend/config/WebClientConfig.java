package com.woth.backend.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.reactive.function.client.WebClient;

@Configuration
public class WebClientConfig {

    @Bean
    public WebClient.Builder webClientBuilder() {
        // OpenAiClient가 외부 API 호출용 WebClient를 만들 수 있도록 Builder Bean을 명시적으로 등록합니다.
        return WebClient.builder();
    }
}
