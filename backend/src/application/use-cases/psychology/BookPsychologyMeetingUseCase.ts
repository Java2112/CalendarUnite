// Importa la entidad del dominio PsychologyMeeting
import { PsychologyMeeting } from '../../../domain/PsychologyMeeting';
// Importa el puerto del dominio PsychologyMeetingPort
import { PsychologyMeetingPort } from '../../../domain/PsychologyMeetingPort';

// Caso de uso para registrar y agendar una nueva cita de psicología solicitada por un estudiante
export class BookPsychologyMeetingUseCase {
  // Inyecta el puerto de persistencia en el constructor
  constructor(private psychologyPort: PsychologyMeetingPort) {}

  // Ejecuta la creación y agendamiento de la cita
  async execute(meetingData: Omit<PsychologyMeeting, 'id' | 'createdAt'>): Promise<PsychologyMeeting> {
    // Valida que el nombre del estudiante no esté vacío
    if (!meetingData.studentName || meetingData.studentName.trim() === '') {
      throw new Error('El nombre del estudiante es obligatorio.');
    }

    // Valida que el correo institucional esté presente
    if (!meetingData.studentEmail || meetingData.studentEmail.trim() === '') {
      throw new Error('El correo electrónico institucional es obligatorio.');
    }

    // Valida que la fecha de la cita esté definida
    if (!meetingData.date) {
      throw new Error('La fecha de la cita es obligatoria.');
    }

    // Valida que el motivo de consulta esté presente
    if (!meetingData.reason || meetingData.reason.trim() === '') {
      throw new Error('El motivo de consulta es obligatorio.');
    }

    // Guarda y retorna la cita creada a través del puerto
    return await this.psychologyPort.create(meetingData);
  }
}
