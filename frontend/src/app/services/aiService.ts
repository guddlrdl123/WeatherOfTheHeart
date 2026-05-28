import type { AiWeatherAnalysis, AiWeatherKey } from "../types/weather";
import { requestApi } from "./api";

const AI_WEATHER_KEYS = new Set<AiWeatherKey>(["sunny", "cloudy", "rainy", "sunset"]);

function isAiWeatherKey(value: string): value is AiWeatherKey {
  return AI_WEATHER_KEYS.has(value as AiWeatherKey);
}

export const aiService = {
  async analyzeWeather(input: { userId: string; content: string }): Promise<AiWeatherAnalysis> {
    const userId = Number(input.userId);

    if (!Number.isFinite(userId)) {
      throw new Error("invalid_user_id");
    }

    const analysis = await requestApi<AiWeatherAnalysis>("/api/ai/analyze", {
      method: "POST",
      body: JSON.stringify({
        userId,
        content: input.content,
      }),
    });

    if (!isAiWeatherKey(analysis.weatherKey)) {
      throw new Error("invalid_ai_weather_key");
    }

    return analysis;
  },
};
