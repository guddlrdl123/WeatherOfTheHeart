package com.woth.backend.ai.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.woth.backend.ai.dto.EmotionAnalysisResponse;
import com.woth.backend.global.exception.CustomException;
import com.woth.backend.global.exception.ErrorCode;
import org.springframework.stereotype.Component;

@Component
public class AiResponseParser {

	private final ObjectMapper objectMapper;

	public AiResponseParser(ObjectMapper objectMapper) {
		this.objectMapper = objectMapper;
	}

	public EmotionAnalysisResponse parse(String response) {

		try {
			return objectMapper.readValue(
					response,
					EmotionAnalysisResponse.class
			);
		} catch (Exception e) {
			throw new CustomException(ErrorCode.INVALID_INPUT);
		}
	}
}