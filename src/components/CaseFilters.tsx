import type { Filters } from "../hooks/useCases";
import { es } from "../i18n/es";

interface CaseFiltersProps {
  filters: Filters;
  onChange: (filters: Filters) => void;
}

const STATUSES = ["active", "archived", "closed"] as const;

export function CaseFilters({ filters, onChange }: CaseFiltersProps) {
  return (
    <form className="filters" onSubmit={(event) => event.preventDefault()}>
      <label>
        {es.filters.status}
        <select
          value={filters.status}
          onChange={(event) =>
            onChange({ ...filters, status: event.target.value as Filters["status"] })
          }
        >
          <option value="all">{es.filters.allStatuses}</option>
          {STATUSES.map((status) => (
            <option key={status} value={status}>
              {es.status[status]}
            </option>
          ))}
        </select>
      </label>
      <label>
        {es.filters.search}
        <input
          type="search"
          value={filters.text}
          placeholder={es.filters.searchPlaceholder}
          onChange={(event) => onChange({ ...filters, text: event.target.value })}
        />
      </label>
    </form>
  );
}
