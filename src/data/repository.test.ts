import { beforeEach, describe, expect, it } from "vitest";
import type { Case } from "../domain/types";
import { createRepository } from "./repository";

function createMemoryStorage(initial: Record<string, string> = {}) {
  const data = new Map(Object.entries(initial));
  return {
    getItem: (key: string) => data.get(key) ?? null,
    setItem: (key: string, value: string) => {
      data.set(key, value);
    },
  };
}

const newCase: Case = {
  id: "ca-new",
  fileNumber: "1/2026",
  caption: "Nueva causa",
  court: "Juzgado Civil N° 1",
  clientId: "cl-1",
  status: "active",
  nextDeadline: null,
  createdAt: "2026-01-01",
};

describe("createRepository", () => {
  let storage: ReturnType<typeof createMemoryStorage>;

  beforeEach(() => {
    storage = createMemoryStorage();
  });

  it("loads the seed data when the storage is empty", () => {
    const repository = createRepository(storage);
    expect(repository.listClients()).toHaveLength(3);
    expect(repository.listCases()).toHaveLength(5);
    const totalEntries = repository
      .listCases()
      .flatMap((item) => repository.listEntries(item.id));
    expect(totalEntries).toHaveLength(8);
  });

  it("does not overwrite existing data with the seed", () => {
    createRepository(storage).saveCase(newCase);
    expect(createRepository(storage).listCases()).toHaveLength(6);
  });

  it("gets a case by id and returns undefined when missing", () => {
    const repository = createRepository(storage);
    expect(repository.getCase("ca-1")?.fileNumber).toBe("12345/2025");
    expect(repository.getCase("missing")).toBeUndefined();
  });

  it("saves a new case and updates an existing one", () => {
    const repository = createRepository(storage);
    repository.saveCase(newCase);
    expect(repository.getCase("ca-new")).toEqual(newCase);

    repository.saveCase({ ...newCase, status: "closed" });
    expect(repository.getCase("ca-new")?.status).toBe("closed");
    expect(repository.listCases()).toHaveLength(6);
  });

  it("lists only the entries of the requested case", () => {
    const repository = createRepository(storage);
    expect(repository.listEntries("ca-1")).toHaveLength(3);
    expect(repository.listEntries("missing")).toEqual([]);
  });

  it("adds an entry", () => {
    const repository = createRepository(storage);
    repository.addEntry({ id: "en-new", caseId: "ca-4", date: "2026-02-01", description: "Nuevo escrito." });
    expect(repository.listEntries("ca-4").map((entry) => entry.id)).toEqual(["en-new"]);
  });

  it("throws when the stored data is corrupted", () => {
    const corrupted = createMemoryStorage({ "causas.cases": '{"not":"an array"}' });
    expect(() => createRepository(corrupted)).toThrow("Corrupted data");
  });
});
