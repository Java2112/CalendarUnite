import { EventPort } from '../../../domain/EventPort';
import { Event } from '../../../domain/Event';

export class GetEventByIdUseCase {
  constructor(private eventPort: EventPort) {}

  async execute(id: number | string): Promise<Event | null> {
    return this.eventPort.findById(id);
  }
}
