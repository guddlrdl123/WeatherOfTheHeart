package com.woth.backend.ai.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.woth.backend.global.exception.CustomException;
import com.woth.backend.global.exception.ErrorCode;
import jakarta.annotation.PostConstruct;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Component;
import org.springframework.web.reactive.function.client.WebClient;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.security.CodeSource;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@Component
public class OpenAiClient {

	private static final Logger log = LoggerFactory.getLogger(OpenAiClient.class);
	private static final String API_KEY_NAME = "OPENAI_API_KEY";

	@Value("${openai.api-key:}")
	private String apiKey;

	private final WebClient webClient;
	private final ObjectMapper objectMapper;

	public OpenAiClient(WebClient.Builder builder, ObjectMapper objectMapper) {
		this.objectMapper = objectMapper;
		this.webClient = builder
				.baseUrl("https://api.openai.com/v1")
				.build();
	}

	@PostConstruct
	public void logApiKeySource() {
		ResolvedApiKey resolvedApiKey = resolveApiKey();
		log.info("OpenAI API key source: {}, loaded: {}, user.dir: {}",
				resolvedApiKey.source(),
				!resolvedApiKey.value().isBlank(),
				Path.of("").toAbsolutePath()
		);
	}

	public String chat(String prompt) {
		ResolvedApiKey resolvedApiKey = resolveApiKey();

		if (resolvedApiKey.value().isBlank()) {
			throw new CustomException(ErrorCode.AI_API_KEY_MISSING);
		}

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
		                .header(HttpHeaders.AUTHORIZATION, "Bearer " + resolvedApiKey.value())
		                .contentType(MediaType.APPLICATION_JSON)
		                .bodyValue(requestBody)
		                .retrieve()
		                .bodyToMono(String.class)
		                .map(this::parseResponseBody)
		                .map(this::extractMessageContent)
		                .block();
	}

	public String generateImageDataUrl(String prompt) {
		ResolvedApiKey resolvedApiKey = resolveApiKey();

		if (resolvedApiKey.value().isBlank()) {
			throw new CustomException(ErrorCode.AI_API_KEY_MISSING);
		}

		Map<String, Object> requestBody = Map.of(
				"model", "gpt-image-1",
				"prompt", prompt,
				"n", 1,
				"size", "1024x1024",
				"quality", "medium"
		);

		return webClient.post()
		                .uri("/images/generations")
		                .header(HttpHeaders.AUTHORIZATION, "Bearer " + resolvedApiKey.value())
		                .contentType(MediaType.APPLICATION_JSON)
		                .bodyValue(requestBody)
		                .retrieve()
		                .bodyToMono(String.class)
		                .map(this::parseResponseBody)
		                .map(this::extractImageDataUrl)
		                .block();
	}

	private JsonNode parseResponseBody(String responseBody) {
		try {
			return objectMapper.readTree(responseBody);
		} catch (Exception e) {
			throw new CustomException(ErrorCode.AI_API_ERROR);
		}
	}

	private String extractMessageContent(JsonNode json) {
		JsonNode content = json.path("choices")
				.path(0)
				.path("message")
				.path("content");

		if (content.isMissingNode() || content.asText().isBlank()) {
			throw new CustomException(ErrorCode.AI_API_ERROR);
		}

		return content.asText();
	}

	private String extractImageDataUrl(JsonNode json) {
		JsonNode image = json.path("data").path(0).path("b64_json");

		if (image.isMissingNode() || image.asText().isBlank()) {
			throw new CustomException(ErrorCode.AI_API_ERROR);
		}

		// 프론트가 별도 파일 저장소 없이 바로 렌더링할 수 있도록 data URL 형태로 내려보냅니다.
		return "data:image/png;base64," + image.asText();
	}

	private ResolvedApiKey resolveApiKey() {
		if (apiKey != null && !apiKey.isBlank()) {
			return new ResolvedApiKey(cleanEnvValue(apiKey), "spring-property openai.api-key");
		}

		String envApiKey = System.getenv(API_KEY_NAME);

		if (envApiKey != null && !envApiKey.isBlank()) {
			return new ResolvedApiKey(cleanEnvValue(envApiKey), "system-env " + API_KEY_NAME);
		}

		return readApiKeyFromEnvFile().orElse(new ResolvedApiKey("", "not-found"));
	}

	private Optional<ResolvedApiKey> readApiKeyFromEnvFile() {
		for (Path candidate : findEnvFileCandidates()) {
			if (!Files.exists(candidate)) {
				continue;
			}

			try {
				Optional<String> apiKeyLine = Files.readAllLines(candidate).stream()
						.map(String::trim)
						.filter(line -> line.startsWith(API_KEY_NAME + "="))
						.findFirst();

				if (apiKeyLine.isPresent()) {
					String value = cleanEnvValue(apiKeyLine.get().substring((API_KEY_NAME + "=").length()).trim());
					if (!value.isBlank()) {
						return Optional.of(new ResolvedApiKey(value, ".env file " + candidate.toAbsolutePath()));
					}
				}
			} catch (IOException ignored) {
				// .env fallback은 실행 편의용이므로 읽기 실패 시 다음 후보 경로를 확인합니다.
			}
		}

		return Optional.empty();
	}

	private List<Path> findEnvFileCandidates() {
		List<Path> candidates = new ArrayList<>();
		addEnvCandidates(candidates, Path.of("").toAbsolutePath());
		getClassLocation().ifPresent(path -> addEnvCandidates(candidates, path));
		return candidates;
	}

	private void addEnvCandidates(List<Path> candidates, Path startPath) {
		Path currentPath = Files.isRegularFile(startPath) ? startPath.getParent() : startPath;

		while (currentPath != null) {
			candidates.add(currentPath.resolve(".env"));
			candidates.add(currentPath.resolve("backend/.env"));
			candidates.add(currentPath.resolve("WeatherOfTheHeart/backend/.env"));
			currentPath = currentPath.getParent();
		}
	}

	private Optional<Path> getClassLocation() {
		CodeSource codeSource = OpenAiClient.class.getProtectionDomain().getCodeSource();

		if (codeSource == null || codeSource.getLocation() == null) {
			return Optional.empty();
		}

		try {
			return Optional.of(Path.of(codeSource.getLocation().toURI()).toAbsolutePath());
		} catch (Exception e) {
			return Optional.empty();
		}
	}

	private String cleanEnvValue(String value) {
		if ((value.startsWith("\"") && value.endsWith("\"")) || (value.startsWith("'") && value.endsWith("'"))) {
			return value.substring(1, value.length() - 1);
		}

		return value;
	}

	private record ResolvedApiKey(String value, String source) {
	}
}
