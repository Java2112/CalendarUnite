"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateEventUseCase = void 0;
// Caso de uso para crear un nuevo evento en el sistema
class CreateEventUseCase {
    eventPort;
    // Inyecta el puerto de persistencia de eventos
    constructor(eventPort) {
        this.eventPort = eventPort;
    }
    // Ejecuta la creación del evento validando reglas de negocio
    async execute(dto, currentUser) {
        // Valida que el nombre no esté vacío
        if (!dto.nombre || dto.nombre.trim() === '') {
            throw new Error('El nombre del evento es obligatorio.');
        }
        // Valida que la descripción no esté vacía
        if (!dto.descripcion || dto.descripcion.trim() === '') {
            throw new Error('La descripción del evento es obligatoria.');
        }
        // Valida que la fecha de inicio esté presente
        if (!dto.fecha_inicio) {
            throw new Error('La fecha de inicio es obligatoria.');
        }
        // Valida que se haya seleccionado un lugar válido
        if (!dto.id_lugar) {
            throw new Error('Debe seleccionar un lugar válido para el evento.');
        }
        // Estructura el objeto de datos del evento para la base de datos
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
        // Invoca al puerto para persistir el evento y retorna el resultado
        return this.eventPort.create(eventData, dto.banner_url);
    }
}
exports.CreateEventUseCase = CreateEventUseCase;
