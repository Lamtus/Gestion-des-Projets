export interface Log {
  id: number;
  niveau: string;
  message: string;
  dateLog: Date;
  userId?: number;
  projetId?: number;
  tacheId?: number;
  commentaireId?: number;
  errorId?: number;
} 