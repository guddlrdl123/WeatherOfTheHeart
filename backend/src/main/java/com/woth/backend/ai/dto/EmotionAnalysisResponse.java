package com.woth.backend.ai.dto;

import java.util.List;

public record EmotionAnalysisResponse(
		String primaryEmotion,
		Integer sadness,
		Integer anxiety,
		Integer loneliness,
		Integer happiness,
		String weather,
		String lighting,
		String sceneDescription,
		List<String> objects
) {
}