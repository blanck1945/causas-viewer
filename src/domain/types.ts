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

export interface CaseNote {
  id: string;
  caseId: string;
  createdAt: string;
  text: string;
}

export interface ChecklistItem {
  id: string;
  caseId: string;
  label: string;
  done: boolean;
}
