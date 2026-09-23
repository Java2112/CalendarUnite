"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EventApplication = void 0;
class EventApplication {
    eventPort;
    constructor(eventPort) {
        this.eventPort = eventPort;
    }
    async getEvents(modality, search) {
        return this.eventPort.findAll(modality, search);
    }
    async getEventById(id) {
        return this.eventPort.findById(id);
    }
    async registerAttendee(eventId, nombre, correo, telefono) {
        const event = await this.eventPort.findById(eventId);
        if (!event) {
            throw new Error('El evento especificado no existe.');
        }
        const availableSpots = event.availableSpots ?? event.totalSpots ?? 0;
        if (availableSpots <= 0) {
            throw new Error('No quedan cupos disponibles para este evento.');
        }
        const existing = await this.eventPort.findAttendeeByEventAndEmail(eventId, correo.trim());
        if (existing) {
            throw new Error('Este correo electrónico ya se encuentra registrado en este evento.');
        }
        const updatedSpots = availableSpots - 1;
        await this.eventPort.updateAvailableSpots(eventId, updatedSpots);
        const newAttendee = {
            id: `att-${Date.now()}`,
            eventId,
            nombre: nombre.trim(),
            correo: correo.trim(),
            telefono: telefono.trim(),
            registeredAt: new Date().toISOString()
        };
        const savedAttendee = await this.eventPort.saveAttendee(newAttendee);
        return {
            attendee: savedAttendee,
            updatedAvailableSpots: updatedSpots
        };
    }
    async getStats() {
        return this.eventPort.getStats();
    }
}
exports.EventApplication = EventApplication;
