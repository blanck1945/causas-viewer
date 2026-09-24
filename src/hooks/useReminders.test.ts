import { renderHook } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { createRepository } from "../data/repository";
import type { Case } from "../domain/types";
import { useReminders } from "./useReminders";

function createMemoryStorage() {
  const data = new Map<string, string>();
  return {
    getItem: (key: string) => data.get(key) ?? null,
    setItem: (key: string, value: string) => {
      data.set(key, value);
    },
  };
}

function makeCase(overrides: Partial<Case>): Case {
  return {
    id: "ca-x",
    fileNumber: "1/2026",
    caption: "Pérez c/ Gómez",
    court: "Juzgado Civil N° 1",
    clientId: "cl-1",
    status: "active",
    nextDeadline: null,
    createdAt: "2026-01-01",
    ...overrides,
  };
}

function renderReminders(cases: Case[], today: string, withinDays?: number) {
  const repository = createRepository(createMemoryStorage());
  cases.forEach((item) => repository.saveCase(item));
  return renderHook(() => useReminders({ repository, today, withinDays }));
}

describe("useReminders", () => {
  it("returns the cases whose deadline is near, nearest first", () => {
    // 2026-03-02 is a Monday.
    const { result } = renderReminders(
      [
        makeCase({ id: "ca-a", nextDeadline: "2026-03-05" }),
        makeCase({ id: "ca-b", nextDeadline: "2026-03-03" }),
      ],
      "2026-03-02",
    );
    expect(result.current.reminders.map((item) => [item.caseId, item.businessDaysLeft])).toEqual([
      ["ca-b", 1],
      ["ca-a", 3],
    ]);
  });

  it("does not count weekends as business days", () => {
    // 2026-03-06 is a Friday and 2026-03-09 the following Monday.
    const { result } = renderReminders(
      [makeCase({ id: "ca-a", nextDeadline: "2026-03-09" })],
      "2026-03-06",
    );
    expect(result.current.reminders[0]?.businessDaysLeft).toBe(1);
  });

  it("skips distant, overdue, missing and inactive deadlines", () => {
    const { result } = renderReminders(
      [
        makeCase({ id: "ca-a", nextDeadline: "2026-03-20" }),
        makeCase({ id: "ca-b", nextDeadline: "2026-02-27" }),
        makeCase({ id: "ca-c", nextDeadline: null }),
        makeCase({ id: "ca-d", status: "closed", nextDeadline: "2026-03-03" }),
      ],
      "2026-03-02",
    );
    expect(result.current.reminders).toEqual([]);
  });

  it("honors a custom window", () => {
    const cases = [makeCase({ id: "ca-a", nextDeadline: "2026-03-05" })];
    expect(renderReminders(cases, "2026-03-02", 2).result.current.reminders).toEqual([]);
    expect(renderReminders(cases, "2026-03-02", 3).result.current.reminders).toHaveLength(1);
  });
});
