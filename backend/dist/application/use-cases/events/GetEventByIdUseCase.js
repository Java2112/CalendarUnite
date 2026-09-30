"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetEventByIdUseCase = void 0;
// Caso de uso para consultar un evento específico por su ID
class GetEventByIdUseCase {
    eventPort;
    // Inyecta el puerto de eventos
    constructor(eventPort) {
        this.eventPort = eventPort;
    }
    // Ejecuta la búsqueda del evento por su identificador
    async execute(id) {
        // Consulta al puerto y retorna el evento encontrado o null
        return this.eventPort.findById(id);
    }
}
exports.GetEventByIdUseCase = GetEventByIdUseCase;
