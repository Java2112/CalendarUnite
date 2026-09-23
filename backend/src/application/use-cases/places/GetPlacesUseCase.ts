import { PlacePort } from '../../../domain/PlacePort';
import { Place } from '../../../domain/Place';

export class GetPlacesUseCase {
  constructor(private placePort: PlacePort) {}

  async execute(): Promise<Place[]> {
    return this.placePort.findAll();
  }
}
