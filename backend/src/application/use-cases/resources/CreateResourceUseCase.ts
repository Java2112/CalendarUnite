// Importa el puerto de persistencia de recursos
import { ResourcePort } from '../../../domain/ResourcePort';
// Importa la entidad de dominio Resource
import { Resource } from '../../../domain/Resource';

// Caso de uso que encapsula la lógica para registrar y publicar un recurso educativo
export class CreateResourceUseCase {
  // Inyecta la implementación del puerto de recursos
  constructor(private resourcePort: ResourcePort) {}

  // Ejecuta la creación del recurso y lo persiste
  async execute(resource: Resource): Promise<Resource> {
    // Valida datos mínimos
    if (!resource.title || !resource.title.trim()) {
      throw new Error('El título del recurso es obligatorio');
    }
    if (!resource.fileUrl || !resource.fileUrl.trim()) {
      throw new Error('La URL o archivo del recurso es obligatorio');
    }

    // Persiste y retorna el nuevo recurso
    return this.resourcePort.save(resource);
  }
}
