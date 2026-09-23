import { Place } from './Place';

export type EventModality = 'Presencial' | 'Virtual' | 'Nocturna';

export interface Event {
  id_evento: number;
  nombre: string;
  modalidad: EventModality;
  link_virtual: string[];
  descripcion: string;
  fecha_inicio: string; // YYYY-MM-DD
  fecha_fin?: string | null;
  hora_inicio?: string | null; // HH:MM:SS
  hora_fin?: string | null;
  estado: string; // 'Activo' | 'Cancelado' | 'Finalizado'
  id_lugar: number;
  id_responsable: number;

  // Objetos enriquecidos para vista detallada
  lugar?: Place;
  responsable?: {
    id_usuario: number;
    nombre: string;
    apellido: string;
    correo: string;
    rol: string;
  };
  banner_url?: string;

  // Campos de compatibilidad con frontend anterior
  id?: string;
  title?: string;
  category?: string;
  organizer?: string;
  modality?: string;
  date?: string;
  time?: string;
  location?: string;
  totalSpots?: number;
  availableSpots?: number;
  imageUrl?: string;
  createdAt?: string;
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
