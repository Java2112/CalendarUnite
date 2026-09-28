// Importa el puerto de persistencia de eventos
import { EventPort } from '../../../domain/EventPort';
// Importa la entidad Event del dominio
import { Event } from '../../../domain/Event';

// Caso de uso para consultar un evento específico por su ID
export class GetEventByIdUseCase {
  // Inyecta el puerto de eventos
  constructor(private eventPort: EventPort) {}

  // Ejecuta la búsqueda del evento por su identificador
  async execute(id: number | string): Promise<Event | null> {
    // Consulta al puerto y retorna el evento encontrado o null
    return this.eventPort.findById(id);
  }
}
