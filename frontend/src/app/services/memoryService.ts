import { MOCK_MEMORIES } from "../constants/mockData";
import type { Memory } from "../types/memory";
import { createId, readStorage, writeStorage } from "../lib/storage";

const MEMORIES_KEY = "maeum-weather:memories";

// id와 생성 시각은 서비스가 자동으로 채우므로 입력 타입에서는 제외합니다.
export type CreateMemoryInput = Omit<Memory, "id" | "createdAt" | "updatedAt">;
export type UpdateMemoryPositionInput = {
  id: string;
  positionX: number;
  positionY: number;
};

// 개인 방 기록을 localStorage에 저장하는 mock service layer입니다.
export const memoryService = {
  list(): Memory[] {
    const memories = readStorage<Memory[]>(MEMORIES_KEY, MOCK_MEMORIES);
    return Array.isArray(memories) ? memories : MOCK_MEMORIES;
  },

  saveAll(memories: Memory[]) {
    writeStorage(MEMORIES_KEY, memories);
  },

  create(input: CreateMemoryInput): { ok: true; memory: Memory } | { ok: false; reason: "duplicate" } {
    const memories = this.list();

    // 현재 목업 정책: 같은 날짜에는 기록을 하나만 남길 수 있습니다.
    if (memories.some((memory) => memory.memoryDate === input.memoryDate)) {
      return { ok: false, reason: "duplicate" };
    }

    const memory: Memory = {
      ...input,
      id: createId("memory"),
      createdAt: new Date().toISOString(),
    };
    this.saveAll([...memories, memory]);
    return { ok: true, memory };
  },

  updatePosition(input: UpdateMemoryPositionInput): { ok: true; memory: Memory } | { ok: false; reason: "not_found" } {
    const memories = this.list();
    const target = memories.find((memory) => memory.id === input.id);

    if (!target) {
      return { ok: false, reason: "not_found" };
    }

    const updatedMemory: Memory = {
      ...target,
      positionX: input.positionX,
      positionY: input.positionY,
      updatedAt: new Date().toISOString(),
    };
    this.saveAll(memories.map((memory) => (memory.id === input.id ? updatedMemory : memory)));
    return { ok: true, memory: updatedMemory };
  },
};
