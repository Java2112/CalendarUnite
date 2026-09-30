"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DeleteEventUseCase = void 0;
// Importa el tipo de rol y reglas de negocio del dominio de usuarios
const User_1 = require("../../../domain/User");
// Caso de uso para eliminar un evento con validación de propiedad/rol
class DeleteEventUseCase {
    eventPort;
    // Inyecta el puerto de persistencia de eventos
    constructor(eventPort) {
        this.eventPort = eventPort;
    }
    // Ejecuta la eliminación del evento verificando permisos
    async execute(eventId, currentUser) {
        // Busca si el evento a eliminar existe en la base de datos
        const existing = await this.eventPort.findById(eventId);
        // Si no existe, lanza error 404
        if (!existing) {
            const err = new Error('El evento solicitado no existe.');
            err.status = 404;
            throw err;
        }
        // Valida si el usuario actual es admin o el responsable del evento
        const canManage = User_1.UserDomainRule.isAuthorizedToManageEvent(currentUser, existing);
        // Si no tiene permisos, lanza error 403 Forbidden
        if (!canManage) {
            const err = new Error('Acceso denegado: No tienes autorización para eliminar este evento. Solo el usuario responsable o un Administrador pueden eliminarlo.');
            err.status = 403;
            throw err;
        }
        // Ejecuta la eliminación física/lógica a través del puerto
        return this.eventPort.delete(eventId);
    }
}
exports.DeleteEventUseCase = DeleteEventUseCase;
