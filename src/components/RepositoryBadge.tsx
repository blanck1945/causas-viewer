import { createLocalRepository } from "../data/repository";

// Muestra la cantidad de causas cargadas.
export function RepositoryBadge() {
  const count = createLocalRepository().listCases().length;
  return <span className="badge">{count}</span>;
}
