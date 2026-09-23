"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetPlacesUseCase = void 0;
class GetPlacesUseCase {
    placePort;
    constructor(placePort) {
        this.placePort = placePort;
    }
    async execute() {
        return this.placePort.findAll();
    }
}
exports.GetPlacesUseCase = GetPlacesUseCase;
