"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createUserRoutes = createUserRoutes;
// Importa el enrutador de Express
const express_1 = require("express");
// Importa el middleware de autenticación
const auth_middleware_1 = require("../middleware/auth.middleware");
// Importa el middleware que requiere rol Administrador
const role_middleware_1 = require("../middleware/role.middleware");
// Función para registrar y configurar las rutas de usuarios y autenticación
function createUserRoutes(userController) {
    // Instancia el enrutador de Express
    const router = (0, express_1.Router)();
    // Ruta POST pública para iniciar sesión con credenciales
    router.post('/login', userController.login);
    // Ruta GET protegida para obtener el perfil del usuario autenticado
    router.get('/me', auth_middleware_1.authMiddleware, userController.getMe);
    // Ruta GET administrativa para listar todos los usuarios
    router.get('/users', auth_middleware_1.authMiddleware, role_middleware_1.requireAdmin, userController.listUsers);
    // Ruta POST administrativa para crear un nuevo usuario
    router.post('/users', auth_middleware_1.authMiddleware, role_middleware_1.requireAdmin, userController.createUser);
    // Ruta PUT administrativa para actualizar datos de un usuario
    router.put('/users/:id', auth_middleware_1.authMiddleware, role_middleware_1.requireAdmin, userController.updateUser);
    // Ruta PATCH administrativa para activar o desactivar un usuario
    router.patch('/users/:id/status', auth_middleware_1.authMiddleware, role_middleware_1.requireAdmin, userController.toggleStatus);
    // Ruta DELETE administrativa para eliminar un usuario
    router.delete('/users/:id', auth_middleware_1.authMiddleware, role_middleware_1.requireAdmin, userController.deleteUser);
    // Retorna el enrutador configurado
    return router;
}
