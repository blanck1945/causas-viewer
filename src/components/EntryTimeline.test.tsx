import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import type { ProceduralEntry } from "../domain/types";
import { es } from "../i18n/es";
import { EntryTimeline } from "./EntryTimeline";

const entries: ProceduralEntry[] = [
  { id: "en-2", caseId: "ca-1", date: "2026-03-10", description: "Segunda actuación." },
  { id: "en-1", caseId: "ca-1", date: "2026-01-05", description: "Primera actuación." },
  { id: "en-3", caseId: "ca-1", date: "2026-02-20", description: "Actuación intermedia." },
];

describe("EntryTimeline", () => {
  it("sorts the entries by date", () => {
    render(<EntryTimeline entries={entries} />);
    const items = screen.getAllByRole("listitem").map((item) => item.textContent);
    expect(items).toEqual([
      "2026-01-05Primera actuación.",
      "2026-02-20Actuación intermedia.",
      "2026-03-10Segunda actuación.",
    ]);
  });

  it("does not mutate the entries it receives", () => {
    const original = [...entries];
    render(<EntryTimeline entries={entries} />);
    expect(entries).toEqual(original);
  });

  it("shows the empty state without entries", () => {
    render(<EntryTimeline entries={[]} />);
    expect(screen.getByText(es.timeline.empty)).toBeTruthy();
    expect(screen.queryByRole("list")).toBeNull();
  });
});
