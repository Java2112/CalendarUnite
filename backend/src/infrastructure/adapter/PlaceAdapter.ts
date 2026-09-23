import { PlacePort } from '../../domain/PlacePort';
import { Place } from '../../domain/Place';

export class PlaceAdapter implements PlacePort {
  private places: Place[] = [
    {
      id_lugar: 1,
      nombre: 'Auditorio Principal',
      direccion: 'Campus Principal Cra 15 # 45-20',
      edificio: 'Edificio A - Fundadores',
      aula: 'Auditorio 1'
    },
    {
      id_lugar: 2,
      nombre: 'Salón de Cultura y Expresión Artística',
      direccion: 'Campus Principal Cra 15 # 45-20',
      edificio: 'Casa U Bienestar',
      aula: 'Salón 201'
    },
    {
      id_lugar: 3,
      nombre: 'Canchas Sintéticas Múltiples',
      direccion: 'Campus Norte - Sector Deportivo',
      edificio: 'Complejo Deportivo',
      aula: 'Cancha Principal'
    },
    {
      id_lugar: 4,
      nombre: 'Taller de Artes B-204',
      direccion: 'Campus Principal Cra 15 # 45-20',
      edificio: 'Edificio B - Artes Integradas',
      aula: 'Taller 204'
    },
    {
      id_lugar: 5,
      nombre: 'Espacio Virtual Institucional',
      direccion: 'Plataforma Digital',
      edificio: 'Campus Virtual',
      aula: 'Sala Digital'
    }
  ];

  async findAll(): Promise<Place[]> {
    return [...this.places];
  }

  async findById(id: number): Promise<Place | null> {
    const place = this.places.find(p => p.id_lugar === Number(id));
    return place || null;
  }

  async create(placeData: Omit<Place, 'id_lugar'>): Promise<Place> {
    const nextId = this.places.length > 0 ? Math.max(...this.places.map(p => p.id_lugar)) + 1 : 1;
    const newPlace: Place = {
      id_lugar: nextId,
      ...placeData
    };
    this.places.push(newPlace);
    return newPlace;
  }
}
