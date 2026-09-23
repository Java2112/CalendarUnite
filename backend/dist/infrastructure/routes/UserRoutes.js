"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createUserRoutes = createUserRoutes;
const express_1 = require("express");
const auth_middleware_1 = require("../middleware/auth.middleware");
const role_middleware_1 = require("../middleware/role.middleware");
function createUserRoutes(userController) {
    const router = (0, express_1.Router)();
    // Rutas públicas y de sesión propia
    router.post('/login', userController.login);
    router.get('/me', auth_middleware_1.authMiddleware, userController.getMe);
    // Rutas administrativas exclusivas (RF9 Gestión de Usuarios)
    router.get('/users', auth_middleware_1.authMiddleware, role_middleware_1.requireAdmin, userController.listUsers);
    router.post('/users', auth_middleware_1.authMiddleware, role_middleware_1.requireAdmin, userController.createUser);
    router.put('/users/:id', auth_middleware_1.authMiddleware, role_middleware_1.requireAdmin, userController.updateUser);
    router.patch('/users/:id/status', auth_middleware_1.authMiddleware, role_middleware_1.requireAdmin, userController.toggleStatus);
    router.delete('/users/:id', auth_middleware_1.authMiddleware, role_middleware_1.requireAdmin, userController.deleteUser);
    return router;
}
