import type { ObjectSlotKey } from "./object";
import type { MoodKey, WeatherKey } from "./weather";

// 개인 방에 남기는 하루 기록입니다.
// 기록 하나가 날씨와 오브젝트 하나로 방 안에 표현됩니다.
export type Memory = {
  id: string;
  memoryDate: string;
  title?: string;
  content: string;
  moodKey: MoodKey;
  weatherKey: WeatherKey;
  objectKey: string;
  slotKey: ObjectSlotKey;
  positionX?: number;
  positionY?: number;
  flipX?: boolean;
  tiltDeg?: number;
  createdAt: string;
  updatedAt?: string;
};
