// Importa el puerto de persistencia de recursos
import { ResourcePort } from '../../../domain/ResourcePort';
// Importa la entidad de dominio Resource
import { Resource } from '../../../domain/Resource';

// Caso de uso que encapsula la lógica para obtener la lista pública de recursos educativos
export class GetResourcesUseCase {
  // Inyecta la implementación del puerto de recursos
  constructor(private resourcePort: ResourcePort) {}

  // Ejecuta la consulta de recursos y retorna la lista
  async execute(): Promise<Resource[]> {
    // Solicita la información al puerto de recursos y la retorna
    return this.resourcePort.findAll();
  }
}
