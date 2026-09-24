import { fireEvent, render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { beforeEach, describe, expect, it } from "vitest";
import { App } from "./App";
import { es } from "./i18n/es";

function renderAt(path: string) {
  return render(
    <MemoryRouter initialEntries={[path]}>
      <App />
    </MemoryRouter>,
  );
}

describe("App", () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it("renders the app title", () => {
    renderAt("/");
    expect(screen.getByRole("heading", { name: es.appTitle })).toBeTruthy();
  });

  it("lists the cases on the home route", () => {
    renderAt("/");
    expect(screen.getAllByRole("row")).toHaveLength(6);
  });

  it("filters the list by text", () => {
    renderAt("/");
    fireEvent.change(screen.getByLabelText(es.filters.search), {
      target: { value: "alimentos" },
    });
    expect(screen.getAllByRole("row")).toHaveLength(2);
  });

  it("navigates from the list to the case detail", () => {
    renderAt("/");
    fireEvent.click(screen.getByRole("link", { name: /sucesión ab intestato/ }));
    expect(screen.getByRole("heading", { name: /sucesión ab intestato/ })).toBeTruthy();
    expect(screen.getByText(es.timeline.empty)).toBeTruthy();
  });

  it("renders the detail route directly", () => {
    renderAt("/cases/ca-2");
    expect(screen.getByRole("heading", { name: /concurso preventivo/ })).toBeTruthy();
  });

  it("renders the clients page and links to it from the navigation", () => {
    renderAt("/");
    fireEvent.click(screen.getByRole("link", { name: es.nav.clients }));
    expect(screen.getByRole("heading", { name: es.clients.title })).toBeTruthy();
    expect(screen.getByText("Julián Ortega")).toBeTruthy();
  });
});
