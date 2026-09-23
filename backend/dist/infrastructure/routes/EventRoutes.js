"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createEventRoutes = createEventRoutes;
const express_1 = require("express");
function createEventRoutes(eventController) {
    const router = (0, express_1.Router)();
    router.get('/events', eventController.getAll);
    router.get('/events/:id', eventController.getById);
    router.post('/events/:id/register', eventController.register);
    router.get('/stats', eventController.getStats);
    return router;
}
