import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import type { ChecklistItem } from "../domain/types";
import { ChecklistItemRow } from "./ChecklistItemRow";

const pending: ChecklistItem = { id: "ck-1", caseId: "ca-1", label: "Poder", done: false };

function renderRow(item: ChecklistItem, onToggle = vi.fn()) {
  render(
    <ul>
      <ChecklistItemRow item={item} onToggle={onToggle} />
    </ul>,
  );
  return onToggle;
}

describe("ChecklistItemRow", () => {
  it("shows an unchecked box for a pending item", () => {
    renderRow(pending);
    expect((screen.getByRole("checkbox") as HTMLInputElement).checked).toBe(false);
    expect(screen.getByText("Poder")).toBeTruthy();
  });

  it("shows a checked box and the done style for a completed item", () => {
    renderRow({ ...pending, done: true });
    expect((screen.getByRole("checkbox") as HTMLInputElement).checked).toBe(true);
    expect(screen.getByRole("listitem").className).toContain("done");
  });

  it("reports the item id when toggled", () => {
    const onToggle = renderRow(pending);
    fireEvent.click(screen.getByRole("checkbox"));
    expect(onToggle).toHaveBeenCalledWith("ck-1");
  });
});
