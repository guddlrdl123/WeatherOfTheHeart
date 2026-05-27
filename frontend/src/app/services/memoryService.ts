import type { Memory } from "../types/memory";
import { requestApi } from "./api";

// id와 생성 시각은 서비스가 자동으로 채우므로 입력 타입에서는 제외합니다.
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
  // 백엔드 Long id를 기존 프론트 컴포넌트가 쓰는 string id로 변환합니다.
  return {
    ...response,
    id: String(response.id),
  };
}

// 이번 DB 저장 변경: 개인 방 기록을 localStorage가 아니라 백엔드 API에 저장하고 조회합니다.
export const memoryService = {
  async list(userId: string): Promise<Memory[]> {
    const memories = await requestApi<MemoryResponse[]>(`/api/users/${userId}/memories`);
    return memories.map(toMemory);
  },

  async create(userId: string, input: CreateMemoryInput): Promise<{ ok: true; memory: Memory } | { ok: false; reason: "duplicate" }> {
    try {
      // 방에 남기기 버튼은 이 POST를 통해 private_memories 테이블에 기록을 생성합니다.
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
      // 오브젝트를 드래그해 위치를 바꾼 값도 DB에 남기기 위한 위치 전용 API입니다.
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
