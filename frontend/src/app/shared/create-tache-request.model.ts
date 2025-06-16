export interface CreateTacheRequest {
    titre: string;
    description: string;
    dateDebut: Date;
    dateFin: Date;
    statut: string;
    progression: number;
    priorite: string;
    predecesseursIds?: number[];
    assigneId?: number;
    tags?: string[];
} 