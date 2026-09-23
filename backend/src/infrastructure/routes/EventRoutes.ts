import { Router } from 'express';
import { EventController } from '../controller/EventController';
import { authMiddleware } from '../middleware/auth.middleware';
import { requireAuthorizedOrganizers } from '../middleware/role.middleware';

export function createEventRoutes(eventController: EventController): Router {
  const router = Router();

  // Consultas públicas (Calendario y Portal)
  router.get('/events', eventController.getAll);
  router.get('/events/:id', eventController.getById);
  router.post('/events/:id/register', eventController.register);
  router.get('/stats', eventController.getStats);

  // Operaciones de gestión protegidas (Líderes, Bienestar, Admin con Ownership)
  router.post('/events', authMiddleware, requireAuthorizedOrganizers, eventController.create);
  router.put('/events/:id', authMiddleware, requireAuthorizedOrganizers, eventController.update);
  router.delete('/events/:id', authMiddleware, requireAuthorizedOrganizers, eventController.delete);

  return router;
}
