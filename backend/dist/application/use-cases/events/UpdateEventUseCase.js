"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateEventUseCase = void 0;
const User_1 = require("../../../domain/User");
class UpdateEventUseCase {
    eventPort;
    constructor(eventPort) {
        this.eventPort = eventPort;
    }
    async execute(eventId, dto, currentUser) {
        const existing = await this.eventPort.findById(eventId);
        if (!existing) {
            const err = new Error('El evento solicitado no existe.');
            err.status = 404;
            throw err;
        }
        const canManage = User_1.UserDomainRule.isAuthorizedToManageEvent(currentUser, existing);
        if (!canManage) {
            const err = new Error('Acceso denegado: No tienes autorización para editar este evento. Solo el usuario responsable o un Administrador pueden realizar cambios.');
            err.status = 403;
            throw err;
        }
        const updatePayload = {};
        if (dto.nombre !== undefined)
            updatePayload.nombre = dto.nombre.trim();
        if (dto.modalidad !== undefined)
            updatePayload.modalidad = dto.modalidad;
        if (dto.link_virtual !== undefined)
            updatePayload.link_virtual = dto.link_virtual;
        if (dto.descripcion !== undefined)
            updatePayload.descripcion = dto.descripcion.trim();
        if (dto.fecha_inicio !== undefined)
            updatePayload.fecha_inicio = dto.fecha_inicio;
        if (dto.fecha_fin !== undefined)
            updatePayload.fecha_fin = dto.fecha_fin;
        if (dto.hora_inicio !== undefined)
            updatePayload.hora_inicio = dto.hora_inicio;
        if (dto.hora_fin !== undefined)
            updatePayload.hora_fin = dto.hora_fin;
        if (dto.estado !== undefined)
            updatePayload.estado = dto.estado;
        if (dto.id_lugar !== undefined)
            updatePayload.id_lugar = Number(dto.id_lugar);
        if (dto.category !== undefined)
            updatePayload.category = dto.category;
        if (dto.totalSpots !== undefined)
            updatePayload.totalSpots = Number(dto.totalSpots);
        const updated = await this.eventPort.update(eventId, updatePayload, dto.banner_url);
        if (!updated) {
            throw new Error('No se pudo actualizar el evento.');
        }
        return updated;
    }
}
exports.UpdateEventUseCase = UpdateEventUseCase;
