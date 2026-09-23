import { Event, Attendee, EventStats } from './Event';

export interface EventPort {
  findAll(modality?: string, search?: string): Promise<Event[]>;
  findById(id: string): Promise<Event | null>;
  findAttendeeByEventAndEmail(eventId: string, email: string): Promise<Attendee | null>;
  saveAttendee(attendee: Attendee): Promise<Attendee>;
  updateAvailableSpots(eventId: string, spots: number): Promise<void>;
  getStats(): Promise<EventStats>;
}
