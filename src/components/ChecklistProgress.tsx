import { es } from "../i18n/es";

interface ChecklistProgressProps {
  done: number;
  total: number;
}

export function ChecklistProgress({ done, total }: ChecklistProgressProps) {
  if (total === 0) {
    return null;
  }

  return (
    <div className="checklist-progress">
      <progress value={done} max={total} />
      <span>
        {done}/{total} {es.workspace.checklist.progress}
      </span>
    </div>
  );
}
