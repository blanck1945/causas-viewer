import { fireEvent, render, screen } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { beforeEach, describe, expect, it } from "vitest";
import { es } from "../i18n/es";
import { CaseWorkspace } from "./CaseWorkspace";

function renderWorkspace(id: string) {
  return render(
    <MemoryRouter initialEntries={[`/cases/${id}/workspace`]}>
      <Routes>
        <Route path="/cases/:id/workspace" element={<CaseWorkspace />} />
      </Routes>
    </MemoryRouter>,
  );
}

function addNote(text: string) {
  fireEvent.change(screen.getByLabelText(es.workspace.notes.placeholder), {
    target: { value: text },
  });
  fireEvent.click(screen.getByRole("button", { name: es.workspace.notes.add }));
}

function addItem(label: string) {
  fireEvent.change(screen.getByLabelText(es.workspace.checklist.newItem), {
    target: { value: label },
  });
  fireEvent.click(screen.getByRole("button", { name: es.workspace.checklist.add }));
}

describe("CaseWorkspace", () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it("shows the case caption and the empty states", () => {
    renderWorkspace("ca-1");
    expect(screen.getByText(/Banco del Sur/)).toBeTruthy();
    expect(screen.getByText(es.workspace.notes.empty)).toBeTruthy();
    expect(screen.getByText(es.workspace.checklist.empty)).toBeTruthy();
  });

  it("shows a not-found message for an unknown case", () => {
    renderWorkspace("missing");
    expect(screen.getByRole("alert").textContent).toBe(es.detail.notFound);
  });

  it("adds a note and clears the form", () => {
    renderWorkspace("ca-1");
    addNote("Llamar al cliente.");
    expect(screen.getByText("Llamar al cliente.")).toBeTruthy();
    expect(screen.queryByText(es.workspace.notes.empty)).toBeNull();
  });

  it("rejects an empty note", () => {
    renderWorkspace("ca-1");
    addNote("   ");
    expect(screen.getByRole("alert").textContent).toBe(es.workspace.notes.required);
  });

  it("filters the notes by text and reports when nothing matches", () => {
    renderWorkspace("ca-1");
    addNote("Llamar al cliente.");
    addNote("Revisar el expediente.");
    const search = screen.getByLabelText(es.workspace.notes.search);

    fireEvent.change(search, { target: { value: "expediente" } });
    expect(screen.queryByText("Llamar al cliente.")).toBeNull();
    expect(screen.getByText("Revisar el expediente.")).toBeTruthy();

    fireEvent.change(search, { target: { value: "zzz" } });
    expect(screen.getByText(es.workspace.notes.noMatches)).toBeTruthy();
  });

  it("adds checklist items, toggles them and reports the progress", () => {
    renderWorkspace("ca-1");
    addItem("Poder firmado");
    fireEvent.click(screen.getByRole("checkbox", { name: "Poder firmado" }));
    expect(screen.getByText(`1/1 ${es.workspace.checklist.progress}`)).toBeTruthy();
    expect(screen.getByText(es.workspace.checklist.allDone)).toBeTruthy();
  });

  it("rejects an empty checklist item", () => {
    renderWorkspace("ca-1");
    addItem("");
    expect(screen.getByRole("alert").textContent).toBe(es.workspace.checklist.required);
  });

  it("adds a suggested document with one click and stops suggesting it", () => {
    renderWorkspace("ca-1");
    fireEvent.click(screen.getByRole("button", { name: "Poder" }));
    expect(screen.getByRole("checkbox", { name: "Poder" })).toBeTruthy();
    expect(screen.queryByRole("button", { name: "Poder" })).toBeNull();
  });

  it("hides the completed documents on demand", () => {
    renderWorkspace("ca-1");
    addItem("Poder firmado");
    addItem("Copia del contrato");
    fireEvent.click(screen.getByRole("checkbox", { name: "Poder firmado" }));
    fireEvent.click(screen.getByLabelText(es.workspace.checklist.hideDone));
    expect(screen.queryByRole("checkbox", { name: "Poder firmado" })).toBeNull();
    expect(screen.getByRole("checkbox", { name: "Copia del contrato" })).toBeTruthy();
  });
});
