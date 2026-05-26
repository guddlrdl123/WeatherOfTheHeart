import type { ObjectSlotKey } from "./object";
import type { MoodKey, WeatherKey } from "./weather";

export type Memory = {
  id: string;
  memoryDate: string;
  title?: string;
  content: string;
  moodKey: MoodKey;
  weatherKey: WeatherKey;
  objectKey: string;
  slotKey: ObjectSlotKey;
  createdAt: string;
  updatedAt?: string;
};
