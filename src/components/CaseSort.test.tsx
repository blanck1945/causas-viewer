import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { es } from "../i18n/es";
import { CaseSort } from "./CaseSort";

describe("CaseSort", () => {
  it("shows the current sort option", () => {
    render(<CaseSort value="deadline" onChange={() => undefined} />);
    const select = screen.getByLabelText(es.sort.label) as HTMLSelectElement;
    expect(select.value).toBe("deadline");
  });

  it("offers both sort options", () => {
    render(<CaseSort value="none" onChange={() => undefined} />);
    const options = screen.getAllByRole("option").map((option) => option.textContent);
    expect(options).toEqual([es.sort.none, es.sort.deadline]);
  });

  it("reports the selected option", () => {
    const onChange = vi.fn();
    render(<CaseSort value="none" onChange={onChange} />);
    fireEvent.change(screen.getByLabelText(es.sort.label), { target: { value: "deadline" } });
    expect(onChange).toHaveBeenCalledWith("deadline");
  });
});
