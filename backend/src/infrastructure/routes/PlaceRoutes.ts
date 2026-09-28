// Importa el enrutador de Express
import { Router } from 'express';
// Importa el controlador de lugares
import { PlaceController } from '../controller/PlaceController';

// Función para registrar y configurar las rutas de lugares del campus
export function createPlaceRoutes(placeController: PlaceController): Router {
  // Instancia el enrutador de Express
  const router = Router();

  // Ruta GET pública para obtener el catálogo de lugares
  router.get('/places', placeController.getAll);

  // Retorna el enrutador configurado
  return router;
}
