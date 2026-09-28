// Importa las entidades Event, Attendee y EventStats del dominio
import { Event, Attendee, EventStats } from './Event';

// Puerto secundario (interfaz) para operaciones de persistencia de eventos
export interface EventPort {
  // Consulta la lista de eventos filtrada opcionalmente por modalidad y búsqueda
  findAll(modality?: string, search?: string): Promise<Event[]>;
  // Consulta un evento por su ID
  findById(id: number | string): Promise<Event | null>;
  // Registra un nuevo evento y asocia opcionalmente su URL de banner
  create(event: Omit<Event, 'id_evento'>, bannerUrl?: string): Promise<Event>;
  // Actualiza los datos de un evento existente
  update(id: number, data: Partial<Event>, bannerUrl?: string): Promise<Event | null>;
  // Elimina un evento por su ID
  delete(id: number): Promise<boolean>;
  // Busca si un estudiante ya está inscrito en un evento
  findAttendeeByEventAndEmail(eventId: string, email: string): Promise<Attendee | null>;
  // Guarda un nuevo registro de inscripción
  saveAttendee(attendee: Attendee): Promise<Attendee>;
  // Actualiza la cantidad de cupos disponibles de un evento
  updateAvailableSpots(eventId: string, spots: number): Promise<void>;
  // Calcula y retorna las estadísticas globales de actividades
  getStats(): Promise<EventStats>;
}
