import { useMemo } from "react";
import { createLocalRepository, type Repository } from "../data/repository";
import type { Client } from "../domain/types";

interface UseClientsOptions {
  repository?: Repository;
}

export interface ClientSummary {
  client: Client;
  caseCount: number;
}

export function useClients(options: UseClientsOptions = {}): { clients: ClientSummary[] } {
  const { repository: injected } = options;
  const repository = useMemo(() => injected ?? createLocalRepository(), [injected]);

  const clients = useMemo(() => {
    const caseCounts = new Map<string, number>();
    for (const item of repository.listCases()) {
      caseCounts.set(item.clientId, (caseCounts.get(item.clientId) ?? 0) + 1);
    }
    return repository
      .listClients()
      .map((client) => ({ client, caseCount: caseCounts.get(client.id) ?? 0 }))
      .sort((a, b) => a.client.name.localeCompare(b.client.name));
  }, [repository]);

  return { clients };
}
