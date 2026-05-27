package com.woth.backend.ai.dto;

public record AnalyzeEmotionRequest(
		Long userId,
		String content
) {
}