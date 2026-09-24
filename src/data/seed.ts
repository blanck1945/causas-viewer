import type { Case, Client, ProceduralEntry } from "../domain/types";

export const seedClients: Client[] = [
  { id: "cl-1", name: "María Fernández", phone: "+54 11 5555-0101", email: "maria.fernandez@example.com" },
  { id: "cl-2", name: "Estudio Ledesma S.R.L.", phone: "+54 11 5555-0102", email: "contacto@ledesma.example.com" },
  { id: "cl-3", name: "Julián Ortega", phone: "+54 11 5555-0103", email: "julian.ortega@example.com" },
];

export const seedCases: Case[] = [
  { id: "ca-1", fileNumber: "12345/2025", caption: "Fernández c/ Banco del Sur s/ daños y perjuicios", court: "Juzgado Civil N° 4", clientId: "cl-1", status: "active", nextDeadline: "2026-01-15", createdAt: "2025-02-10" },
  { id: "ca-2", fileNumber: "20871/2024", caption: "Ledesma S.R.L. s/ concurso preventivo", court: "Juzgado Comercial N° 12", clientId: "cl-2", status: "active", nextDeadline: "2099-12-01", createdAt: "2024-08-05" },
  { id: "ca-3", fileNumber: "7710/2023", caption: "Ortega c/ Ortega s/ alimentos", court: "Juzgado de Familia N° 2", clientId: "cl-3", status: "archived", nextDeadline: null, createdAt: "2023-05-22" },
  { id: "ca-4", fileNumber: "30412/2025", caption: "Fernández s/ sucesión ab intestato", court: "Juzgado Civil N° 9", clientId: "cl-1", status: "active", nextDeadline: "2099-06-30", createdAt: "2025-06-18" },
  { id: "ca-5", fileNumber: "5528/2022", caption: "Ledesma S.R.L. c/ Transportes Rápidos s/ cobro de pesos", court: "Juzgado Comercial N° 3", clientId: "cl-2", status: "closed", nextDeadline: null, createdAt: "2022-11-03" },
];

export const seedEntries: ProceduralEntry[] = [
  { id: "en-1", caseId: "ca-1", date: "2025-02-10", description: "Presentación de la demanda." },
  { id: "en-2", caseId: "ca-1", date: "2025-04-02", description: "Traslado de la demanda al banco." },
  { id: "en-3", caseId: "ca-1", date: "2025-09-12", description: "Audiencia de prueba fijada." },
  { id: "en-4", caseId: "ca-2", date: "2024-08-05", description: "Solicitud de concurso preventivo." },
  { id: "en-5", caseId: "ca-2", date: "2024-10-21", description: "Designación de síndico." },
  { id: "en-6", caseId: "ca-3", date: "2023-05-22", description: "Inicio del juicio de alimentos." },
  { id: "en-7", caseId: "ca-3", date: "2024-01-30", description: "Acuerdo homologado y archivo." },
  { id: "en-8", caseId: "ca-5", date: "2023-03-14", description: "Sentencia de cobro firme y cumplida." },
];
