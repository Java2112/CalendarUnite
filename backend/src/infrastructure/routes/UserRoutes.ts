import { Router } from 'express';
import { UserController } from '../controller/UserController';

export function createUserRoutes(userController: UserController): Router {
  const router = Router();

  router.post('/login', userController.login);
  router.get('/me', userController.getMe);

  return router;
}
