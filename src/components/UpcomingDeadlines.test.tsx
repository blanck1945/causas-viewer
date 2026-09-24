import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { describe, expect, it } from "vitest";
import type { Case } from "../domain/types";
import { es } from "../i18n/es";
import { UpcomingDeadlines } from "./UpcomingDeadlines";

// 2026-03-02 is a Monday, so the window ends on Monday 2026-03-09.
const TODAY = "2026-03-02";

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

function renderPanel(cases: Case[]) {
  return render(
    <MemoryRouter>
      <UpcomingDeadlines cases={cases} today={TODAY} />
    </MemoryRouter>,
  );
}

describe("UpcomingDeadlines", () => {
  it("lists the cases whose deadline is inside the window, nearest first", () => {
    renderPanel([
      makeCase({ id: "ca-1", caption: "Segunda causa", nextDeadline: "2026-03-06" }),
      makeCase({ id: "ca-2", caption: "Primera causa", nextDeadline: "2026-03-03" }),
    ]);
    const links = screen.getAllByRole("link").map((link) => link.textContent);
    expect(links).toEqual(["Primera causa", "Segunda causa"]);
    expect(screen.getAllByRole("link")[0]?.getAttribute("href")).toBe("/cases/ca-2");
  });

  it("leaves out overdue, distant, missing and inactive deadlines", () => {
    renderPanel([
      makeCase({ id: "ca-1", caption: "Vencida", nextDeadline: "2026-02-27" }),
      makeCase({ id: "ca-2", caption: "Lejana", nextDeadline: "2026-04-01" }),
      makeCase({ id: "ca-3", caption: "Sin plazo", nextDeadline: null }),
      makeCase({ id: "ca-4", caption: "Archivada", status: "archived", nextDeadline: "2026-03-04" }),
    ]);
    expect(screen.queryByRole("link")).toBeNull();
    expect(screen.getByText(es.upcoming.empty)).toBeTruthy();
  });
});
