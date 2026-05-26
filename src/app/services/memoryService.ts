import { MOCK_MEMORIES } from "../constants/mockData";
import type { Memory } from "../types/memory";
import { createId, readStorage, writeStorage } from "../lib/storage";

const MEMORIES_KEY = "maeum-weather:memories";

export type CreateMemoryInput = Omit<Memory, "id" | "createdAt" | "updatedAt">;

export const memoryService = {
  list(): Memory[] {
    return readStorage<Memory[]>(MEMORIES_KEY, MOCK_MEMORIES);
  },

  saveAll(memories: Memory[]) {
    writeStorage(MEMORIES_KEY, memories);
  },

  create(input: CreateMemoryInput): { ok: true; memory: Memory } | { ok: false; reason: "duplicate" } {
    const memories = this.list();

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
};
