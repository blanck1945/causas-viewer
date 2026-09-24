import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import type { CaseNote } from "../domain/types";
import { NoteList } from "./NoteList";

const notes: CaseNote[] = [
  { id: "no-1", caseId: "ca-1", createdAt: "2026-01-05T09:00:00.000Z", text: "Primera nota." },
  { id: "no-2", caseId: "ca-1", createdAt: "2026-02-10T09:00:00.000Z", text: "Segunda nota." },
];

describe("NoteList", () => {
  it("shows the newest note first with its date", () => {
    render(<NoteList notes={notes} />);
    const items = screen.getAllByRole("listitem").map((item) => item.textContent);
    expect(items).toEqual(["2026-02-10Segunda nota.", "2026-01-05Primera nota."]);
  });

  it("does not mutate the notes it receives", () => {
    const original = [...notes];
    render(<NoteList notes={notes} />);
    expect(notes).toEqual(original);
  });

  it("renders an empty list without notes", () => {
    render(<NoteList notes={[]} />);
    expect(screen.queryAllByRole("listitem")).toEqual([]);
  });
});
