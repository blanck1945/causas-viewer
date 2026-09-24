import type { ProceduralEntry } from "../domain/types";
import { es } from "../i18n/es";

interface EntryTimelineProps {
  entries: ProceduralEntry[];
}

function byDate(a: ProceduralEntry, b: ProceduralEntry): number {
  return a.date.localeCompare(b.date) || a.id.localeCompare(b.id);
}

export function EntryTimeline({ entries }: EntryTimelineProps) {
  return (
    <section className="timeline">
      <h2>{es.timeline.title}</h2>
      {entries.length === 0 ? (
        <p className="empty">{es.timeline.empty}</p>
      ) : (
        <ol>
          {[...entries].sort(byDate).map((entry) => (
            <li key={entry.id}>
              <time dateTime={entry.date}>{entry.date}</time>
              <span>{entry.description}</span>
            </li>
          ))}
        </ol>
      )}
    </section>
  );
}
