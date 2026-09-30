"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createPlaceRoutes = createPlaceRoutes;
// Importa el enrutador de Express
const express_1 = require("express");
// Función para registrar y configurar las rutas de lugares del campus
function createPlaceRoutes(placeController) {
    // Instancia el enrutador de Express
    const router = (0, express_1.Router)();
    // Ruta GET pública para obtener el catálogo de lugares
    router.get('/places', placeController.getAll);
    // Retorna el enrutador configurado
    return router;
}
