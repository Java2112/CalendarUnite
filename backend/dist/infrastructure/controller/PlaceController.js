"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PlaceController = void 0;
// Controlador HTTP para las rutas del catálogo de lugares
class PlaceController {
    getPlacesUseCase;
    // Inyecta el caso de uso de lugares
    constructor(getPlacesUseCase) {
        this.getPlacesUseCase = getPlacesUseCase;
    }
    // Manejador GET para listar todos los lugares disponibles
    getAll = async (req, res) => {
        // Inicia bloque try-catch
        try {
            // Ejecuta el caso de uso para obtener los lugares
            const places = await this.getPlacesUseCase.execute();
            // Retorna la lista de lugares en formato JSON
            return res.json(places);
        }
        catch (error) {
            // Retorna error 500 si ocurre una falla en el servidor
            return res.status(500).json({ error: error.message || 'Error al obtener lugares' });
        }
    };
}
exports.PlaceController = PlaceController;
