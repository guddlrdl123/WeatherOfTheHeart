import { requestApi } from "./api";
import type { ObjectSlotKey } from "../types/object";
import type { Plaza, PlazaBackgroundType, PlazaEntry } from "../types/plaza";
import type { MoodKey, WeatherKey } from "../types/weather";

const MAX_PLAZA_OBJECTS = 30;

type PlazaResponse = {
  id: number;
  title: string;
  topic: string;
  maxObjects: number;
  allowSearch: boolean;
  allowInvite: boolean;
  allowDuplicateObjects: boolean;
  backgroundType?: PlazaBackgroundType;
  backgroundColor?: string;
  backgroundKey: WeatherKey;
  completedAt?: string | null;
  createdAt: string;
};

type PlazaEntryResponse = {
  id: number;
  plazaId: number;
  ownerId: number;
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

function normalizePlaza(plaza: Plaza): Plaza {
  return {
    ...plaza,
    maxObjects: Math.min(MAX_PLAZA_OBJECTS, Math.max(1, plaza.maxObjects)),
    backgroundType: plaza.backgroundType ?? "weather",
  };
}

function toPlaza(response: PlazaResponse): Plaza {
  return normalizePlaza({
    ...response,
    id: String(response.id),
    completedAt: response.completedAt ?? undefined,
  });
}

function toPlazaEntry(response: PlazaEntryResponse): PlazaEntry {
  return {
    ...response,
    id: String(response.id),
    plazaId: String(response.plazaId),
    ownerId: String(response.ownerId),
  };
}

// 생성 시점에 서비스가 자동으로 채우는 필드를 입력값에서 제외합니다.
export type CreatePlazaInput = Omit<Plaza, "id" | "createdAt" | "completedAt">;
export type CreatePlazaEntryInput = Omit<PlazaEntry, "id" | "createdAt" | "updatedAt">;
export type CreatePlazaEntryResult =
  | { ok: true; entry: PlazaEntry }
  | { ok: false; reason: "already_joined" | "complete" | "duplicate_object" };

// 광장 데이터는 localStorage가 아니라 백엔드 DB를 단일 원본으로 사용합니다.
export const plazaService = {
  async listPlazas(): Promise<Plaza[]> {
    const plazas = await requestApi<PlazaResponse[]>("/api/plazas");
    return plazas.map(toPlaza);
  },

  async createPlaza(input: CreatePlazaInput): Promise<Plaza> {
    const plaza = await requestApi<PlazaResponse>("/api/plazas", {
      method: "POST",
      body: JSON.stringify({
        ...input,
        maxObjects: Math.min(MAX_PLAZA_OBJECTS, Math.max(1, input.maxObjects)),
      }),
    });
    return toPlaza(plaza);
  },

  async listEntries(plazaId?: string): Promise<PlazaEntry[]> {
    const path = plazaId ? `/api/plazas/${plazaId}/entries` : "/api/plazas/entries";
    const entries = await requestApi<PlazaEntryResponse[]>(path);
    return entries.map(toPlazaEntry);
  },

  async createEntry(input: CreatePlazaEntryInput): Promise<CreatePlazaEntryResult> {
    try {
      const entry = await requestApi<PlazaEntryResponse>(`/api/plazas/${input.plazaId}/entries`, {
        method: "POST",
        body: JSON.stringify({
          ownerId: Number(input.ownerId),
          title: input.title,
          content: input.content,
          moodKey: input.moodKey,
          weatherKey: input.weatherKey,
          objectKey: input.objectKey,
          slotKey: input.slotKey,
          positionX: input.positionX,
          positionY: input.positionY,
        }),
      });
      return { ok: true, entry: toPlazaEntry(entry) };
    } catch (error) {
      const message = error instanceof Error ? error.message : "";

      // 백엔드 비즈니스 에러 문구를 화면에서 쓰는 분기값으로 변환합니다.
      if (message.includes("이미 참여") || message.includes("ALREADY")) {
        return { ok: false, reason: "already_joined" };
      }
      if (message.includes("중복") || message.includes("DUPLICATE")) {
        return { ok: false, reason: "duplicate_object" };
      }
      return { ok: false, reason: "complete" };
    }
  },
};
