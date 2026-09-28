// Importa el puerto de persistencia de lugares
import { PlacePort } from '../../../domain/PlacePort';
// Importa la entidad Place del dominio
import { Place } from '../../../domain/Place';

// Caso de uso para obtener el catálogo completo de lugares del campus
export class GetPlacesUseCase {
  // Inyecta el puerto de lugares
  constructor(private placePort: PlacePort) {}

  // Ejecuta la consulta de todos los lugares
  async execute(): Promise<Place[]> {
    // Consulta al puerto y retorna el listado de espacios
    return this.placePort.findAll();
  }
}
