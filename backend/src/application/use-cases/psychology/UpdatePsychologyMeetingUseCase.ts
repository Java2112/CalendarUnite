// Importa la entidad del dominio PsychologyMeeting
import { PsychologyMeeting } from '../../../domain/PsychologyMeeting';
// Importa el puerto del dominio PsychologyMeetingPort
import { PsychologyMeetingPort } from '../../../domain/PsychologyMeetingPort';

// Caso de uso para actualizar los datos, estado o notas de una cita de psicología
export class UpdatePsychologyMeetingUseCase {
  // Inyecta el puerto de persistencia en el constructor
  constructor(private psychologyPort: PsychologyMeetingPort) {}

  // Ejecuta la actualización recibiendo el identificador y los campos a modificar
  async execute(id: string | number, updates: Partial<PsychologyMeeting>): Promise<PsychologyMeeting> {
    // Verifica si la cita existe antes de actualizarla
    const existing = await this.psychologyPort.findById(id);
    if (!existing) {
      throw new Error(`Cita de psicología con ID ${id} no encontrada.`);
    }

    // Actualiza y retorna la cita con los nuevos valores
    return await this.psychologyPort.update(id, updates);
  }
}
