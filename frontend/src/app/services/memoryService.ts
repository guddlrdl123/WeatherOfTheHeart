import type { Memory } from "../types/memory";
import { requestApi } from "./api";

export type CreateMemoryInput = Omit<Memory, "id" | "createdAt" | "updatedAt">;
export type UpdateMemoryPositionInput = {
  id: string;
  positionX: number;
  positionY: number;
  flipX?: boolean;
  tiltDeg?: number;
};

type MemoryResponse = {
  id: number;
  memoryDate: string;
  title?: string;
  content: string;
  moodKey: Memory["moodKey"];
  weatherKey: Memory["weatherKey"];
  objectKey: string;
  slotKey: Memory["slotKey"];
  positionX?: number;
  positionY?: number;
  flipX?: boolean;
  tiltDeg?: number;
  createdAt: string;
  updatedAt?: string;
};

function toMemory(response: MemoryResponse): Memory {
  return {
    ...response,
    id: String(response.id),
  };
}

export const memoryService = {
  async list(userId: string): Promise<Memory[]> {
    const memories = await requestApi<MemoryResponse[]>(`/api/users/${userId}/memories`);
    return memories.map(toMemory);
  },

  async create(userId: string, input: CreateMemoryInput): Promise<{ ok: true; memory: Memory } | { ok: false; reason: "duplicate" | "duplicate_object" }> {
    const memories = await this.list(userId);

    if (memories.some((memory) => memory.memoryDate === input.memoryDate)) {
      return { ok: false, reason: "duplicate" };
    }

    const inputMonth = input.memoryDate.slice(0, 7);

    if (memories.some((memory) => memory.memoryDate.slice(0, 7) === inputMonth && memory.objectKey === input.objectKey)) {
      return { ok: false, reason: "duplicate_object" };
    }

    try {
      const memory = await requestApi<MemoryResponse>(`/api/users/${userId}/memories`, {
        method: "POST",
        body: JSON.stringify(input),
      });
      return { ok: true, memory: toMemory(memory) };
    } catch (error) {
      if (error instanceof Error && error.message.includes("이미 해당 날짜")) {
        return { ok: false, reason: "duplicate" };
      }
      throw error;
    }
  },

  async updatePosition(userId: string, input: UpdateMemoryPositionInput): Promise<{ ok: true; memory: Memory } | { ok: false; reason: "not_found" }> {
    try {
      const memory = await requestApi<MemoryResponse>(`/api/users/${userId}/memories/${input.id}/position`, {
        method: "PUT",
        body: JSON.stringify({
          positionX: input.positionX,
          positionY: input.positionY,
          flipX: input.flipX,
          tiltDeg: input.tiltDeg,
        }),
      });
      return { ok: true, memory: toMemory(memory) };
    } catch (error) {
      if (error instanceof Error && error.message.includes("존재하지 않는 기억")) {
        return { ok: false, reason: "not_found" };
      }
      throw error;
    }
  },
};
