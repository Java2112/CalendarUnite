"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetPlacesUseCase = void 0;
// Caso de uso para obtener el catálogo completo de lugares del campus
class GetPlacesUseCase {
    placePort;
    // Inyecta el puerto de lugares
    constructor(placePort) {
        this.placePort = placePort;
    }
    // Ejecuta la consulta de todos los lugares
    async execute() {
        // Consulta al puerto y retorna el listado de espacios
        return this.placePort.findAll();
    }
}
exports.GetPlacesUseCase = GetPlacesUseCase;
