import type { AiWeatherKey, EmotionMoodKey, MoodKey } from "../types/weather";

export type MoodOption = {
  key: EmotionMoodKey;
  label: string;
  icon: string;
  fallbackWeatherKey: AiWeatherKey;
};

export const MOOD_OPTIONS: MoodOption[] = [
  { key: "joy", label: "기쁨", icon: "😊", fallbackWeatherKey: "sunny" },
  { key: "sadness", label: "슬픔", icon: "😢", fallbackWeatherKey: "rainy" },
  { key: "anger", label: "분노", icon: "😠", fallbackWeatherKey: "cloudy" },
  { key: "fear", label: "두려움", icon: "😨", fallbackWeatherKey: "cloudy" },
  { key: "surprise", label: "놀람", icon: "😲", fallbackWeatherKey: "sunset" },
  { key: "disgust", label: "혐오", icon: "🤢", fallbackWeatherKey: "cloudy" },
  { key: "calm", label: "평온", icon: "😌", fallbackWeatherKey: "sunny" },
  { key: "depressed", label: "우울", icon: "😔", fallbackWeatherKey: "rainy" },
  { key: "excited", label: "설렘", icon: "😍", fallbackWeatherKey: "sunny" },
  { key: "confused", label: "혼란", icon: "😵", fallbackWeatherKey: "cloudy" },
  { key: "tired", label: "피곤함", icon: "😴", fallbackWeatherKey: "cloudy" },
];

export const MOOD_BY_KEY = MOOD_OPTIONS.reduce<Record<EmotionMoodKey, MoodOption>>((acc, mood) => {
  acc[mood.key] = mood;
  return acc;
}, {} as Record<EmotionMoodKey, MoodOption>);

export function getFallbackWeatherKeyForMood(moodKey: MoodKey): AiWeatherKey {
  if (moodKey === "sunny" || moodKey === "cloudy" || moodKey === "rainy" || moodKey === "sunset") {
    return moodKey;
  }

  if (moodKey === "night" || moodKey === "snowy") {
    return "cloudy";
  }

  return MOOD_BY_KEY[moodKey]?.fallbackWeatherKey ?? "cloudy";
}
