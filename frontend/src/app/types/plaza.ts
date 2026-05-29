import type { ObjectSlotKey } from "./object";
import type { MoodKey, WeatherKey } from "./weather";

// 광장의 상태는 현재 화면에서 참여 가능 여부를 계산할 때 사용합니다.
export type PlazaStatus = "open" | "complete";
export type PlazaBackgroundType = "color" | "weather";

// 여러 사용자의 오브젝트가 함께 놓이는 공용 공간입니다.
export type Plaza = {
  id: string;
  title: string;
  topic: string;
  maxObjects: number;
  allowSearch: boolean;
  allowInvite: boolean;
  allowDuplicateObjects: boolean;
  backgroundType?: PlazaBackgroundType;
  backgroundColor?: string;
  backgroundKey: WeatherKey;
  completedAt?: string;
  createdAt: string;
};

// 광장에 사용자가 남긴 글과 오브젝트입니다.
// UI에서는 닉네임을 노출하지 않기 위해 ownerId만 내부 판별용으로 씁니다.
export type PlazaEntry = {
  id: string;
  plazaId: string;
  ownerId: string;
  title?: string;
  content: string;
  moodKey: MoodKey;
  weatherKey: WeatherKey;
  objectKey: string;
  slotKey: ObjectSlotKey;
  positionX?: number;
  positionY?: number;
  createdAt: string;
  updatedAt?: string;
};
