"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createEventRoutes = createEventRoutes;
const express_1 = require("express");
const auth_middleware_1 = require("../middleware/auth.middleware");
const role_middleware_1 = require("../middleware/role.middleware");
function createEventRoutes(eventController) {
    const router = (0, express_1.Router)();
    // Consultas públicas (Calendario y Portal)
    router.get('/events', eventController.getAll);
    router.get('/events/:id', eventController.getById);
    router.post('/events/:id/register', eventController.register);
    router.get('/stats', eventController.getStats);
    // Operaciones de gestión protegidas (Líderes, Bienestar, Admin con Ownership)
    router.post('/events', auth_middleware_1.authMiddleware, role_middleware_1.requireAuthorizedOrganizers, eventController.create);
    router.put('/events/:id', auth_middleware_1.authMiddleware, role_middleware_1.requireAuthorizedOrganizers, eventController.update);
    router.delete('/events/:id', auth_middleware_1.authMiddleware, role_middleware_1.requireAuthorizedOrganizers, eventController.delete);
    return router;
}
