import { Router } from 'express';
import { PlaceController } from '../controller/PlaceController';

export function createPlaceRoutes(placeController: PlaceController): Router {
  const router = Router();

  router.get('/places', placeController.getAll);

  return router;
}
