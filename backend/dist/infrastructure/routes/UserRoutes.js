"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createUserRoutes = createUserRoutes;
const express_1 = require("express");
function createUserRoutes(userController) {
    const router = (0, express_1.Router)();
    router.post('/login', userController.login);
    router.get('/me', userController.getMe);
    return router;
}
