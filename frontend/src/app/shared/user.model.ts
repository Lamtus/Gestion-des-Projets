export enum Role {
    ADMIN = 'ADMIN',
    DIRECTEUR = 'DIRECTEUR',
    MEMBRE_EQUIPE = 'MEMBRE_EQUIPE'
}

export interface User {
    id: number;
    nom: string;
    prenom: string;
    email: string;
    telephone: string;
    poste: string;
    departement: string;
    role: Role;
    firstLogin: boolean;
} 