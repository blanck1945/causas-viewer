import type { Case, CaseNote, ChecklistItem, Client, ProceduralEntry } from "../domain/types";
import { seedCases, seedClients, seedEntries } from "./seed";

export interface Repository {
  listCases(): Case[];
  getCase(id: string): Case | undefined;
  saveCase(item: Case): void;
  listEntries(caseId: string): ProceduralEntry[];
  addEntry(entry: ProceduralEntry): void;
  listClients(): Client[];
  listNotes(caseId: string): CaseNote[];
  addNote(note: CaseNote): void;
  listChecklist(caseId: string): ChecklistItem[];
  saveChecklistItem(item: ChecklistItem): void;
}

type Storage = Pick<globalThis.Storage, "getItem" | "setItem">;

const KEYS = {
  cases: "causas.cases",
  clients: "causas.clients",
  entries: "causas.entries",
  notes: "causas.notes",
  checklist: "causas.checklist",
} as const;

function read<T>(storage: Storage, key: string): T[] | null {
  const raw = storage.getItem(key);
  if (raw === null) {
    return null;
  }
  const parsed: unknown = JSON.parse(raw);
  if (!Array.isArray(parsed)) {
    throw new Error(`Corrupted data under "${key}"`);
  }
  return parsed as T[];
}

function write<T>(storage: Storage, key: string, items: T[]): void {
  storage.setItem(key, JSON.stringify(items));
}

export function createRepository(storage: Storage): Repository {
  if (read(storage, KEYS.cases) === null) {
    write(storage, KEYS.cases, seedCases);
    write(storage, KEYS.clients, seedClients);
    write(storage, KEYS.entries, seedEntries);
  }

  const load = <T>(key: string): T[] => read<T>(storage, key) ?? [];

  return {
    listCases: () => load<Case>(KEYS.cases),
    getCase: (id) => load<Case>(KEYS.cases).find((item) => item.id === id),
    saveCase(item) {
      const cases = load<Case>(KEYS.cases);
      const index = cases.findIndex((existing) => existing.id === item.id);
      if (index === -1) {
        cases.push(item);
      } else {
        cases[index] = item;
      }
      write(storage, KEYS.cases, cases);
    },
    listEntries: (caseId) =>
      load<ProceduralEntry>(KEYS.entries).filter((entry) => entry.caseId === caseId),
    addEntry(entry) {
      write(storage, KEYS.entries, [...load<ProceduralEntry>(KEYS.entries), entry]);
    },
    listClients: () => load<Client>(KEYS.clients),
    listNotes: (caseId) => load<CaseNote>(KEYS.notes).filter((note) => note.caseId === caseId),
    addNote(note) {
      write(storage, KEYS.notes, [...load<CaseNote>(KEYS.notes), note]);
    },
    listChecklist: (caseId) =>
      load<ChecklistItem>(KEYS.checklist).filter((item) => item.caseId === caseId),
    saveChecklistItem(item) {
      const items = load<ChecklistItem>(KEYS.checklist);
      const index = items.findIndex((existing) => existing.id === item.id);
      if (index === -1) {
        items.push(item);
      } else {
        items[index] = item;
      }
      write(storage, KEYS.checklist, items);
    },
  };
}

/** Repository backed by the browser `localStorage`. */
export function createLocalRepository(): Repository {
  return createRepository(window.localStorage);
}
