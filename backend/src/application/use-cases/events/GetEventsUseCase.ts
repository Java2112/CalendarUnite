import { EventPort } from '../../../domain/EventPort';
import { Event } from '../../../domain/Event';

export class GetEventsUseCase {
  constructor(private eventPort: EventPort) {}

  async execute(modality?: string, search?: string): Promise<Event[]> {
    return this.eventPort.findAll(modality, search);
  }
}
