import { RowDataPacket, ResultSetHeader } from 'mysql2/promise';
import { PlacePort } from '../../domain/PlacePort';
import { Place } from '../../domain/Place';
import { pool } from '../config/database';

export class PlaceAdapter implements PlacePort {
  constructor() {
    this.ensureInitialSites();
  }

  private async ensureInitialSites(): Promise<void> {
    try {
      const [rows] = await pool.query<RowDataPacket[]>('SELECT COUNT(*) as count FROM site');
      const count = rows[0]?.count || 0;
      if (count === 0) {
        const initialPlaces = [
          ['Auditorio Principal', 'Campus Principal Cra 15 # 45-20', 'Edificio A - Fundadores', 'Auditorio 1'],
          ['Salón de Cultura y Expresión Artística', 'Campus Principal Cra 15 # 45-20', 'Casa U Bienestar', 'Salón 201'],
          ['Canchas Sintéticas Múltiples', 'Campus Norte - Sector Deportivo', 'Complejo Deportivo', 'Cancha Principal'],
          ['Taller de Artes B-204', 'Campus Principal Cra 15 # 45-20', 'Edificio B - Artes Integradas', 'Taller 204'],
          ['Espacio Virtual Institucional', 'Plataforma Digital', 'Campus Virtual', 'Sala Digital']
        ];

        for (const p of initialPlaces) {
          await pool.query(
            'INSERT INTO site (name, address, building, classroom) VALUES (?, ?, ?, ?)',
            p
          );
        }
        console.log('[PlaceAdapter] Lugares/Sitios iniciales sembrados en MySQL con éxito.');
      }
    } catch (err: any) {
      console.warn('[PlaceAdapter] Advertencia al verificar/sembrar sitios iniciales:', err.message);
    }
  }

  private mapRowToPlace(row: any): Place {
    return {
      id_lugar: row.id_site,
      nombre: row.name,
      direccion: row.address || '',
      edificio: row.building || '',
      aula: row.classroom || ''
    };
  }

  async findAll(): Promise<Place[]> {
    const [rows] = await pool.query<RowDataPacket[]>('SELECT * FROM site ORDER BY id_site ASC');
    return rows.map((r: any) => this.mapRowToPlace(r));
  }

  async findById(id: number): Promise<Place | null> {
    const [rows] = await pool.query<RowDataPacket[]>('SELECT * FROM site WHERE id_site = ? LIMIT 1', [Number(id)]);
    if (!rows || rows.length === 0) return null;
    return this.mapRowToPlace(rows[0]);
  }

  async create(placeData: Omit<Place, 'id_lugar'>): Promise<Place> {
    const [result] = await pool.execute<ResultSetHeader>(
      'INSERT INTO site (name, address, building, classroom) VALUES (?, ?, ?, ?)',
      [placeData.nombre, placeData.direccion || null, placeData.edificio || null, placeData.aula || null]
    );

    const created = await this.findById(result.insertId);
    if (!created) {
      throw new Error('Error al recuperar el sitio creado en MySQL');
    }
    return created;
  }
}
