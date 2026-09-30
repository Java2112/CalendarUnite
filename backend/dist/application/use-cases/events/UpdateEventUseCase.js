"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateEventUseCase = void 0;
// Importa los roles y reglas de negocio del dominio de usuarios
const User_1 = require("../../../domain/User");
// Caso de uso para actualizar un evento con validación de propiedad/rol
class UpdateEventUseCase {
    eventPort;
    // Inyecta el puerto de eventos
    constructor(eventPort) {
        this.eventPort = eventPort;
    }
    // Ejecuta la actualización verificando la existencia y permisos
    async execute(eventId, dto, currentUser) {
        // Consulta si el evento existe
        const existing = await this.eventPort.findById(eventId);
        // Si no existe, lanza error 404
        if (!existing) {
            const err = new Error('El evento solicitado no existe.');
            err.status = 404;
            throw err;
        }
        // Verifica si el usuario actual tiene permisos para modificar este evento
        const canManage = User_1.UserDomainRule.isAuthorizedToManageEvent(currentUser, existing);
        // Si no tiene permisos, lanza error 403 Forbidden
        if (!canManage) {
            const err = new Error('Acceso denegado: No tienes autorización para editar este evento. Solo el usuario responsable o un Administrador pueden realizar cambios.');
            err.status = 403;
            throw err;
        }
        // Construye el payload de actualización con los campos recibidos
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
        // Persiste los cambios a través del puerto
        const updated = await this.eventPort.update(eventId, updatePayload, dto.banner_url);
        // Si la actualización falla, lanza excepción
        if (!updated) {
            throw new Error('No se pudo actualizar el evento en la base de datos.');
        }
        // Retorna el evento actualizado
        return updated;
    }
}
exports.UpdateEventUseCase = UpdateEventUseCase;
