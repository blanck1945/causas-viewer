import { render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it } from "vitest";
import { es } from "../i18n/es";
import { ClientList } from "./ClientList";

describe("ClientList", () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it("shows a row per client with contact data and case count", () => {
    render(<ClientList />);
    expect(screen.getAllByRole("row")).toHaveLength(4);
    expect(screen.getByText("María Fernández")).toBeTruthy();
    expect(screen.getByText("+54 11 5555-0103")).toBeTruthy();
    expect(screen.getByText("contacto@ledesma.example.com")).toBeTruthy();
  });

  it("shows the empty state when there are no clients", () => {
    window.localStorage.setItem("causas.cases", "[]");
    window.localStorage.setItem("causas.clients", "[]");
    render(<ClientList />);
    expect(screen.getByText(es.clients.empty)).toBeTruthy();
    expect(screen.queryByRole("table")).toBeNull();
  });
});
