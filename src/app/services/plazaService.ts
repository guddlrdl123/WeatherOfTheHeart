import { MOCK_PLAZA_ENTRIES, MOCK_PLAZAS } from "../constants/mockData";
import type { Plaza, PlazaEntry } from "../types/plaza";
import { createId, readStorage, writeStorage } from "../lib/storage";

const PLAZAS_KEY = "maeum-weather:plazas";
const PLAZA_ENTRIES_KEY = "maeum-weather:plaza-entries";

export type CreatePlazaInput = Omit<Plaza, "id" | "createdAt">;
export type CreatePlazaEntryInput = Omit<PlazaEntry, "id" | "createdAt" | "updatedAt">;

export const plazaService = {
  listPlazas(): Plaza[] {
    return readStorage<Plaza[]>(PLAZAS_KEY, MOCK_PLAZAS);
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
    return readStorage<PlazaEntry[]>(PLAZA_ENTRIES_KEY, MOCK_PLAZA_ENTRIES);
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

    if (plazaEntries.some((entry) => entry.ownerId === input.ownerId)) {
      return { ok: false, reason: "already_joined" };
    }

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
