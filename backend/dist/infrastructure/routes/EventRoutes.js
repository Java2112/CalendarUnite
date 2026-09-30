"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createEventRoutes = createEventRoutes;
// Importa el enrutador de Express
const express_1 = require("express");
// Importa el middleware de autenticación
const auth_middleware_1 = require("../middleware/auth.middleware");
// Importa el middleware de verificación de roles autorizados
const role_middleware_1 = require("../middleware/role.middleware");
// Función para registrar y configurar las rutas de eventos
function createEventRoutes(eventController) {
    // Instancia un nuevo enrutador de Express
    const router = (0, express_1.Router)();
    // Ruta GET pública para obtener todos los eventos
    router.get('/events', eventController.getAll);
    // Ruta GET pública para consultar un evento por su ID
    router.get('/events/:id', eventController.getById);
    // Ruta POST pública para inscribir a un estudiante en un evento
    router.post('/events/:id/register', eventController.register);
    // Ruta GET pública para consultar estadísticas globales de actividades
    router.get('/stats', eventController.getStats);
    // Ruta POST protegida para crear un nuevo evento
    router.post('/events', auth_middleware_1.authMiddleware, role_middleware_1.requireAuthorizedOrganizers, eventController.create);
    // Ruta PUT protegida para actualizar un evento existente
    router.put('/events/:id', auth_middleware_1.authMiddleware, role_middleware_1.requireAuthorizedOrganizers, eventController.update);
    // Ruta DELETE protegida para eliminar un evento
    router.delete('/events/:id', auth_middleware_1.authMiddleware, role_middleware_1.requireAuthorizedOrganizers, eventController.delete);
    // Retorna el enrutador configurado
    return router;
}
