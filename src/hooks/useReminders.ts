import { useMemo } from "react";
import { createLocalRepository, type Repository } from "../data/repository";
import { isOverdue, todayIso } from "../domain/deadlines";

export interface Reminder {
  caseId: string;
  caption: string;
  deadline: string;
  businessDaysLeft: number;
}

interface UseRemindersOptions {
  repository?: Repository;
  today?: string;
  withinDays?: number;
}

const DEFAULT_WITHIN_DAYS = 3;

// Cuenta solo los días hábiles entre ambas fechas.
function businessDaysBetween(fromIso: string, toIso: string): number {
  const end = new Date(`${toIso}T00:00:00Z`);
  const cursor = new Date(`${fromIso}T00:00:00Z`);
  let count = 0;
  while (cursor < end) {
    cursor.setUTCDate(cursor.getUTCDate() + 1);
    const weekday = cursor.getUTCDay();
    if (weekday !== 0 && weekday !== 6) {
      count += 1;
    }
  }
  return count;
}

export function useReminders(options: UseRemindersOptions = {}): { reminders: Reminder[] } {
  const { repository: injected, withinDays = DEFAULT_WITHIN_DAYS } = options;
  const repository = useMemo(() => injected ?? createLocalRepository(), [injected]);
  const today = options.today ?? todayIso();

  const reminders = useMemo(() => {
    const result: Reminder[] = [];
    for (const item of repository.listCases()) {
      // Only active cases with a pending deadline need a reminder.
      if (item.status !== "active" || item.nextDeadline === null) {
        continue;
      }
      if (isOverdue(item.nextDeadline, today)) {
        continue;
      }
      const businessDaysLeft = businessDaysBetween(today, item.nextDeadline);
      if (businessDaysLeft <= withinDays) {
        result.push({
          caseId: item.id,
          caption: item.caption,
          deadline: item.nextDeadline,
          businessDaysLeft,
        });
      }
    }
    return result.sort((a, b) => a.deadline.localeCompare(b.deadline));
  }, [repository, today, withinDays]);

  return { reminders };
}
