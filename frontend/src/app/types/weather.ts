// 방과 광장에서 지원하는 날씨 키입니다.
export type AiWeatherKey = "sunny" | "cloudy" | "rainy" | "sunset";

export type WeatherKey = AiWeatherKey | "night" | "snowy";

export type AiWeatherAnalysis = {
  weatherKey: AiWeatherKey;
  weatherLabel: "맑음" | "흐림" | "비" | "노을";
  confidence: number;
  reason: string;
};

export type EmotionMoodKey =
  | "joy"
  | "sadness"
  | "anger"
  | "fear"
  | "surprise"
  | "disgust"
  | "calm"
  | "depressed"
  | "excited"
  | "confused"
  | "tired";

// 새 기록은 감정 키를 moodKey로, AI가 고른 날씨를 weatherKey로 저장합니다.
export type MoodKey = EmotionMoodKey | WeatherKey;

// 날씨 하나가 화면 색감, 창밖 색, 안내 문구까지 함께 결정합니다.
export type WeatherTone = {
  key: WeatherKey;
  label: string;
  icon: string;
  description: string;
  wall: string;
  wallTop: string;
  floor: string;
  windowTop: string;
  windowBottom: string;
  accent: string;
  quietText: string;
};
