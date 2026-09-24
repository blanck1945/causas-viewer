import type { Case } from "./types";

function escapeField(value: string): string {
  if (/[",\r\n]/.test(value)) {
    return `"${value.replaceAll('"', '""')}"`;
  }
  return value;
}

/** Serializes cases as CSV text, one row per case, preceded by the given header row. */
export function casesToCsv(cases: readonly Case[], headers: readonly string[]): string {
  const rows = cases.map((item) => [
    item.fileNumber,
    item.caption,
    item.court,
    item.status,
    item.nextDeadline ?? "",
  ]);
  return [headers, ...rows].map((row) => row.map(escapeField).join(",")).join("\r\n");
}
