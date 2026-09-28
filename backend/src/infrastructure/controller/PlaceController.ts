// Importa los tipos Request y Response de Express
import { Request, Response } from 'express';
// Importa el caso de uso para consultar lugares
import { GetPlacesUseCase } from '../../application/use-cases/places/GetPlacesUseCase';

// Controlador HTTP para las rutas del catálogo de lugares
export class PlaceController {
  // Inyecta el caso de uso de lugares
  constructor(private getPlacesUseCase: GetPlacesUseCase) {}

  // Manejador GET para listar todos los lugares disponibles
  getAll = async (req: Request, res: Response): Promise<Response> => {
    // Inicia bloque try-catch
    try {
      // Ejecuta el caso de uso para obtener los lugares
      const places = await this.getPlacesUseCase.execute();
      // Retorna la lista de lugares en formato JSON
      return res.json(places);
    } catch (error: any) {
      // Retorna error 500 si ocurre una falla en el servidor
      return res.status(500).json({ error: error.message || 'Error al obtener lugares' });
    }
  };
}
