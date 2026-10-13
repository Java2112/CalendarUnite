// Importa el perfil de psicólogo del dominio
import { PsychologistProfile } from '../../../domain/PsychologyMeeting';
// Importa el puerto del dominio PsychologyMeetingPort
import { PsychologyMeetingPort } from '../../../domain/PsychologyMeetingPort';

// Caso de uso para obtener el catálogo de profesionales y psicólogos disponibles en Bienestar
export class GetPsychologistsUseCase {
  // Inyecta el puerto de persistencia en el constructor
  constructor(private psychologyPort: PsychologyMeetingPort) {}

  // Ejecuta la consulta de los profesionales registrados
  async execute(): Promise<PsychologistProfile[]> {
    // Retorna la lista de psicólogos disponibles
    return await this.psychologyPort.getProfessionals();
  }
}
