// 방과 광장에서 지원하는 날씨 키입니다.
export type WeatherKey = "sunny" | "rainy" | "cloudy" | "sunset" | "night" | "snowy";

// 현재 목업에서는 마음 상태와 날씨를 같은 값으로 연결합니다.
export type MoodKey = WeatherKey;

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
