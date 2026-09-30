"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetEventsUseCase = void 0;
// Caso de uso para obtener la lista de actividades con filtros opcionales
class GetEventsUseCase {
    eventPort;
    // Inyecta el puerto de eventos
    constructor(eventPort) {
        this.eventPort = eventPort;
    }
    // Ejecuta la consulta de actividades según modalidad y término de búsqueda
    async execute(modality, search) {
        // Consulta al puerto y retorna el arreglo de eventos
        return this.eventPort.findAll(modality, search);
    }
}
exports.GetEventsUseCase = GetEventsUseCase;
