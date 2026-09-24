import { Link } from "react-router-dom";
import { UPCOMING_DEADLINE_DAYS, isWithinBusinessDays } from "../domain/deadlines";
import type { Case } from "../domain/types";
import { es } from "../i18n/es";

interface UpcomingDeadlinesProps {
  cases: Case[];
  today: string;
}

export function UpcomingDeadlines({ cases, today }: UpcomingDeadlinesProps) {
  const upcoming = cases
    .filter(
      (item) =>
        item.status === "active" &&
        isWithinBusinessDays(item.nextDeadline, today, UPCOMING_DEADLINE_DAYS),
    )
    .sort((a, b) => (a.nextDeadline ?? "").localeCompare(b.nextDeadline ?? ""));

  return (
    <section className="upcoming">
      <h2>{es.upcoming.title}</h2>
      {upcoming.length === 0 ? (
        <p className="empty">{es.upcoming.empty}</p>
      ) : (
        <ul>
          {upcoming.map((item) => (
            <li key={item.id}>
              <time dateTime={item.nextDeadline ?? undefined}>{item.nextDeadline}</time>
              <Link to={`/cases/${item.id}`}>{item.caption}</Link>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
