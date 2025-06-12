import { User } from './user.model';

export interface Notification {
    idNotification: number;
    message: string;
    membre: User;
} 