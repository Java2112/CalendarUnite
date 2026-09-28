// Importa el enrutador de Express
import { Router } from 'express';
// Importa el controlador de eventos
import { EventController } from '../controller/EventController';
// Importa el middleware de autenticación
import { authMiddleware } from '../middleware/auth.middleware';
// Importa el middleware de verificación de roles autorizados
import { requireAuthorizedOrganizers } from '../middleware/role.middleware';

// Función para registrar y configurar las rutas de eventos
export function createEventRoutes(eventController: EventController): Router {
  // Instancia un nuevo enrutador de Express
  const router = Router();

  // Ruta GET pública para obtener todos los eventos
  router.get('/events', eventController.getAll);
  // Ruta GET pública para consultar un evento por su ID
  router.get('/events/:id', eventController.getById);
  // Ruta POST pública para inscribir a un estudiante en un evento
  router.post('/events/:id/register', eventController.register);
  // Ruta GET pública para consultar estadísticas globales de actividades
  router.get('/stats', eventController.getStats);

  // Ruta POST protegida para crear un nuevo evento
  router.post('/events', authMiddleware, requireAuthorizedOrganizers, eventController.create);
  // Ruta PUT protegida para actualizar un evento existente
  router.put('/events/:id', authMiddleware, requireAuthorizedOrganizers, eventController.update);
  // Ruta DELETE protegida para eliminar un evento
  router.delete('/events/:id', authMiddleware, requireAuthorizedOrganizers, eventController.delete);

  // Retorna el enrutador configurado
  return router;
}
