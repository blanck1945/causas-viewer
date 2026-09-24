import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { describe, expect, it } from "vitest";
import type { Case } from "../domain/types";
import { es } from "../i18n/es";
import { CaseList } from "./CaseList";

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

function renderList(cases: Case[]) {
  return render(
    <MemoryRouter>
      <CaseList cases={cases} today="2026-06-01" />
    </MemoryRouter>,
  );
}

describe("CaseList", () => {
  it("shows the case data and links to the detail", () => {
    renderList([makeCase({ id: "ca-7", status: "archived", court: "Juzgado Civil N° 5" })]);
    expect(screen.getByText("1/2026")).toBeTruthy();
    expect(screen.getByText("Juzgado Civil N° 5")).toBeTruthy();
    expect(screen.getByText(es.status.archived)).toBeTruthy();
    expect(screen.getByRole("link", { name: "Pérez c/ Gómez" }).getAttribute("href")).toBe(
      "/cases/ca-7",
    );
  });

  it("highlights an overdue deadline", () => {
    renderList([makeCase({ nextDeadline: "2026-05-01" })]);
    const cell = screen.getByText(new RegExp(es.list.overdue));
    expect(cell.className).toBe("overdue");
  });

  it("does not highlight a future deadline", () => {
    renderList([makeCase({ nextDeadline: "2026-07-01" })]);
    expect(screen.getByText("2026-07-01").className).toBe("");
    expect(screen.queryByText(new RegExp(es.list.overdue))).toBeNull();
  });

  it("shows a placeholder when there is no deadline", () => {
    renderList([makeCase({ nextDeadline: null })]);
    expect(screen.getByText(es.list.noDeadline)).toBeTruthy();
  });

  it("shows the empty state without cases", () => {
    renderList([]);
    expect(screen.getByText(es.list.empty)).toBeTruthy();
    expect(screen.queryByRole("table")).toBeNull();
  });
});
