// Importa el enrutador de Express
import { Router } from 'express';
// Importa el controlador de usuarios
import { UserController } from '../controller/UserController';
// Importa el middleware de autenticación
import { authMiddleware } from '../middleware/auth.middleware';
// Importa el middleware que requiere rol Administrador
import { requireAdmin } from '../middleware/role.middleware';

// Función para registrar y configurar las rutas de usuarios y autenticación
export function createUserRoutes(userController: UserController): Router {
  // Instancia el enrutador de Express
  const router = Router();

  // Ruta POST pública para iniciar sesión con credenciales
  router.post('/login', userController.login);
  // Ruta GET protegida para obtener el perfil del usuario autenticado
  router.get('/me', authMiddleware, userController.getMe);

  // Ruta GET administrativa para listar todos los usuarios
  router.get('/users', authMiddleware, requireAdmin, userController.listUsers);
  // Ruta POST administrativa para crear un nuevo usuario
  router.post('/users', authMiddleware, requireAdmin, userController.createUser);
  // Ruta PUT administrativa para actualizar datos de un usuario
  router.put('/users/:id', authMiddleware, requireAdmin, userController.updateUser);
  // Ruta PATCH administrativa para activar o desactivar un usuario
  router.patch('/users/:id/status', authMiddleware, requireAdmin, userController.toggleStatus);
  // Ruta DELETE administrativa para eliminar un usuario
  router.delete('/users/:id', authMiddleware, requireAdmin, userController.deleteUser);

  // Retorna el enrutador configurado
  return router;
}
