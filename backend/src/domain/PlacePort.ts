import { Place } from './Place';

export interface PlacePort {
  findAll(): Promise<Place[]>;
  findById(id: number): Promise<Place | null>;
  create?(place: Omit<Place, 'id_lugar'>): Promise<Place>;
}
