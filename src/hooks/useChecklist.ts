import { useMemo, useReducer } from "react";
import { createLocalRepository, type Repository } from "../data/repository";
import type { ChecklistItem } from "../domain/types";

interface UseChecklistOptions {
  repository?: Repository;
}

interface UseChecklistResult {
  items: ChecklistItem[];
  doneCount: number;
  addItem: (label: string) => void;
  toggleItem: (id: string) => void;
}

export function useChecklist(
  caseId: string,
  options: UseChecklistOptions = {},
): UseChecklistResult {
  const { repository: injected } = options;
  const repository = useMemo(() => injected ?? createLocalRepository(), [injected]);
  const [, refresh] = useReducer((version: number) => version + 1, 0);

  const items = repository.listChecklist(caseId);

  function addItem(label: string) {
    repository.saveChecklistItem({ id: crypto.randomUUID(), caseId, label, done: false });
    refresh();
  }

  function toggleItem(id: string) {
    const current = items.find((item) => item.id === id);
    if (!current) {
      return;
    }
    repository.saveChecklistItem({ ...current, done: !current.done });
    refresh();
  }

  return { items, doneCount: items.filter((item) => item.done).length, addItem, toggleItem };
}
