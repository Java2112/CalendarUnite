import { Router } from 'express';
import { UserController } from '../controller/UserController';
import { authMiddleware } from '../middleware/auth.middleware';
import { requireAdmin } from '../middleware/role.middleware';

export function createUserRoutes(userController: UserController): Router {
  const router = Router();

  // Rutas públicas y de sesión propia
  router.post('/login', userController.login);
  router.get('/me', authMiddleware, userController.getMe);

  // Rutas administrativas exclusivas (RF9 Gestión de Usuarios)
  router.get('/users', authMiddleware, requireAdmin, userController.listUsers);
  router.post('/users', authMiddleware, requireAdmin, userController.createUser);
  router.put('/users/:id', authMiddleware, requireAdmin, userController.updateUser);
  router.patch('/users/:id/status', authMiddleware, requireAdmin, userController.toggleStatus);
  router.delete('/users/:id', authMiddleware, requireAdmin, userController.deleteUser);

  return router;
}
