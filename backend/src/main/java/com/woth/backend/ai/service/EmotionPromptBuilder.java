package com.woth.backend.ai.service;

import org.springframework.stereotype.Component;

@Component
public class EmotionPromptBuilder {

	public String build(String content) {

		return """
                사용자가 private room에 남긴 글의 정서를 분석해서 창밖 날씨를 하나 선택해라.

                아래 JSON 형식만 반환한다.

                {
                  "weatherKey": "rainy",
                  "weatherLabel": "비",
                  "confidence": 0.82,
                  "reason": "글에서 외로움, 무거움, 차분한 감정이 강하게 드러납니다."
                }

                규칙:
                - weatherKey는 반드시 sunny, cloudy, rainy, sunset 중 하나만 사용한다.
                - weatherLabel은 weatherKey와 반드시 아래처럼 매칭한다.
                  - sunny: 맑음
                  - cloudy: 흐림
                  - rainy: 비
                  - sunset: 노을
                - confidence는 선택 확신도를 0.0 이상 1.0 이하의 숫자로 반환한다.
                - reason은 사용자의 글에서 어떤 감정 단서를 근거로 날씨를 골랐는지 한국어 한 문장으로 설명한다.
                - 맑음은 가벼움, 회복감, 기쁨, 안정감이 뚜렷할 때 선택한다.
                - 흐림은 막막함, 무기력, 애매한 불안, 낮은 에너지가 강할 때 선택한다.
                - 비는 슬픔, 외로움, 무거움, 울적함, 차분한 침잠이 강할 때 선택한다.
                - 노을은 그리움, 따뜻한 여운, 마무리, 희망과 쓸쓸함이 함께 있을 때 선택한다.
                - 반드시 JSON만 반환

                사용자 입력:
                %s
               \s""".formatted(content);
	}
}
