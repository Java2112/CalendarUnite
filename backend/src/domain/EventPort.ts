import { Event, Attendee, EventStats } from './Event';

export interface EventPort {
  findAll(modality?: string, search?: string): Promise<Event[]>;
  findById(id: number | string): Promise<Event | null>;
  create(event: Omit<Event, 'id_evento'>, bannerUrl?: string): Promise<Event>;
  update(id: number, data: Partial<Event>, bannerUrl?: string): Promise<Event | null>;
  delete(id: number): Promise<boolean>;
  findAttendeeByEventAndEmail(eventId: string, email: string): Promise<Attendee | null>;
  saveAttendee(attendee: Attendee): Promise<Attendee>;
  updateAvailableSpots(eventId: string, spots: number): Promise<void>;
  getStats(): Promise<EventStats>;
}
