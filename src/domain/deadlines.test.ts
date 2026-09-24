import { describe, expect, it } from "vitest";
import { addBusinessDays, isOverdue, isWithinBusinessDays, todayIso } from "./deadlines";

describe("addBusinessDays", () => {
  it("adds business days within the same week", () => {
    // 2026-03-02 is a Monday.
    expect(addBusinessDays("2026-03-02", 3)).toBe("2026-03-05");
  });

  it("skips weekends", () => {
    // 2026-03-06 is a Friday.
    expect(addBusinessDays("2026-03-06", 1)).toBe("2026-03-09");
    expect(addBusinessDays("2026-03-06", 6)).toBe("2026-03-16");
  });

  it("starts counting from the next day when the start is a weekend", () => {
    // 2026-03-07 is a Saturday.
    expect(addBusinessDays("2026-03-07", 1)).toBe("2026-03-09");
  });

  it("skips the holidays passed as a parameter", () => {
    expect(addBusinessDays("2026-03-02", 3, ["2026-03-04"])).toBe("2026-03-06");
  });

  it("skips a holiday that falls right before a weekend", () => {
    expect(addBusinessDays("2026-03-05", 1, ["2026-03-06"])).toBe("2026-03-09");
  });

  it("returns the start date when adding zero days", () => {
    expect(addBusinessDays("2026-03-07", 0)).toBe("2026-03-07");
  });

  it("rejects invalid dates", () => {
    expect(() => addBusinessDays("not-a-date", 1)).toThrow("Invalid ISO date");
  });

  it("rejects negative or fractional day counts", () => {
    expect(() => addBusinessDays("2026-03-02", -1)).toThrow("Invalid number of days");
    expect(() => addBusinessDays("2026-03-02", 1.5)).toThrow("Invalid number of days");
  });
});

describe("isOverdue", () => {
  it("is true when the deadline is before today", () => {
    expect(isOverdue("2026-03-01", "2026-03-02")).toBe(true);
  });

  it("is false when the deadline is today or later", () => {
    expect(isOverdue("2026-03-02", "2026-03-02")).toBe(false);
    expect(isOverdue("2026-03-03", "2026-03-02")).toBe(false);
  });

  it("is false when there is no deadline", () => {
    expect(isOverdue(null, "2026-03-02")).toBe(false);
  });

  it("rejects invalid dates", () => {
    expect(() => isOverdue("2026-13-45", "2026-03-02")).toThrow("Invalid ISO date");
  });
});

describe("todayIso", () => {
  it("formats the given date as an ISO date", () => {
    expect(todayIso(new Date("2026-03-02T15:30:00Z"))).toBe("2026-03-02");
  });
});

describe("isWithinBusinessDays", () => {
  // 2026-03-02 is a Monday, so 5 business days ahead is Monday 2026-03-09.
  it("is true for a deadline inside the window", () => {
    expect(isWithinBusinessDays("2026-03-05", "2026-03-02", 5)).toBe(true);
  });

  it("includes today and the last day of the window", () => {
    expect(isWithinBusinessDays("2026-03-02", "2026-03-02", 5)).toBe(true);
    expect(isWithinBusinessDays("2026-03-09", "2026-03-02", 5)).toBe(true);
  });

  it("is false after the window", () => {
    expect(isWithinBusinessDays("2026-03-10", "2026-03-02", 5)).toBe(false);
  });

  it("extends the window over weekends and holidays", () => {
    expect(isWithinBusinessDays("2026-03-10", "2026-03-02", 5, ["2026-03-04"])).toBe(true);
  });

  it("is false for overdue or missing deadlines", () => {
    expect(isWithinBusinessDays("2026-03-01", "2026-03-02", 5)).toBe(false);
    expect(isWithinBusinessDays(null, "2026-03-02", 5)).toBe(false);
  });
});
