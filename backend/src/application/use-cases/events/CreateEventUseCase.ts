// Importa el puerto de eventos del dominio
import { EventPort } from '../../../domain/EventPort';
// Importa los tipos Event y EventModality del dominio
import { Event, EventModality } from '../../../domain/Event';
// Importa los tipos User y UserRole del dominio
import { User, UserRole } from '../../../domain/User';

// DTO con los datos necesarios para crear un evento
export interface CreateEventDTO {
  // Nombre o título del evento
  nombre: string;
  // Modalidad seleccionada (Presencial, Virtual, etc.)
  modalidad: EventModality;
  // Enlaces virtuales opcionales
  link_virtual?: string[];
  // Descripción detallada del evento
  descripcion: string;
  // Fecha de inicio en formato YYYY-MM-DD
  fecha_inicio: string;
  // Fecha de finalización opcional
  fecha_fin?: string | null;
  // Hora de inicio opcional en formato HH:MM:SS
  hora_inicio?: string | null;
  // Hora de finalización opcional
  hora_fin?: string | null;
  // ID del lugar asignado
  id_lugar: number;
  // URL de la imagen de portada opcional
  banner_url?: string;
  // Estado inicial del evento
  estado?: string;
  // Categoría temática de la actividad
  category?: string;
  // Aforo o cupos totales
  totalSpots?: number;
}

// Caso de uso para crear un nuevo evento en el sistema
export class CreateEventUseCase {
  // Inyecta el puerto de persistencia de eventos
  constructor(private eventPort: EventPort) {}

  // Ejecuta la creación del evento validando reglas de negocio
  async execute(dto: CreateEventDTO, currentUser: { id_usuario: number; rol: UserRole }): Promise<Event> {
    // Valida que el nombre no esté vacío
    if (!dto.nombre || dto.nombre.trim() === '') {
      throw new Error('El nombre del evento es obligatorio.');
    }
    // Valida que la descripción no esté vacía
    if (!dto.descripcion || dto.descripcion.trim() === '') {
      throw new Error('La descripción del evento es obligatoria.');
    }
    // Valida que la fecha de inicio esté presente
    if (!dto.fecha_inicio) {
      throw new Error('La fecha de inicio es obligatoria.');
    }
    // Valida que se haya seleccionado un lugar válido
    if (!dto.id_lugar) {
      throw new Error('Debe seleccionar un lugar válido para el evento.');
    }

    // Estructura el objeto de datos del evento para la base de datos
    const eventData: Omit<Event, 'id_evento'> = {
      nombre: dto.nombre.trim(),
      modalidad: dto.modalidad || 'Presencial',
      link_virtual: Array.isArray(dto.link_virtual) ? dto.link_virtual : [],
      descripcion: dto.descripcion.trim(),
      fecha_inicio: dto.fecha_inicio,
      fecha_fin: dto.fecha_fin || null,
      hora_inicio: dto.hora_inicio || null,
      hora_fin: dto.hora_fin || null,
      estado: dto.estado || 'Activo',
      id_lugar: Number(dto.id_lugar),
      id_responsable: Number(currentUser.id_usuario),
      category: dto.category || 'General',
      totalSpots: dto.totalSpots || 50,
      availableSpots: dto.totalSpots || 50
    };

    // Invoca al puerto para persistir el evento y retorna el resultado
    return this.eventPort.create(eventData, dto.banner_url);
  }
}
