"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DeleteEventUseCase = void 0;
const User_1 = require("../../../domain/User");
class DeleteEventUseCase {
    eventPort;
    constructor(eventPort) {
        this.eventPort = eventPort;
    }
    async execute(eventId, currentUser) {
        const existing = await this.eventPort.findById(eventId);
        if (!existing) {
            const err = new Error('El evento solicitado no existe.');
            err.status = 404;
            throw err;
        }
        const canManage = User_1.UserDomainRule.isAuthorizedToManageEvent(currentUser, existing);
        if (!canManage) {
            const err = new Error('Acceso denegado: No tienes autorización para eliminar este evento. Solo el usuario responsable o un Administrador pueden eliminarlo.');
            err.status = 403;
            throw err;
        }
        return this.eventPort.delete(eventId);
    }
}
exports.DeleteEventUseCase = DeleteEventUseCase;
