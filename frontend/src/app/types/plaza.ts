import type { ObjectSlotKey } from "./object";
import type { MoodKey, WeatherKey } from "./weather";

export type PlazaStatus = "open" | "complete";

export type Plaza = {
  id: string;
  title: string;
  topic: string;
  maxObjects: number;
  allowSearch: boolean;
  allowInvite: boolean;
  allowDuplicateObjects: boolean;
  backgroundKey: WeatherKey;
  createdAt: string;
};

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
  createdAt: string;
  updatedAt?: string;
};
