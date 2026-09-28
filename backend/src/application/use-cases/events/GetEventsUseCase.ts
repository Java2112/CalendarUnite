// Importa el puerto de persistencia de eventos
import { EventPort } from '../../../domain/EventPort';
// Importa la entidad Event del dominio
import { Event } from '../../../domain/Event';

// Caso de uso para obtener la lista de actividades con filtros opcionales
export class GetEventsUseCase {
  // Inyecta el puerto de eventos
  constructor(private eventPort: EventPort) {}

  // Ejecuta la consulta de actividades según modalidad y término de búsqueda
  async execute(modality?: string, search?: string): Promise<Event[]> {
    // Consulta al puerto y retorna el arreglo de eventos
    return this.eventPort.findAll(modality, search);
  }
}
