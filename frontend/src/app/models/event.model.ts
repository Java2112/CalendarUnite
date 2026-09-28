// Importa el modelo de lugar
import { Place } from './place.model';
// Importa el tipo de rol de usuario
import { UserRole } from './user.model';

// Tipo de modalidad de eventos disponible para filtros
export type ModalityType = 'Presencial' | 'Virtual' | 'Nocturna' | 'Todas';

// Interfaz para representar un evento en el frontend
export interface EventItem {
  // ID numérico en la BD
  id_evento?: number;
  // Nombre del evento en BD
  nombre?: string;
  // Modalidad del evento en BD
  modalidad?: 'Presencial' | 'Virtual' | 'Nocturna';
  // Enlaces virtuales
  link_virtual?: string[];
  // Descripción en BD
  descripcion?: string;
  // Fecha de inicio
  fecha_inicio?: string;
  // Fecha de fin
  fecha_fin?: string | null;
  // Hora de inicio
  hora_inicio?: string | null;
  // Hora de fin
  hora_fin?: string | null;
  // Estado del evento
  estado?: string;
  // ID del lugar asociado
  id_lugar?: number;
  // ID del usuario responsable
  id_responsable?: number;

  // Objeto con detalles del lugar
  lugar?: Place;
  // Objeto con detalles del responsable
  responsable?: {
    id_usuario: number;
    nombre: string;
    apellido: string;
    correo: string;
    rol: string;
  };
  // URL del banner
  banner_url?: string;

  // ID formateado para la vista
  id: string;
  // Título principal en la vista
  title: string;
  // Categoría temática
  category?: string;
  // Nombre del organizador
  organizer?: string;
  // Modalidad para renderizado
  modality: 'Presencial' | 'Virtual' | 'Nocturna';
  // Fecha en formato texto
  date: string;
  // Rango de horas legible
  time: string;
  // Ubicación o enlace
  location: string;
  // Cupos totales
  totalSpots: number;
  // Cupos disponibles restantes
  availableSpots: number;
  // Descripción completa
  description: string;
  // Imagen de portada
  imageUrl?: string;
  // Fecha de registro
  createdAt?: string;
}

// Interfaz para el payload de creación de eventos
export interface CreateEventRequest {
  // Nombre del nuevo evento
  nombre: string;
  // Modalidad seleccionada
  modalidad: 'Presencial' | 'Virtual' | 'Nocturna';
  // Enlaces virtuales opcionales
  link_virtual?: string[];
  // Descripción detallada
  descripcion: string;
  // Fecha de inicio
  fecha_inicio: string;
  // Fecha de finalización
  fecha_fin?: string | null;
  // Hora de inicio
  hora_inicio?: string | null;
  // Hora de fin
  hora_fin?: string | null;
  // ID del lugar asignado
  id_lugar: number;
  // URL de portada opcional
  banner_url?: string;
  // Categoría temática
  category?: string;
  // Aforo total
  totalSpots?: number;
  // Estado inicial
  estado?: string;
}

// Interfaz para el payload de actualización de eventos
export interface UpdateEventRequest {
  // Nombre actualizado
  nombre?: string;
  // Modalidad actualizada
  modalidad?: 'Presencial' | 'Virtual' | 'Nocturna';
  // Enlaces actualizados
  link_virtual?: string[];
  // Descripción actualizada
  descripcion?: string;
  // Fecha inicio actualizada
  fecha_inicio?: string;
  // Fecha fin actualizada
  fecha_fin?: string | null;
  // Hora inicio actualizada
  hora_inicio?: string | null;
  // Hora fin actualizada
  hora_fin?: string | null;
  // ID de lugar actualizado
  id_lugar?: number;
  // Banner actualizado
  banner_url?: string;
  // Categoría actualizada
  category?: string;
  // Cupos actualizados
  totalSpots?: number;
  // Estado actualizado
  estado?: string;
}

// Interfaz para el registro de un asistente
export interface RegisterAttendeeRequest {
  // Nombre completo del asistente
  nombre: string;
  // Correo institucional
  correo: string;
  // Teléfono de contacto
  telefono: string;
}

// Estadísticas de actividades institucionales
export interface EventStats {
  // Conteo total de eventos
  totalEvents: number;
  // Conteo de presenciales
  presenciales: number;
  // Conteo de virtuales
  virtuales: number;
  // Conteo de nocturnas
  nocturnas: number;
}