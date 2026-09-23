import { Place } from './place.model';
import { UserRole } from './user.model';

export type ModalityType = 'Presencial' | 'Virtual' | 'Nocturna' | 'Todas';

export interface EventItem {
  id_evento?: number;
  nombre?: string;
  modalidad?: 'Presencial' | 'Virtual' | 'Nocturna';
  link_virtual?: string[];
  descripcion?: string;
  fecha_inicio?: string;
  fecha_fin?: string | null;
  hora_inicio?: string | null;
  hora_fin?: string | null;
  estado?: string;
  id_lugar?: number;
  id_responsable?: number;

  lugar?: Place;
  responsable?: {
    id_usuario: number;
    nombre: string;
    apellido: string;
    correo: string;
    rol: string;
  };
  banner_url?: string;

  // Propiedades de retrocompatibilidad y visualización
  id: string;              // ej. "evt-100" o "100"
  title: string;           // Título principal
  category?: string;       // Categoría
  organizer?: string;      // Organizador responsable
  modality: 'Presencial' | 'Virtual' | 'Nocturna'; // Modalidad específica
  date: string;            // Fecha ("YYYY-MM-DD")
  time: string;            // Rango de horas ("08:00 - 09:30")
  location: string;        // Lugar físico o enlace virtual
  totalSpots: number;      // Capacidad total
  availableSpots: number;  // Cupos disponibles
  description: string;     // Descripción detallada
  imageUrl?: string;       // URL de la imagen descriptiva o banner
  createdAt?: string;
}

export interface CreateEventRequest {
  nombre: string;
  modalidad: 'Presencial' | 'Virtual' | 'Nocturna';
  link_virtual?: string[];
  descripcion: string;
  fecha_inicio: string;
  fecha_fin?: string | null;
  hora_inicio?: string | null;
  hora_fin?: string | null;
  id_lugar: number;
  banner_url?: string;
  category?: string;
  totalSpots?: number;
  estado?: string;
}

export interface UpdateEventRequest {
  nombre?: string;
  modalidad?: 'Presencial' | 'Virtual' | 'Nocturna';
  link_virtual?: string[];
  descripcion?: string;
  fecha_inicio?: string;
  fecha_fin?: string | null;
  hora_inicio?: string | null;
  hora_fin?: string | null;
  id_lugar?: number;
  banner_url?: string;
  category?: string;
  totalSpots?: number;
  estado?: string;
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