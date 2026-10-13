// Importa la entidad del dominio PsychologyMeeting
import { PsychologyMeeting } from '../../../domain/PsychologyMeeting';
// Importa el puerto del dominio PsychologyMeetingPort
import { PsychologyMeetingPort } from '../../../domain/PsychologyMeetingPort';

// Caso de uso para obtener una cita específica por su identificador único
export class GetPsychologyMeetingByIdUseCase {
  // Inyecta el puerto de persistencia en el constructor
  constructor(private psychologyPort: PsychologyMeetingPort) {}

  // Ejecuta la búsqueda de la cita por su ID
  async execute(id: string | number): Promise<PsychologyMeeting | null> {
    // Retorna la cita encontrada o null
    return await this.psychologyPort.findById(id);
  }
}
