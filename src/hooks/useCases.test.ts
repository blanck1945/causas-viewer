import { act, renderHook } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { createRepository } from "../data/repository";
import { useCases } from "./useCases";

function createMemoryStorage() {
  const data = new Map<string, string>();
  return {
    getItem: (key: string) => data.get(key) ?? null,
    setItem: (key: string, value: string) => {
      data.set(key, value);
    },
  };
}

function renderUseCases(today = "2026-06-01") {
  const repository = createRepository(createMemoryStorage());
  return { repository, ...renderHook(() => useCases({ repository, today })) };
}

describe("useCases", () => {
  it("exposes all seeded cases without filters", () => {
    const { result } = renderUseCases();
    expect(result.current.cases).toHaveLength(5);
    expect(result.current.filters).toEqual({ status: "all", text: "" });
  });

  it("filters by status", () => {
    const { result } = renderUseCases();
    act(() => result.current.setFilters({ status: "archived", text: "" }));
    expect(result.current.cases.map((item) => item.id)).toEqual(["ca-3"]);
  });

  it("filters by text over the caption, ignoring case", () => {
    const { result } = renderUseCases();
    act(() => result.current.setFilters({ status: "all", text: "sucesión" }));
    expect(result.current.cases.map((item) => item.id)).toEqual(["ca-4"]);
  });

  it("filters by text over the file number", () => {
    const { result } = renderUseCases();
    act(() => result.current.setFilters({ status: "all", text: "20871" }));
    expect(result.current.cases.map((item) => item.id)).toEqual(["ca-2"]);
  });

  it("combines the status and text filters", () => {
    const { result } = renderUseCases();
    act(() => result.current.setFilters({ status: "closed", text: "sucesión" }));
    expect(result.current.cases).toEqual([]);
  });

  it("counts overdue cases against today", () => {
    expect(renderUseCases("2026-06-01").result.current.overdueCount).toBe(1);
    expect(renderUseCases("2025-01-01").result.current.overdueCount).toBe(0);
  });

  it("adds an entry and returns it for the case", () => {
    const { result } = renderUseCases();
    expect(result.current.getEntries("ca-4")).toEqual([]);
    act(() => result.current.addEntry("ca-4", "2026-05-20", "Escrito presentado."));
    expect(result.current.getEntries("ca-4")).toMatchObject([
      { caseId: "ca-4", date: "2026-05-20", description: "Escrito presentado." },
    ]);
  });

  it("keeps the stored order when no sort is selected", () => {
    const { result } = renderUseCases();
    expect(result.current.sortBy).toBe("none");
    expect(result.current.cases.map((item) => item.id)).toEqual(["ca-1", "ca-2", "ca-3", "ca-4", "ca-5"]);
  });

  it("sorts by the nearest deadline first", () => {
    const { result } = renderUseCases();
    act(() => result.current.setFilters({ status: "active", text: "" }));
    act(() => result.current.setSortBy("deadline"));
    expect(result.current.cases.map((item) => item.id)).toEqual(["ca-1", "ca-4", "ca-2"]);
  });

  it("applies the sort on top of the text filter", () => {
    const { result } = renderUseCases();
    act(() => result.current.setFilters({ status: "active", text: "fernández" }));
    act(() => result.current.setSortBy("deadline"));
    expect(result.current.cases.map((item) => item.id)).toEqual(["ca-1", "ca-4"]);
  });
});
