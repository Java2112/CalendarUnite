"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PlaceController = void 0;
class PlaceController {
    getPlacesUseCase;
    constructor(getPlacesUseCase) {
        this.getPlacesUseCase = getPlacesUseCase;
    }
    getAll = async (req, res) => {
        try {
            const places = await this.getPlacesUseCase.execute();
            return res.json(places);
        }
        catch (error) {
            return res.status(500).json({ error: error.message || 'Error al obtener lugares' });
        }
    };
}
exports.PlaceController = PlaceController;
