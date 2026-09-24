import { renderHook } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { createRepository } from "../data/repository";
import { useClients } from "./useClients";

function createMemoryStorage() {
  const data = new Map<string, string>();
  return {
    getItem: (key: string) => data.get(key) ?? null,
    setItem: (key: string, value: string) => {
      data.set(key, value);
    },
  };
}

describe("useClients", () => {
  it("lists the clients sorted by name", () => {
    const repository = createRepository(createMemoryStorage());
    const { result } = renderHook(() => useClients({ repository }));
    expect(result.current.clients.map((entry) => entry.client.name)).toEqual([
      "Estudio Ledesma S.R.L.",
      "Julián Ortega",
      "María Fernández",
    ]);
  });

  it("counts the cases of each client", () => {
    const repository = createRepository(createMemoryStorage());
    const { result } = renderHook(() => useClients({ repository }));
    const counts = Object.fromEntries(
      result.current.clients.map((entry) => [entry.client.id, entry.caseCount]),
    );
    expect(counts).toEqual({ "cl-1": 2, "cl-2": 2, "cl-3": 1 });
  });

  it("reports zero cases for a client without cases", () => {
    const repository = createRepository(createMemoryStorage());
    const [ortega] = repository.listCases().filter((item) => item.clientId === "cl-3");
    if (!ortega) {
      throw new Error("Seed data changed");
    }
    repository.saveCase({ ...ortega, clientId: "cl-1" });
    const { result } = renderHook(() => useClients({ repository }));
    const entry = result.current.clients.find((item) => item.client.id === "cl-3");
    expect(entry?.caseCount).toBe(0);
  });
});
