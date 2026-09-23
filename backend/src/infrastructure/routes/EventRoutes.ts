import { Router } from 'express';
import { EventController } from '../controller/EventController';

export function createEventRoutes(eventController: EventController): Router {
  const router = Router();

  router.get('/events', eventController.getAll);
  router.get('/events/:id', eventController.getById);
  router.post('/events/:id/register', eventController.register);
  router.get('/stats', eventController.getStats);

  return router;
}
