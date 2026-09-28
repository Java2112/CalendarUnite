// Importa el puerto de lugares del dominio
import { PlacePort } from '../../domain/PlacePort';
// Importa la entidad Place del dominio
import { Place } from '../../domain/Place';
// Importa el pool de conexiones a la base de datos
import { pool } from '../config/database';

// Adaptador de infraestructura para persistencia de lugares en PostgreSQL
export class PlaceAdapter implements PlacePort {
  // Constructor que siembra lugares iniciales si la tabla está vacía
  constructor() {
    this.ensureInitialSites();
  }

  // Método privado para garantizar la existencia de lugares por defecto en la BD
  private async ensureInitialSites(): Promise<void> {
    try {
      // Consulta cuántos sitios existen actualmente
      const res = await pool.query('SELECT COUNT(*) as count FROM site');
      const count = parseInt(res.rows[0]?.count || '0', 10);
      // Si la tabla está vacía, inserta los lugares predeterminados
      if (count === 0) {
        const initialPlaces = [
          ['Auditorio Principal', 'Campus Principal Cra 15 # 45-20', 'Edificio A - Fundadores', 'Auditorio 1'],
          ['Salón de Cultura y Expresión Artística', 'Campus Principal Cra 15 # 45-20', 'Casa U Bienestar', 'Salón 201'],
          ['Canchas Sintéticas Múltiples', 'Campus Norte - Sector Deportivo', 'Complejo Deportivo', 'Cancha Principal'],
          ['Taller de Artes B-204', 'Campus Principal Cra 15 # 45-20', 'Edificio B - Artes Integradas', 'Taller 204'],
          ['Espacio Virtual Institucional', 'Plataforma Digital', 'Campus Virtual', 'Sala Digital']
        ];

        // Inserta cada lugar en la tabla site
        for (const p of initialPlaces) {
          await pool.query(
            'INSERT INTO site (name, address, building, classroom) VALUES ($1, $2, $3, $4)',
            p
          );
        }
        console.log('[PlaceAdapter] Lugares/Sitios iniciales sembrados en PostgreSQL con éxito.');
      }
    } catch (err: any) {
      // Registra advertencia si falla la inicialización
      console.warn('[PlaceAdapter] Advertencia al verificar/sembrar sitios en PostgreSQL:', err.message);
    }
  }

  // Mapea una fila de la tabla site a la entidad Place del dominio
  private mapRowToPlace(row: any): Place {
    return {
      id_lugar: row.id_site,
      nombre: row.name,
      direccion: row.address || '',
      edificio: row.building || '',
      aula: row.classroom || ''
    };
  }

  // Consulta todos los lugares ordenados por ID ascendente
  async findAll(): Promise<Place[]> {
    const res = await pool.query('SELECT * FROM site ORDER BY id_site ASC');
    return res.rows.map((r: any) => this.mapRowToPlace(r));
  }

  // Busca un lugar por su ID
  async findById(id: number): Promise<Place | null> {
    const res = await pool.query('SELECT * FROM site WHERE id_site = $1 LIMIT 1', [Number(id)]);
    if (!res.rows || res.rows.length === 0) return null;
    return this.mapRowToPlace(res.rows[0]);
  }

  // Crea un nuevo registro de lugar en la base de datos
  async create(placeData: Omit<Place, 'id_lugar'>): Promise<Place> {
    const res = await pool.query(
      'INSERT INTO site (name, address, building, classroom) VALUES ($1, $2, $3, $4) RETURNING id_site',
      [placeData.nombre, placeData.direccion || null, placeData.edificio || null, placeData.aula || null]
    );

    const created = await this.findById(res.rows[0].id_site);
    if (!created) {
      throw new Error('Error al recuperar el sitio creado en PostgreSQL');
    }
    return created;
  }
}
