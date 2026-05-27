package com.woth.backend.ai.service;

import com.woth.backend.ai.dto.EmotionAnalysisResponse;
import com.woth.backend.global.exception.CustomException;
import com.woth.backend.global.exception.ErrorCode;
import com.woth.backend.user.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class AiService {

	private final OpenAiClient openAiClient;
	private final EmotionPromptBuilder emotionPromptBuilder;
	private final AiResponseParser aiResponseParser;
	private final UserRepository userRepository;

	public AiService(
			OpenAiClient openAiClient,
			EmotionPromptBuilder emotionPromptBuilder,
			AiResponseParser aiResponseParser,
			UserRepository userRepository
	) {
		this.openAiClient = openAiClient;
		this.emotionPromptBuilder = emotionPromptBuilder;
		this.aiResponseParser = aiResponseParser;
		this.userRepository = userRepository;
	}

	@Transactional(readOnly = true)
	public EmotionAnalysisResponse analyze(Long userId, String content) {

		userRepository.findById(userId)
		              .orElseThrow(() -> new CustomException(ErrorCode.USER_NOT_FOUND));

		if (content == null || content.isBlank()) {
			throw new CustomException(ErrorCode.INVALID_INPUT);
		}

		String prompt = emotionPromptBuilder.build(content);

		String response = openAiClient.chat(prompt);

		return aiResponseParser.parse(response);
	}
}