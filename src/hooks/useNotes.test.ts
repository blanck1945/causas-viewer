import { act, renderHook } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { createRepository } from "../data/repository";
import { useNotes } from "./useNotes";

function createMemoryStorage() {
  const data = new Map<string, string>();
  return {
    getItem: (key: string) => data.get(key) ?? null,
    setItem: (key: string, value: string) => {
      data.set(key, value);
    },
  };
}

describe("useNotes", () => {
  it("starts without notes", () => {
    const repository = createRepository(createMemoryStorage());
    const { result } = renderHook(() => useNotes("ca-1", { repository }));
    expect(result.current.notes).toEqual([]);
  });

  it("adds a note to the case", () => {
    const repository = createRepository(createMemoryStorage());
    const { result } = renderHook(() => useNotes("ca-1", { repository }));

    act(() => result.current.addNote("Llamar al cliente."));

    expect(result.current.notes).toHaveLength(1);
    expect(result.current.notes[0]).toMatchObject({ caseId: "ca-1", text: "Llamar al cliente." });
    expect(repository.listNotes("ca-1")).toHaveLength(1);
  });

  it("keeps the notes of each case apart", () => {
    const repository = createRepository(createMemoryStorage());
    const first = renderHook(() => useNotes("ca-1", { repository }));
    const second = renderHook(() => useNotes("ca-2", { repository }));

    act(() => first.result.current.addNote("Nota de la primera causa."));
    second.rerender();

    expect(first.result.current.notes).toHaveLength(1);
    expect(second.result.current.notes).toEqual([]);
  });
});
