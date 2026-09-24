import { fireEvent, render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { es } from "../i18n/es";
import { CaseExportButton } from "./CaseExportButton";

describe("CaseExportButton", () => {
  beforeEach(() => {
    window.localStorage.clear();
    URL.createObjectURL = vi.fn(() => "blob:causas");
    URL.revokeObjectURL = vi.fn();
  });

  it("downloads a CSV file with the stored cases", () => {
    const click = vi.spyOn(HTMLAnchorElement.prototype, "click").mockImplementation(() => undefined);
    render(<CaseExportButton />);

    fireEvent.click(screen.getByRole("button", { name: es.csv.button }));

    expect(click).toHaveBeenCalledTimes(1);
    const blob = vi.mocked(URL.createObjectURL).mock.calls[0]?.[0];
    expect(blob).toBeInstanceOf(Blob);
    expect((blob as Blob).type).toBe("text/csv;charset=utf-8");
    expect(URL.revokeObjectURL).toHaveBeenCalledWith("blob:causas");
  });

  it("exports the file even when there are no cases", () => {
    window.localStorage.setItem("causas.cases", "[]");
    const click = vi.spyOn(HTMLAnchorElement.prototype, "click").mockImplementation(() => undefined);
    render(<CaseExportButton />);

    fireEvent.click(screen.getByRole("button", { name: es.csv.button }));

    expect(click).toHaveBeenCalledTimes(1);
    expect(URL.createObjectURL).toHaveBeenCalledTimes(1);
  });
});
