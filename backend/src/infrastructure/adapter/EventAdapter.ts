import { EventPort } from '../../domain/EventPort';
import { Event, Attendee, EventStats } from '../../domain/Event';
import { PlaceAdapter } from './PlaceAdapter';
import { UserAdapter } from './UserAdapter';
import { AttachmentAdapter } from './AttachmentAdapter';
import { pool } from '../config/database';

export class EventAdapter implements EventPort {
  private inMemoryAttendees: Attendee[] = [];

  constructor(
    private placeAdapter?: PlaceAdapter,
    private userAdapter?: UserAdapter,
    private attachmentAdapter?: AttachmentAdapter
  ) {
    this.ensureInitialEvents();
  }

  private async ensureInitialEvents(): Promise<void> {
    try {
      await new Promise(resolve => setTimeout(resolve, 800));

      const res = await pool.query('SELECT COUNT(*) as count FROM event');
      const count = parseInt(res.rows[0]?.count || '0', 10);
      if (count === 0) {
        const sitesRes = await pool.query('SELECT id_site FROM site LIMIT 5');
        const usersRes = await pool.query('SELECT id_user FROM "user" LIMIT 5');

        if (sitesRes.rows.length === 0 || usersRes.rows.length === 0) {
          return;
        }

        const initialEvents = [
          {
            name: 'Hablemos: Manejo de Ansiedad en Parciales',
            modality: 'Virtual',
            link_virtual: ['https://meet.google.com/abc-defg-hij'],
            description: 'Espacio de acompañamiento psicológico virtual y preguntas en línea sobre cómo afrontar la carga académica.',
            start_date: '2026-09-18',
            end_date: '2026-09-18',
            start_hour: '08:00:00',
            end_hour: '09:30:00',
            status: 'Activo',
            id_site: sitesRes.rows[4]?.id_site || sitesRes.rows[0].id_site,
            id_in_charge: usersRes.rows[1]?.id_user || usersRes.rows[0].id_user
          },
          {
            name: 'Inducción Coro y Ensamble Universitario',
            modality: 'Presencial',
            link_virtual: [],
            description: 'Encuentro e integración para estudiantes interesados en formar parte del coro institucional y agrupaciones musicales.',
            start_date: '2026-09-18',
            end_date: '2026-09-18',
            start_hour: '16:00:00',
            end_hour: '18:00:00',
            status: 'Activo',
            id_site: sitesRes.rows[1]?.id_site || sitesRes.rows[0].id_site,
            id_in_charge: usersRes.rows[1]?.id_user || usersRes.rows[0].id_user
          },
          {
            name: 'Torneo Relámpago de Fútsal Mixto Nocturno',
            modality: 'Presencial',
            link_virtual: [],
            description: 'Gran torneo relámpago interfacultades para estudiantes. Habrá premiación e hidratación deportiva.',
            start_date: '2026-09-22',
            end_date: '2026-09-22',
            start_hour: '18:30:00',
            end_hour: '21:30:00',
            status: 'Activo',
            id_site: sitesRes.rows[2]?.id_site || sitesRes.rows[0].id_site,
            id_in_charge: usersRes.rows[2]?.id_user || usersRes.rows[0].id_user
          }
        ];

        for (const e of initialEvents) {
          await pool.query(
            `INSERT INTO event (name, modality, link_virtual, description, start_date, end_date, start_hour, end_hour, status, id_site, id_in_charge)
             VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)`,
            [
              e.name,
              e.modality,
              e.link_virtual,
              e.description,
              e.start_date,
              e.end_date,
              e.start_hour,
              e.end_hour,
              e.status,
              e.id_site,
              e.id_in_charge
            ]
          );
        }
        console.log('[EventAdapter] Eventos iniciales sembrados en PostgreSQL con éxito.');
      }
    } catch (err: any) {
      console.warn('[EventAdapter] Advertencia al verificar/sembrar eventos en PostgreSQL:', err.message);
    }
  }

  private parseLinks(linkVal: any): string[] {
    if (!linkVal) return [];
    if (Array.isArray(linkVal)) return linkVal;
    try {
      const parsed = JSON.parse(linkVal);
      return Array.isArray(parsed) ? parsed : [String(parsed)];
    } catch {
      return [String(linkVal)];
    }
  }

  private mapRowToEvent(row: any): Event {
    const startHourStr = row.start_hour ? String(row.start_hour).substring(0, 5) : '';
    const endHourStr = row.end_hour ? String(row.end_hour).substring(0, 5) : '';
    const timeFormatted = startHourStr && endHourStr ? `${startHourStr} - ${endHourStr}` : '';
    const dateFormatted = row.start_date ? new Date(row.start_date).toISOString().split('T')[0] : '';
    const links = this.parseLinks(row.link_virtual);

    return {
      id_evento: row.id_event,
      id: `evt-${row.id_event}`,
      nombre: row.name,
      title: row.name,
      modalidad: row.modality,
      modality: row.modality,
      link_virtual: links,
      descripcion: row.description || '',
      fecha_inicio: dateFormatted,
      fecha_fin: row.end_date ? new Date(row.end_date).toISOString().split('T')[0] : dateFormatted,
      date: dateFormatted,
      hora_inicio: startHourStr,
      hora_fin: endHourStr,
      time: timeFormatted,
      estado: row.status || 'Activo',
      id_lugar: row.id_site,
      id_responsable: row.id_in_charge,
      totalSpots: 50,
      availableSpots: 35,
      imageUrl: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&w=600&q=80',
      banner_url: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&w=600&q=80'
    };
  }

  private async enrichEvent(event: Event): Promise<Event> {
    const copy = { ...event };

    if (this.placeAdapter && copy.id_lugar) {
      const place = await this.placeAdapter.findById(copy.id_lugar);
      if (place) {
        copy.lugar = place;
        copy.location = `${place.nombre} (${place.edificio || ''} ${place.aula || ''})`.trim();
      }
    }

    if (this.userAdapter && copy.id_responsable) {
      const user = await this.userAdapter.findById(copy.id_responsable);
      if (user) {
        copy.responsable = {
          id_usuario: user.id_usuario,
          nombre: user.nombre,
          apellido: user.apellido,
          correo: user.correo,
          rol: user.rol
        };
        copy.organizer = `${user.nombre} ${user.apellido} (${user.rol})`;
      }
    }

    return copy;
  }

  async findAll(modality?: string, search?: string): Promise<Event[]> {
    let sql = 'SELECT * FROM event WHERE 1=1';
    const params: any[] = [];
    let paramIndex = 1;

    if (modality && modality !== 'Todas') {
      sql += ` AND LOWER(modality::text) = LOWER($${paramIndex})`;
      params.push(modality);
      paramIndex++;
    }

    if (search) {
      sql += ` AND (LOWER(name) LIKE $${paramIndex} OR LOWER(description) LIKE $${paramIndex})`;
      const term = `%${search.toLowerCase()}%`;
      params.push(term);
      paramIndex++;
    }

    sql += ' ORDER BY id_event DESC';

    const res = await pool.query(sql, params);
    const mapped = res.rows.map((r: any) => this.mapRowToEvent(r));
    return Promise.all(mapped.map(e => this.enrichEvent(e)));
  }

  async findById(id: number | string): Promise<Event | null> {
    const cleanId = String(id).replace(/^evt-/, '');
    const res = await pool.query(
      'SELECT * FROM event WHERE id_event = $1 LIMIT 1',
      [Number(cleanId)]
    );
    if (!res.rows || res.rows.length === 0) return null;

    const event = this.mapRowToEvent(res.rows[0]);
    return this.enrichEvent(event);
  }

  async create(eventData: Omit<Event, 'id_evento'>, bannerUrl?: string): Promise<Event> {
    const rawModality = eventData.modalidad || 'Presencial';
    const modalityToSave = rawModality === 'Virtual' ? 'Virtual' : 'Presencial';
    const linkArray = Array.isArray(eventData.link_virtual) ? eventData.link_virtual : [];

    const res = await pool.query(
      `INSERT INTO event (name, modality, link_virtual, description, start_date, end_date, start_hour, end_hour, status, id_site, id_in_charge)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
       RETURNING id_event`,
      [
        eventData.nombre,
        modalityToSave,
        linkArray,
        eventData.descripcion || '',
        eventData.fecha_inicio,
        eventData.fecha_fin || eventData.fecha_inicio,
        eventData.hora_inicio || null,
        eventData.hora_fin || null,
        eventData.estado || 'Activo',
        eventData.id_lugar,
        eventData.id_responsable
      ]
    );

    const created = await this.findById(res.rows[0].id_event);
    if (!created) {
      throw new Error('No se pudo recuperar el evento creado en PostgreSQL');
    }
    return created;
  }

  async update(id: number, data: Partial<Event>, bannerUrl?: string): Promise<Event | null> {
    const existing = await this.findById(id);
    if (!existing) return null;

    const name = data.nombre !== undefined ? data.nombre : existing.nombre;
    const modality = data.modalidad !== undefined ? (data.modalidad === 'Virtual' ? 'Virtual' : 'Presencial') : (existing.modalidad === 'Virtual' ? 'Virtual' : 'Presencial');
    const links = data.link_virtual !== undefined ? (Array.isArray(data.link_virtual) ? data.link_virtual : [data.link_virtual]) : (existing.link_virtual || []);
    const desc = data.descripcion !== undefined ? data.descripcion : existing.descripcion;
    const startDate = data.fecha_inicio !== undefined ? data.fecha_inicio : existing.fecha_inicio;
    const endDate = data.fecha_fin !== undefined ? data.fecha_fin : (existing.fecha_fin || existing.fecha_inicio);
    const startHour = data.hora_inicio !== undefined ? data.hora_inicio : existing.hora_inicio;
    const endHour = data.hora_fin !== undefined ? data.hora_fin : existing.hora_fin;
    const status = data.estado !== undefined ? data.estado : existing.estado;
    const idSite = data.id_lugar !== undefined ? data.id_lugar : existing.id_lugar;
    const idResp = data.id_responsable !== undefined ? data.id_responsable : existing.id_responsable;

    await pool.query(
      `UPDATE event 
       SET name = $1, modality = $2, link_virtual = $3, description = $4, start_date = $5, end_date = $6, start_hour = $7, end_hour = $8, status = $9, id_site = $10, id_in_charge = $11
       WHERE id_event = $12`,
      [
        name,
        modality,
        links,
        desc,
        startDate,
        endDate || null,
        startHour || null,
        endHour || null,
        status || 'Activo',
        idSite,
        idResp,
        Number(id)
      ]
    );

    return this.findById(id);
  }

  async delete(id: number): Promise<boolean> {
    const res = await pool.query(
      'DELETE FROM event WHERE id_event = $1',
      [Number(id)]
    );
    return (res.rowCount ?? 0) > 0;
  }

  async findAttendeeByEventAndEmail(eventId: string, email: string): Promise<Attendee | null> {
    const cleanId = eventId.replace(/^evt-/, '');
    const found = this.inMemoryAttendees.find(
      a => (a.eventId === eventId || a.eventId === cleanId) && a.correo.toLowerCase() === email.toLowerCase()
    );
    return found || null;
  }

  async saveAttendee(attendee: Attendee): Promise<Attendee> {
    this.inMemoryAttendees.push(attendee);
    return attendee;
  }

  async updateAvailableSpots(eventId: string, spots: number): Promise<void> {
    // Extensión opcional
  }

  async getStats(): Promise<EventStats> {
    const totalRes = await pool.query('SELECT COUNT(*) as total FROM event');
    const presencialRes = await pool.query("SELECT COUNT(*) as total FROM event WHERE modality::text = 'Presencial'");
    const virtualRes = await pool.query("SELECT COUNT(*) as total FROM event WHERE modality::text = 'Virtual'");

    return {
      totalEvents: parseInt(totalRes.rows[0]?.total || '0', 10),
      presenciales: parseInt(presencialRes.rows[0]?.total || '0', 10),
      virtuales: parseInt(virtualRes.rows[0]?.total || '0', 10),
      nocturnas: 0
    };
  }
}
