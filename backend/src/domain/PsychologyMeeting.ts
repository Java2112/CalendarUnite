// Tipos de estado posibles para una cita de atención psicológica
export type PsychologyMeetingStatus = 'Pendiente' | 'Confirmada' | 'Completada' | 'Cancelada';

// Modalidades de atención psicológica permitidas en Bienestar Universitario
export type PsychologyModality = 'Presencial' | 'Virtual';

// Interfaz del dominio que representa una Cita / Consulta de Psicología en Bienestar Universitario
export interface PsychologyMeeting {
  // Identificador único de la cita
  id: string | number;
  // Nombre completo del estudiante solicitante
  studentName: string;
  // Correo electrónico institucional del estudiante
  studentEmail: string;
  // Teléfono o número de contacto del estudiante
  studentPhone?: string;
  // Programa académico del estudiante (ej. Ingeniería de Software, Administración, etc.)
  studentProgram?: string;
  // Motivo o tema de la consulta psicológica (ej. Manejo de estrés, Orientación vocacional, Apoyo emocional)
  reason: string;
  // Fecha agendada para la cita en formato AAAA-MM-DD
  date: string;
  // Hora de inicio de la sesión (ej. 09:00)
  startHour: string;
  // Hora de finalización de la sesión (ej. 10:00)
  endHour: string;
  // Modalidad de la sesión (Presencial en consultorio o Virtual por Teams)
  modality: PsychologyModality;
  // Nombre del profesional o psicólogo de Bienestar asignado
  professionalName: string;
  // Enlace para la videollamada virtual si la modalidad es virtual
  linkMeeting?: string;
  // Estado actual del ciclo de vida de la cita
  status: PsychologyMeetingStatus;
  // Notas, observaciones clínicas o acuerdos de seguimiento registrados por el psicólogo
  observations?: string;
  // Fecha y hora de creación de la solicitud
  createdAt?: string;
}

// Perfil de un profesional o psicólogo del área de Bienestar Universitario
export interface PsychologistProfile {
  // Identificador del profesional
  id: string | number;
  // Nombre y título del profesional
  name: string;
  // Especialidad o enfoque terapéutico
  specialty: string;
  // Correo institucional
  email: string;
  // Horarios o jornadas habituales de atención
  availableSchedule: string;
  // Fotografía o avatar institucional
  avatarUrl?: string;
}
