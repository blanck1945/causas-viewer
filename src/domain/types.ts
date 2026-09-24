export type CaseStatus = "active" | "archived" | "closed";

export interface Case {
  id: string;
  fileNumber: string;
  caption: string;
  court: string;
  clientId: string;
  status: CaseStatus;
  nextDeadline: string | null;
  createdAt: string;
}

export interface Client {
  id: string;
  name: string;
  phone: string;
  email: string;
}

export interface ProceduralEntry {
  id: string;
  caseId: string;
  date: string;
  description: string;
}
