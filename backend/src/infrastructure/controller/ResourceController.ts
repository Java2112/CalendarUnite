// Importa los tipos Request y Response de Express
import { Request, Response } from 'express';
// Importa el caso de uso para consultar recursos públicos
import { GetResourcesUseCase } from '../../application/use-cases/resources/GetResourcesUseCase';

// Controlador HTTP para exponer la API pública de recursos para estudiantes
export class ResourceController {
  // Inyecta el caso de uso de consulta de recursos
  constructor(private getResourcesUseCase: GetResourcesUseCase) {}

  // Manejador HTTP GET para listar todos los recursos públicos (sin autenticación requerida)
  getAll = async (req: Request, res: Response): Promise<Response> => {
    // Inicia bloque de captura de excepciones
    try {
      // Ejecuta el caso de uso para obtener los recursos del puerto
      const resources = await this.getResourcesUseCase.execute();
      // Retorna la respuesta en formato JSON con estado HTTP 200 OK
      return res.json(resources);
    } catch (error: any) {
      // En caso de fallo, retorna respuesta HTTP 500 con el mensaje de error
      return res.status(500).json({ 
        error: error.message || 'Ocurrió un error al consultar los recursos públicos de la institución' 
      });
    }
  };
}
