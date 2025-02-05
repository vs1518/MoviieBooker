export interface Movie {
    id: number;
    title: string;
    duration: number;
    description: string;
    reservations: Reservation[];
}

interface Reservation {
    id: number;
    userId: number;
}