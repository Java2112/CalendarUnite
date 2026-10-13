// Importa el puerto del dominio PsychologyMeetingPort
import { PsychologyMeetingPort } from '../../../domain/PsychologyMeetingPort';

// Caso de uso para eliminar o cancelar definitivamente una cita de psicología
export class DeletePsychologyMeetingUseCase {
  // Inyecta el puerto de persistencia en el constructor
  constructor(private psychologyPort: PsychologyMeetingPort) {}

  // Ejecuta la eliminación recibiendo el identificador de la cita
  async execute(id: string | number): Promise<boolean> {
    // Retorna true si fue eliminada exitosamente
    return await this.psychologyPort.delete(id);
  }
}
