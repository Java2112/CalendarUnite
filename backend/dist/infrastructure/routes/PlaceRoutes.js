"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createPlaceRoutes = createPlaceRoutes;
const express_1 = require("express");
function createPlaceRoutes(placeController) {
    const router = (0, express_1.Router)();
    router.get('/places', placeController.getAll);
    return router;
}
