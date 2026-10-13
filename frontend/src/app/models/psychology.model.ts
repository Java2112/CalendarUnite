// Tipos de estados permitidos para una cita de atención psicológica
export type PsychologyMeetingStatus = 'Pendiente' | 'Confirmada' | 'Completada' | 'Cancelada';

// Modalidad de la sesión de atención psicológica
export type PsychologyModality = 'Presencial' | 'Virtual';

// Interfaz que modela una cita de psicología en el frontend
export interface PsychologyMeeting {
  // Identificador único de la cita
  id: string | number;
  // Nombre completo del estudiante
  studentName: string;
  // Correo electrónico institucional del estudiante
  studentEmail: string;
  // Teléfono de contacto del estudiante
  studentPhone?: string;
  // Programa académico del estudiante (ej. Ingeniería de Software, Administración, etc.)
  studentProgram?: string;
  // Motivo o descripción general de la solicitud
  reason: string;
  // Fecha agendada en formato AAAA-MM-DD
  date: string;
  // Hora de inicio (ej. 09:00)
  startHour: string;
  // Hora de fin (ej. 10:00)
  endHour: string;
  // Modalidad seleccionada (Presencial o Virtual)
  modality: PsychologyModality;
  // Nombre del profesional o psicólogo asignado
  professionalName: string;
  // Enlace para conexión virtual (Teams o Meet)
  linkMeeting?: string;
  // Estado actual de la cita
  status: PsychologyMeetingStatus;
  // Observaciones clínicas, notas o acuerdos de seguimiento
  observations?: string;
  // Fecha de creación de la solicitud
  createdAt?: string;
}

// Datos enviados desde el formulario público de agendamiento
export interface PsychologyBookingRequest {
  studentName: string;
  studentEmail: string;
  studentPhone?: string;
  studentProgram?: string;
  reason: string;
  date: string;
  startHour: string;
  endHour: string;
  modality: PsychologyModality;
  professionalName?: string;
}

// Perfil de un profesional o psicólogo de Bienestar Universitario
export interface PsychologistProfile {
  id: string | number;
  name: string;
  specialty: string;
  email: string;
  availableSchedule: string;
  avatarUrl?: string;
}

// Resumen estadístico de las citas de psicología
export interface PsychologyStats {
  total: number;
  pendientes: number;
  confirmadas: number;
  completadas: number;
  canceladas: number;
}
