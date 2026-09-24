import { act, renderHook } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { createRepository } from "../data/repository";
import { useChecklist } from "./useChecklist";

function createMemoryStorage() {
  const data = new Map<string, string>();
  return {
    getItem: (key: string) => data.get(key) ?? null,
    setItem: (key: string, value: string) => {
      data.set(key, value);
    },
  };
}

function renderChecklist(caseId = "ca-1") {
  const repository = createRepository(createMemoryStorage());
  return renderHook(() => useChecklist(caseId, { repository }));
}

describe("useChecklist", () => {
  it("adds a pending item", () => {
    const { result } = renderChecklist();
    act(() => result.current.addItem("Poder"));
    expect(result.current.items).toMatchObject([{ label: "Poder", done: false }]);
    expect(result.current.doneCount).toBe(0);
  });

  it("toggles an item on and off", () => {
    const { result } = renderChecklist();
    act(() => result.current.addItem("Poder"));
    const id = result.current.items[0]?.id ?? "";

    act(() => result.current.toggleItem(id));
    expect(result.current.items[0]?.done).toBe(true);
    expect(result.current.doneCount).toBe(1);

    act(() => result.current.toggleItem(id));
    expect(result.current.items[0]?.done).toBe(false);
  });

  it("ignores an unknown item id", () => {
    const { result } = renderChecklist();
    act(() => result.current.addItem("Poder"));
    act(() => result.current.toggleItem("missing"));
    expect(result.current.doneCount).toBe(0);
    expect(result.current.items).toHaveLength(1);
  });
});
