import { MOCK_PLAZA_ENTRIES, MOCK_PLAZAS } from "../constants/mockData";
import type { Plaza, PlazaEntry } from "../types/plaza";
import { createId, readStorage, writeStorage } from "../lib/storage";

const PLAZAS_KEY = "maeum-weather:plazas";
const PLAZA_ENTRIES_KEY = "maeum-weather:plaza-entries";

// 생성 시점에 서비스가 자동으로 채우는 필드를 입력값에서 제외합니다.
export type CreatePlazaInput = Omit<Plaza, "id" | "createdAt">;
export type CreatePlazaEntryInput = Omit<PlazaEntry, "id" | "createdAt" | "updatedAt">;

// 광장과 광장 참여 기록을 localStorage에 저장하는 mock service layer입니다.
export const plazaService = {
  listPlazas(): Plaza[] {
    const plazas = readStorage<Plaza[]>(PLAZAS_KEY, MOCK_PLAZAS);
    return Array.isArray(plazas) ? plazas : MOCK_PLAZAS;
  },

  savePlazas(plazas: Plaza[]) {
    writeStorage(PLAZAS_KEY, plazas);
  },

  createPlaza(input: CreatePlazaInput): Plaza {
    const plazas = this.listPlazas();
    const plaza: Plaza = {
      ...input,
      id: createId("plaza"),
      createdAt: new Date().toISOString(),
    };
    this.savePlazas([plaza, ...plazas]);
    return plaza;
  },

  listEntries(): PlazaEntry[] {
    const entries = readStorage<PlazaEntry[]>(PLAZA_ENTRIES_KEY, MOCK_PLAZA_ENTRIES);
    return Array.isArray(entries) ? entries : MOCK_PLAZA_ENTRIES;
  },

  saveEntries(entries: PlazaEntry[]) {
    writeStorage(PLAZA_ENTRIES_KEY, entries);
  },

  createEntry(input: CreatePlazaEntryInput): { ok: true; entry: PlazaEntry } | { ok: false; reason: "already_joined" | "complete" } {
    const plazas = this.listPlazas();
    const plaza = plazas.find((item) => item.id === input.plazaId);
    const entries = this.listEntries();

    if (!plaza) {
      return { ok: false, reason: "complete" };
    }

    const plazaEntries = entries.filter((entry) => entry.plazaId === input.plazaId);

    // 한 사용자는 한 광장에 한 번만 글을 남길 수 있게 막습니다.
    if (plazaEntries.some((entry) => entry.ownerId === input.ownerId)) {
      return { ok: false, reason: "already_joined" };
    }

    // 광장 최대 오브젝트 수에 도달하면 더 이상 참여할 수 없습니다.
    if (plazaEntries.length >= plaza.maxObjects) {
      return { ok: false, reason: "complete" };
    }

    const entry: PlazaEntry = {
      ...input,
      id: createId("plaza-entry"),
      createdAt: new Date().toISOString(),
    };
    this.saveEntries([...entries, entry]);
    return { ok: true, entry };
  },
};
