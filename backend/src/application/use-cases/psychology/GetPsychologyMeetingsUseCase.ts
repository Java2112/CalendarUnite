// Importa la entidad del dominio PsychologyMeeting
import { PsychologyMeeting } from '../../../domain/PsychologyMeeting';
// Importa el puerto del dominio PsychologyMeetingPort
import { PsychologyMeetingPort } from '../../../domain/PsychologyMeetingPort';

// Caso de uso para consultar y listar las citas de atención psicológica
export class GetPsychologyMeetingsUseCase {
  // Inyecta el puerto de persistencia en el constructor
  constructor(private psychologyPort: PsychologyMeetingPort) {}

  // Ejecuta la consulta aplicando filtros opcionales de estado, fecha o búsqueda
  async execute(filters?: { status?: string; date?: string; search?: string }): Promise<PsychologyMeeting[]> {
    // Retorna la lista de citas obtenidas desde el puerto
    return await this.psychologyPort.findAll(filters);
  }
}
