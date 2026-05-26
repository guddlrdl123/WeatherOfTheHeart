export type WeatherKey = "sunny" | "rainy" | "cloudy" | "sunset" | "night" | "snowy";

export type MoodKey = WeatherKey;

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
