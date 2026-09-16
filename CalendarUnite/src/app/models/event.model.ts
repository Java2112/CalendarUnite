export type ModalityType = 'Presencial' | 'Virtual' | 'Nocturna' | 'Todas';

export interface EventItem {
  id: string;
  title: string;
  category: string;
  organizer: string;
  modality: 'Presencial' | 'Virtual' | 'Nocturna';
  date: string;
  time: string;
  location: string;
  totalSpots: number;
  availableSpots: number;
  description: string;
  imageUrl?: string;
  createdAt?: string;
}

export interface RegisterRequest {
  nombre: string;
  correo: string;
  telefono: string;
}

export interface StatsSummary {
  totalEvents: number;
  presenciales: number;
  virtuales: number;
  nocturnas: number;
  [key: string]: any;
}
