"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EventApplication = void 0;
// Servicio de aplicación para la gestión y registro de eventos
class EventApplication {
    eventPort;
    // Inyecta el puerto de eventos
    constructor(eventPort) {
        this.eventPort = eventPort;
    }
    // Consulta la lista de eventos con filtros
    async getEvents(modality, search) {
        // Retorna todos los eventos que coincidan
        return this.eventPort.findAll(modality, search);
    }
    // Consulta un evento por su ID
    async getEventById(id) {
        // Retorna el evento correspondiente
        return this.eventPort.findById(id);
    }
    // Registra a un estudiante como asistente y descuenta un cupo disponible
    async registerAttendee(eventId, nombre, correo, telefono) {
        // Busca el evento donde se quiere inscribir
        const event = await this.eventPort.findById(eventId);
        // Si el evento no existe, lanza error
        if (!event) {
            throw new Error('El evento especificado no existe.');
        }
        // Calcula los cupos disponibles actuales
        const availableSpots = event.availableSpots ?? event.totalSpots ?? 0;
        // Si no quedan cupos, rechaza el registro
        if (availableSpots <= 0) {
            throw new Error('No quedan cupos disponibles para este evento.');
        }
        // Verifica que el correo no esté ya inscrito en esta actividad
        const existing = await this.eventPort.findAttendeeByEventAndEmail(eventId, correo.trim());
        // Si ya está registrado, lanza error
        if (existing) {
            throw new Error('Este correo electrónico ya se encuentra registrado en este evento.');
        }
        // Descuenta un cupo disponible
        const updatedSpots = availableSpots - 1;
        // Persiste los nuevos cupos disponibles
        await this.eventPort.updateAvailableSpots(eventId, updatedSpots);
        // Construye el registro del nuevo asistente
        const newAttendee = {
            id: `att-${Date.now()}`,
            eventId,
            nombre: nombre.trim(),
            correo: correo.trim(),
            telefono: telefono.trim(),
            registeredAt: new Date().toISOString()
        };
        // Guarda el asistente en la base de datos
        const savedAttendee = await this.eventPort.saveAttendee(newAttendee);
        // Retorna los datos del asistente y cupos actualizados
        return {
            attendee: savedAttendee,
            updatedAvailableSpots: updatedSpots
        };
    }
    // Obtiene el consolidado de estadísticas
    async getStats() {
        // Retorna el objeto de estadísticas desde el puerto
        return this.eventPort.getStats();
    }
}
exports.EventApplication = EventApplication;
