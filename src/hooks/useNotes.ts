import { useCallback, useMemo, useReducer } from "react";
import { createLocalRepository, type Repository } from "../data/repository";
import type { CaseNote } from "../domain/types";

interface UseNotesOptions {
  repository?: Repository;
}

export function useNotes(
  caseId: string,
  options: UseNotesOptions = {},
): { notes: CaseNote[]; addNote: (text: string) => void } {
  const { repository: injected } = options;
  const repository = useMemo(() => injected ?? createLocalRepository(), [injected]);
  const [, refresh] = useReducer((version: number) => version + 1, 0);

  const addNote = useCallback(
    (text: string) => {
      repository.addNote({
        id: crypto.randomUUID(),
        caseId,
        createdAt: new Date().toISOString(),
        text,
      });
      refresh();
    },
    [repository, caseId],
  );

  return { notes: repository.listNotes(caseId), addNote };
}
