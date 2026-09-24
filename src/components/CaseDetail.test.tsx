import { fireEvent, render, screen } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { beforeEach, describe, expect, it } from "vitest";
import { es } from "../i18n/es";
import { CaseDetail } from "./CaseDetail";

function renderDetail(id: string) {
  return render(
    <MemoryRouter initialEntries={[`/cases/${id}`]}>
      <Routes>
        <Route path="/cases/:id" element={<CaseDetail />} />
      </Routes>
    </MemoryRouter>,
  );
}

describe("CaseDetail", () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it("shows the case and its client", () => {
    renderDetail("ca-1");
    expect(screen.getByRole("heading", { name: /Banco del Sur/ })).toBeTruthy();
    expect(screen.getByText("Juzgado Civil N° 4")).toBeTruthy();
    expect(screen.getByText("María Fernández")).toBeTruthy();
    expect(screen.getByText("maria.fernandez@example.com")).toBeTruthy();
  });

  it("shows the entries of the case", () => {
    renderDetail("ca-1");
    expect(screen.getByText("Presentación de la demanda.")).toBeTruthy();
    expect(screen.queryByText("Designación de síndico.")).toBeNull();
  });

  it("shows a not-found message for an unknown case", () => {
    renderDetail("missing");
    expect(screen.getByRole("alert").textContent).toBe(es.detail.notFound);
  });

  it("adds a new entry to the timeline", () => {
    renderDetail("ca-4");
    expect(screen.getByText(es.timeline.empty)).toBeTruthy();

    fireEvent.change(screen.getByLabelText(es.entryForm.date), {
      target: { value: "2026-05-20" },
    });
    fireEvent.change(screen.getByLabelText(es.entryForm.description), {
      target: { value: "Escrito presentado." },
    });
    fireEvent.click(screen.getByRole("button", { name: es.entryForm.submit }));

    expect(screen.getByText("Escrito presentado.")).toBeTruthy();
    expect(screen.queryByText(es.timeline.empty)).toBeNull();
    expect((screen.getByLabelText(es.entryForm.description) as HTMLTextAreaElement).value).toBe("");
  });

  it("rejects an entry without description", () => {
    renderDetail("ca-4");
    fireEvent.change(screen.getByLabelText(es.entryForm.description), {
      target: { value: "   " },
    });
    fireEvent.click(screen.getByRole("button", { name: es.entryForm.submit }));

    expect(screen.getByRole("alert").textContent).toBe(es.entryForm.required);
    expect(screen.getByText(es.timeline.empty)).toBeTruthy();
  });
});
