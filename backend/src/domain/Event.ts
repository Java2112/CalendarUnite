// Importa la entidad Place del dominio
import { Place } from './Place';

// Define las modalidades permitidas para un evento
export type EventModality = 'Presencial' | 'Virtual' | 'Nocturna';

// Interfaz que modela un Evento en el dominio
export interface Event {
  // ID numérico único del evento
  id_evento: number;
  // Nombre o título de la actividad
  nombre: string;
  // Modalidad de ejecución del evento
  modalidad: EventModality;
  // Enlaces de acceso si la actividad es virtual
  link_virtual: string[];
  // Descripción detallada del evento
  descripcion: string;
  // Fecha de inicio en formato YYYY-MM-DD
  fecha_inicio: string;
  // Fecha de finalización opcional
  fecha_fin?: string | null;
  // Hora de inicio en formato HH:MM:SS
  hora_inicio?: string | null;
  // Hora de finalización opcional
  hora_fin?: string | null;
  // Estado actual del evento (Activo, Cancelado, etc.)
  estado: string;
  // ID del lugar asignado
  id_lugar: number;
  // ID del usuario responsable u organizador
  id_responsable: number;

  // Objeto con la información completa del lugar
  lugar?: Place;
  // Información resumida del organizador responsable
  responsable?: {
    id_usuario: number;
    nombre: string;
    apellido: string;
    correo: string;
    rol: string;
  };
  // URL de la imagen de portada o banner
  banner_url?: string;

  // Identificador de compatibilidad con frontend
  id?: string;
  // Título de compatibilidad con frontend
  title?: string;
  // Categoría temática de la actividad
  category?: string;
  // Nombre legible del organizador
  organizer?: string;
  // Modalidad en formato de texto alternativo
  modality?: string;
  // Fecha legible para visualización
  date?: string;
  // Horario legible para visualización
  time?: string;
  // Nombre del lugar físico o virtual
  location?: string;
  // Aforo o cupos totales
  totalSpots?: number;
  // Cupos actualmente disponibles
  availableSpots?: number;
  // URL de la imagen del evento
  imageUrl?: string;
  // Fecha y hora de creación del registro
  createdAt?: string;
}

// Interfaz que modela a un participante inscrito en un evento
export interface Attendee {
  // ID del registro de asistencia
  id: string;
  // ID del evento asociado
  eventId: string;
  // Nombre completo del asistente
  nombre: string;
  // Correo del asistente
  correo: string;
  // Teléfono de contacto
  telefono: string;
  // Fecha y hora del registro
  registeredAt: string;
}

// Interfaz para las estadísticas consolidadas de actividades
export interface EventStats {
  // Total de actividades registradas
  totalEvents: number;
  // Total de actividades presenciales
  presenciales: number;
  // Total de actividades virtuales
  virtuales: number;
  // Total de actividades en jornada nocturna
  nocturnas: number;
}
