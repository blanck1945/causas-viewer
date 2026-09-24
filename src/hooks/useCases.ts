import { useCallback, useMemo, useReducer, useState } from "react";
import { createLocalRepository, type Repository } from "../data/repository";
import { isOverdue, todayIso } from "../domain/deadlines";
import type { Case, CaseStatus, ProceduralEntry } from "../domain/types";

export type SortBy = "none" | "deadline";

export interface Filters {
  status: CaseStatus | "all";
  text: string;
}

interface UseCasesOptions {
  repository?: Repository;
  today?: string;
}

const DEFAULT_FILTERS: Filters = { status: "all", text: "" };

function matchesFilters(item: Case, filters: Filters): boolean {
  if (filters.status !== "all" && item.status !== filters.status) {
    return false;
  }
  const text = filters.text.trim().toLowerCase();
  if (text === "") {
    return true;
  }
  return (
    item.caption.toLowerCase().includes(text) ||
    item.fileNumber.toLowerCase().includes(text)
  );
}

function compareByDeadline(a: Case, b: Case): number {
  return (a.nextDeadline ?? "").localeCompare(b.nextDeadline ?? "");
}

export function useCases(options: UseCasesOptions = {}) {
  const { repository: injected } = options;
  const repository = useMemo(
    () => injected ?? createLocalRepository(),
    [injected],
  );
  const today = options.today ?? todayIso();

  const allCases = useMemo(() => repository.listCases(), [repository]);
  const clients = useMemo(() => repository.listClients(), [repository]);
  const [filters, setFilters] = useState<Filters>(DEFAULT_FILTERS);
  const [sortBy, setSortBy] = useState<SortBy>("none");
  const [, refresh] = useReducer((version: number) => version + 1, 0);

  const cases = useMemo(() => {
    const filtered = allCases.filter((item) => matchesFilters(item, filters));
    return sortBy === "deadline" ? [...filtered].sort(compareByDeadline) : filtered;
  }, [allCases, filters, sortBy]);
  const overdueCount = useMemo(
    () => allCases.filter((item) => isOverdue(item.nextDeadline, today)).length,
    [allCases, today],
  );

  const getEntries = useCallback(
    (caseId: string): ProceduralEntry[] => repository.listEntries(caseId),
    [repository],
  );

  const addEntry = useCallback(
    (caseId: string, date: string, description: string) => {
      repository.addEntry({ id: crypto.randomUUID(), caseId, date, description });
      refresh();
    },
    [repository],
  );

  return {
    cases,
    allCases,
    clients,
    filters,
    setFilters,
    sortBy,
    setSortBy,
    overdueCount,
    today,
    getEntries,
    addEntry,
  };
}
