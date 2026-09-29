// Importa la entidad Resource del dominio
import { Resource } from './Resource';

// Puerto secundario (interfaz) para operaciones de consulta y persistencia de recursos públicos
export interface ResourcePort {
  // Obtiene el listado completo de recursos públicos de acceso libre
  findAll(): Promise<Resource[]>;
  // Consulta un recurso específico por su identificador único
  findById(id: string | number): Promise<Resource | null>;
}
