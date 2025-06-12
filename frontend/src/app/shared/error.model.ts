export interface Error {
  id: number;
  titre: string;
  description: string;
  status: string;
  priorite: string;
  dateCreation: Date;
  dateResolution?: Date;
  projetId: number;
  assigneId?: number;
  createurId: number;
} 