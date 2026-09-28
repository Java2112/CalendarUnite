// Importa la entidad Place del dominio
import { Place } from './Place';

// Puerto secundario (interfaz) para operaciones de persistencia de lugares
export interface PlacePort {
  // Obtiene la lista completa de lugares del campus
  findAll(): Promise<Place[]>;
  // Busca un lugar específico por su ID
  findById(id: number): Promise<Place | null>;
  // Registra un nuevo lugar opcionalmente
  create?(place: Omit<Place, 'id_lugar'>): Promise<Place>;
}
