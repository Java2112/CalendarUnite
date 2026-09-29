// Importa el enrutador de Express
import { Router } from 'express';
// Importa el controlador de recursos públicos
import { ResourceController } from '../controller/ResourceController';

// Función para registrar y configurar las rutas del módulo de recursos públicos
export function createResourceRoutes(resourceController: ResourceController): Router {
  // Instancia el enrutador de Express
  const router = Router();

  // Ruta GET pública para consultar recursos (accesible en /recursos y /resources sin guardar autenticación)
  router.get('/recursos', resourceController.getAll);
  router.get('/resources', resourceController.getAll);

  // Retorna el enrutador configurado
  return router;
}
