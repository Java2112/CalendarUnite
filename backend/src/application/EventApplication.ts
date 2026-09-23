import { EventPort } from '../domain/EventPort';
import { Event, Attendee, EventStats } from '../domain/Event';

export class EventApplication {
  constructor(private eventPort: EventPort) {}

  async getEvents(modality?: string, search?: string): Promise<Event[]> {
    return this.eventPort.findAll(modality, search);
  }

  async getEventById(id: string): Promise<Event | null> {
    return this.eventPort.findById(id);
  }

  async registerAttendee(
    eventId: string,
    nombre: string,
    correo: string,
    telefono: string
  ): Promise<{ attendee: Attendee; updatedAvailableSpots: number }> {
    const event = await this.eventPort.findById(eventId);
    if (!event) {
      throw new Error('El evento especificado no existe.');
    }

    if (event.availableSpots <= 0) {
      throw new Error('No quedan cupos disponibles para este evento.');
    }

    const existing = await this.eventPort.findAttendeeByEventAndEmail(eventId, correo.trim());
    if (existing) {
      throw new Error('Este correo electrónico ya se encuentra registrado en este evento.');
    }

    const updatedSpots = event.availableSpots - 1;
    await this.eventPort.updateAvailableSpots(eventId, updatedSpots);

    const newAttendee: Attendee = {
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

  async getStats(): Promise<EventStats> {
    return this.eventPort.getStats();
  }
}
