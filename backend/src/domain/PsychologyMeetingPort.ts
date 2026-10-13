// Importa las entidades del dominio de psicología
import { PsychologyMeeting, PsychologistProfile } from './PsychologyMeeting';

// Puerto secundario (interfaz) para operaciones de persistencia y consulta de citas de psicología
export interface PsychologyMeetingPort {
  // Obtiene el listado de citas con filtros opcionales de estado, fecha o búsqueda
  findAll(filters?: { status?: string; date?: string; search?: string }): Promise<PsychologyMeeting[]>;
  // Consulta una cita específica por su identificador único
  findById(id: string | number): Promise<PsychologyMeeting | null>;
  // Registra una nueva cita o solicitud de atención psicológica
  create(meeting: Omit<PsychologyMeeting, 'id' | 'createdAt'>): Promise<PsychologyMeeting>;
  // Actualiza los datos, estado o notas de una cita existente
  update(id: string | number, meeting: Partial<PsychologyMeeting>): Promise<PsychologyMeeting>;
  // Cancela o elimina una cita por su identificador
  delete(id: string | number): Promise<boolean>;
  // Obtiene el directorio de psicólogos y profesionales de bienestar
  getProfessionals(): Promise<PsychologistProfile[]>;
}
