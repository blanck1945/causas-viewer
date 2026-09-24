import { Link } from "react-router-dom";
import type { Reminder } from "../hooks/useReminders";
import { es } from "../i18n/es";

interface ReminderListProps {
  reminders: Reminder[];
}

export function ReminderList({ reminders }: ReminderListProps) {
  return (
    <section className="reminders">
      <h2>Recordatorios</h2>
      {reminders.length === 0 ? (
        <p className="empty">{es.reminders.empty}</p>
      ) : (
        <ul>
          {reminders.map((item) => (
            <li key={item.caseId}>
              <Link to={`/cases/${item.caseId}`}>{item.caption}</Link>
              <span>
                {item.deadline} · {item.businessDaysLeft} {es.reminders.daysLeft}
              </span>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
