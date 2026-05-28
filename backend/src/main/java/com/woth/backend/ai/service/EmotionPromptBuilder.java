package com.woth.backend.ai.service;

import org.springframework.stereotype.Component;

@Component
public class EmotionPromptBuilder {

	public String build(String content) {

		return """
                사용자의 감정을 분석해라.

                아래 JSON 형식만 반환한다.

                {
                  "primaryEmotion": "",
                  "sadness": 0,
                  "anxiety": 0,
                  "loneliness": 0,
                  "happiness": 0,
                  "weather": "",
                  "lighting": "",
                  "sceneDescription": ""
                }

                규칙:
                - sadness, anxiety, loneliness, happiness 는 0~100 정수
                - weather 는 감정 기반 날씨
                - lighting 은 공간 조명 분위기
                - sceneDescription 은 공간 묘사
                - objects 는 공간 속 사물 배열
                - 반드시 JSON만 반환

                사용자 입력:
                %s
               \s""".formatted(content);
	}
}