package com.woth.backend.ai.service;

import com.fasterxml.jackson.databind.JsonNode;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Component;
import org.springframework.web.reactive.function.client.WebClient;

import java.util.List;
import java.util.Map;

@Component
public class OpenAiClient {

	@Value("${openai.api-key}")
	private String apiKey;

	private final WebClient webClient;

	public OpenAiClient(WebClient.Builder builder) {
		this.webClient = builder
				.baseUrl("https://api.openai.com/v1")
				.build();
	}

	public String chat(String prompt) {

		Map<String, Object> requestBody = Map.of(
				"model", "gpt-4.1-mini",
				"response_format", Map.of(
						"type", "json_object"
				),
				"messages", List.of(
						Map.of(
								"role", "system",
								"content", "당신은 감정 분석 AI이다. 반드시 JSON만 반환한다."
						),
						Map.of(
								"role", "user",
								"content", prompt
						)
				)
		);

		return webClient.post()
		                .uri("/chat/completions")
		                .header(HttpHeaders.AUTHORIZATION, "Bearer " + apiKey)
		                .contentType(MediaType.APPLICATION_JSON)
		                .bodyValue(requestBody)
		                .retrieve()
		                .bodyToMono(JsonNode.class)
		                .map(json ->
				                json.get("choices")
				                    .get(0)
				                    .get("message")
				                    .get("content")
				                    .asText()
		                )
		                .block();
	}
}