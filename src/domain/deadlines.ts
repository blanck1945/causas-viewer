const DAY_MS = 24 * 60 * 60 * 1000;

function parseIso(iso: string): Date {
  const date = new Date(`${iso}T00:00:00Z`);
  if (Number.isNaN(date.getTime())) {
    throw new Error(`Invalid ISO date: ${iso}`);
  }
  return date;
}

function toIso(date: Date): string {
  return date.toISOString().slice(0, 10);
}

function isBusinessDay(date: Date, holidays: ReadonlySet<string>): boolean {
  const weekday = date.getUTCDay();
  return weekday !== 0 && weekday !== 6 && !holidays.has(toIso(date));
}

/** Adds `days` business days (Monday to Friday, minus holidays) to an ISO date. */
export function addBusinessDays(
  startIso: string,
  days: number,
  holidays: readonly string[] = [],
): string {
  if (!Number.isInteger(days) || days < 0) {
    throw new Error(`Invalid number of days: ${days}`);
  }
  const holidaySet = new Set(holidays);
  const current = parseIso(startIso);
  let remaining = days;
  while (remaining > 0) {
    current.setTime(current.getTime() + DAY_MS);
    if (isBusinessDay(current, holidaySet)) {
      remaining -= 1;
    }
  }
  return toIso(current);
}

/** A deadline is overdue when it is strictly before today. A null deadline never is. */
export function isOverdue(deadlineIso: string | null, todayIso: string): boolean {
  if (deadlineIso === null) {
    return false;
  }
  return parseIso(deadlineIso).getTime() < parseIso(todayIso).getTime();
}
