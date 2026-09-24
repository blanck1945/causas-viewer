import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { es } from "../i18n/es";
import { CaseFilters } from "./CaseFilters";

const defaults = { status: "all", text: "" } as const;

describe("CaseFilters", () => {
  it("offers every status plus the all option", () => {
    render(<CaseFilters filters={defaults} onChange={() => undefined} />);
    const options = screen.getAllByRole("option").map((option) => option.textContent);
    expect(options).toEqual([
      es.filters.allStatuses,
      es.status.active,
      es.status.archived,
      es.status.closed,
    ]);
  });

  it("reports a status change and keeps the text", () => {
    const onChange = vi.fn();
    render(<CaseFilters filters={{ status: "all", text: "abc" }} onChange={onChange} />);
    fireEvent.change(screen.getByLabelText(es.filters.status), {
      target: { value: "closed" },
    });
    expect(onChange).toHaveBeenCalledWith({ status: "closed", text: "abc" });
  });

  it("reports a text change and keeps the status", () => {
    const onChange = vi.fn();
    render(<CaseFilters filters={{ status: "active", text: "" }} onChange={onChange} />);
    fireEvent.change(screen.getByLabelText(es.filters.search), {
      target: { value: "banco" },
    });
    expect(onChange).toHaveBeenCalledWith({ status: "active", text: "banco" });
  });
});
