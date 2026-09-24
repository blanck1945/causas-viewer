import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { describe, expect, it } from "vitest";
import type { Reminder } from "../hooks/useReminders";
import { es } from "../i18n/es";
import { ReminderList } from "./ReminderList";

const reminders: Reminder[] = [
  { caseId: "ca-1", caption: "Fernández c/ Banco", deadline: "2026-03-03", businessDaysLeft: 1 },
  { caseId: "ca-2", caption: "Ledesma s/ concurso", deadline: "2026-03-05", businessDaysLeft: 3 },
];

function renderList(items: Reminder[]) {
  return render(
    <MemoryRouter>
      <ReminderList reminders={items} />
    </MemoryRouter>,
  );
}

describe("ReminderList", () => {
  it("shows a link and the remaining business days for each reminder", () => {
    renderList(reminders);
    expect(screen.getAllByRole("listitem")).toHaveLength(2);
    expect(screen.getByRole("link", { name: "Ledesma s/ concurso" }).getAttribute("href")).toBe(
      "/cases/ca-2",
    );
    expect(screen.getByText(`2026-03-03 · 1 ${es.reminders.daysLeft}`)).toBeTruthy();
  });

  it("shows the empty state without reminders", () => {
    renderList([]);
    expect(screen.getByText(es.reminders.empty)).toBeTruthy();
    expect(screen.queryByRole("list")).toBeNull();
  });
});
