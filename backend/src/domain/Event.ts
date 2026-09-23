export type EventModality = 'Presencial' | 'Virtual' | 'Nocturna' | string;

export interface Event {
  id: string;
  title: string;
  category: string;
  organizer: string;
  modality: EventModality;
  date: string;
  time: string;
  location: string;
  totalSpots: number;
  availableSpots: number;
  description: string;
  imageUrl: string;
  createdAt: string;
}

export interface Attendee {
  id: string;
  eventId: string;
  nombre: string;
  correo: string;
  telefono: string;
  registeredAt: string;
}

export interface EventStats {
  totalEvents: number;
  presenciales: number;
  virtuales: number;
  nocturnas: number;
}
