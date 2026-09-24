import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { es } from "../i18n/es";
import { ChecklistProgress } from "./ChecklistProgress";

describe("ChecklistProgress", () => {
  it("shows how many items are done", () => {
    render(<ChecklistProgress done={2} total={5} />);
    expect(screen.getByText(`2/5 ${es.workspace.checklist.progress}`)).toBeTruthy();
    const bar = screen.getByRole("progressbar") as HTMLProgressElement;
    expect(bar.value).toBe(2);
    expect(bar.max).toBe(5);
  });

  it("renders nothing when the checklist is empty", () => {
    const { container } = render(<ChecklistProgress done={0} total={0} />);
    expect(container.firstChild).toBeNull();
  });
});
