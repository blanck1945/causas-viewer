import type { SortBy } from "../hooks/useCases";
import { es } from "../i18n/es";

interface CaseSortProps {
  value: SortBy;
  onChange: (value: SortBy) => void;
}

export function CaseSort({ value, onChange }: CaseSortProps) {
  return (
    <div className="sort">
      <label>
        {es.sort.label}
        <select value={value} onChange={(event) => onChange(event.target.value as SortBy)}>
          <option value="none">{es.sort.none}</option>
          <option value="deadline">{es.sort.deadline}</option>
        </select>
      </label>
    </div>
  );
}
