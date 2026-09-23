"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateEventUseCase = void 0;
class CreateEventUseCase {
    eventPort;
    constructor(eventPort) {
        this.eventPort = eventPort;
    }
    async execute(dto, currentUser) {
        if (!dto.nombre || dto.nombre.trim() === '') {
            throw new Error('El nombre del evento es obligatorio.');
        }
        if (!dto.descripcion || dto.descripcion.trim() === '') {
            throw new Error('La descripción del evento es obligatoria.');
        }
        if (!dto.fecha_inicio) {
            throw new Error('La fecha de inicio es obligatoria.');
        }
        if (!dto.id_lugar) {
            throw new Error('Debe seleccionar un lugar válido para el evento.');
        }
        const eventData = {
            nombre: dto.nombre.trim(),
            modalidad: dto.modalidad || 'Presencial',
            link_virtual: Array.isArray(dto.link_virtual) ? dto.link_virtual : [],
            descripcion: dto.descripcion.trim(),
            fecha_inicio: dto.fecha_inicio,
            fecha_fin: dto.fecha_fin || null,
            hora_inicio: dto.hora_inicio || null,
            hora_fin: dto.hora_fin || null,
            estado: dto.estado || 'Activo',
            id_lugar: Number(dto.id_lugar),
            id_responsable: Number(currentUser.id_usuario),
            category: dto.category || 'General',
            totalSpots: dto.totalSpots || 50,
            availableSpots: dto.totalSpots || 50
        };
        return this.eventPort.create(eventData, dto.banner_url);
    }
}
exports.CreateEventUseCase = CreateEventUseCase;
