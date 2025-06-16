import { Role } from './user.model';

export interface UserWithProjectCountDto {
    id: number;
    nom: string;
    prenom: string;
    poste: string;
    departement: string;
    role: Role;
    numberOfProjectsLed: number;
    charge: number; // New field for workload percentage
    availability: string; // New field for availability status (e.g., "Disponible", "Occupé")
} 