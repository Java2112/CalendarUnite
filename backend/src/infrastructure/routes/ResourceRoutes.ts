// Importa el enrutador de Express
import { Router } from 'express';
// Importa el controlador de recursos públicos
import { ResourceController } from '../controller/ResourceController';
import { uploadResourceFile } from '../middleware/upload.middleware';

// Función para registrar y configurar las rutas del módulo de recursos públicos
export function createResourceRoutes(resourceController: ResourceController): Router {
  // Instancia el enrutador de Express
  const router = Router();

  // Rutas GET públicas para consultar recursos
  router.get('/recursos', resourceController.getAll);
  router.get('/resources', resourceController.getAll);

  // Rutas POST para que los roles suban archivos locales y creen recursos
  router.post('/recursos', uploadResourceFile, resourceController.create);
  router.post('/resources', uploadResourceFile, resourceController.create);

  // Retorna el enrutador configurado
  return router;
}
