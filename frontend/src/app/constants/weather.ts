import type { WeatherKey, WeatherTone } from "../types/weather";

// 선택 가능한 6가지 날씨와 각 날씨가 방에 적용할 색감 정보입니다.
export const WEATHER_OPTIONS: WeatherTone[] = [
  {
    key: "sunny",
    label: "맑음",
    icon: "☀️",
    description: "햇빛이 얇게 들어오는 방",
    wall: "#1f2118",
    wallTop: "#2b2d1f",
    floor: "#14130d",
    windowTop: "#d0993d",
    windowBottom: "#e0bb72",
    accent: "#dfbf78",
    quietText: "창밖에 햇빛이 조용히 머뭅니다.",
  },
  {
    key: "rainy",
    label: "비",
    icon: "🌧️",
    description: "비 냄새가 스민 방",
    wall: "#121b2c",
    wallTop: "#18233b",
    floor: "#0b121d",
    windowTop: "#365b83",
    windowBottom: "#172945",
    accent: "#8eb7d8",
    quietText: "창밖에 비가 내립니다.",
  },
  {
    key: "cloudy",
    label: "흐림",
    icon: "☁️",
    description: "흐린 빛이 낮게 깔린 방",
    wall: "#161b24",
    wallTop: "#202635",
    floor: "#0d1118",
    windowTop: "#536374",
    windowBottom: "#2d3848",
    accent: "#a7b0bd",
    quietText: "창밖에 낮은 구름이 지나갑니다.",
  },
  {
    key: "sunset",
    label: "노을",
    icon: "🌇",
    description: "노을빛이 느리게 번지는 방",
    wall: "#231711",
    wallTop: "#321b12",
    floor: "#120a07",
    windowTop: "#c35e2f",
    windowBottom: "#7b2f1d",
    accent: "#e39a74",
    quietText: "창밖에 노을이 천천히 내려앉습니다.",
  },
  {
    key: "night",
    label: "밤",
    icon: "🌙",
    description: "작은 조명만 남은 밤의 방",
    wall: "#101527",
    wallTop: "#151d33",
    floor: "#080c16",
    windowTop: "#17223f",
    windowBottom: "#070b19",
    accent: "#b5bde4",
    quietText: "창밖에 밤이 고요히 놓였습니다.",
  },
  {
    key: "snowy",
    label: "눈",
    icon: "❄️",
    description: "눈빛이 희미하게 반사되는 방",
    wall: "#171f25",
    wallTop: "#212a30",
    floor: "#0c1115",
    windowTop: "#9db4c5",
    windowBottom: "#526878",
    accent: "#d6e3e8",
    quietText: "창밖에 눈이 천천히 흩어집니다.",
  },
];

// key로 날씨 정보를 바로 찾기 위한 조회용 맵입니다.
export const WEATHER_BY_KEY = WEATHER_OPTIONS.reduce<Record<WeatherKey, WeatherTone>>((acc, weather) => {
  acc[weather.key] = weather;
  return acc;
}, {} as Record<WeatherKey, WeatherTone>);
