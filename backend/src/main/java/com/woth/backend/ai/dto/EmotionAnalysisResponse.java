package com.woth.backend.ai.dto;

public record EmotionAnalysisResponse(
		String weatherKey,
		String weatherLabel,
		Double confidence,
		String reason
) {
}
