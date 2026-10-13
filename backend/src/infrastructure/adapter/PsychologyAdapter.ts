// Importa las entidades del dominio de psicología
import { PsychologyMeeting, PsychologistProfile } from '../../domain/PsychologyMeeting';
// Importa el puerto del dominio PsychologyMeetingPort
import { PsychologyMeetingPort } from '../../domain/PsychologyMeetingPort';
// Importa el adaptador de usuarios para consultar los profesionales de rol Bienestar
import { UserAdapter } from './UserAdapter';
// Importa la conexión al pool de base de datos PostgreSQL
import { pool } from '../config/database';

// Adaptador de infraestructura que gestiona la persistencia de citas de psicología en PostgreSQL y memoria
export class PsychologyAdapter implements PsychologyMeetingPort {
  // Lista inicial de respaldo para profesionales de Bienestar Universitario
  private professionals: PsychologistProfile[] = [
    {
      id: 1,
      name: 'María Elena Restrepo',
      specialty: 'Atención Psicológica y Acompañamiento Estudiantil • Bienestar Universitario',
      email: 'bienestar@unite.edu.co',
      availableSchedule: 'Lunes a Viernes: 8:00 AM - 12:00 PM y 2:00 PM - 5:00 PM',
      avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=600&q=80'
    }
  ];

  // Datos locales de respaldo en memoria con citas de ejemplo
  private inMemoryMeetings: PsychologyMeeting[] = [
    {
      id: 1,
      studentName: 'Valentina Rodríguez Gómez',
      studentEmail: 'v.rodriguez@uniempresarial.edu.co',
      studentPhone: '3157894561',
      studentProgram: 'Ingeniería de Software',
      reason: 'Manejo de ansiedad y bloqueo durante semanas de parciales',
      date: '2026-10-15',
      startHour: '09:00',
      endHour: '10:00',
      modality: 'Presencial',
      professionalName: 'María Elena Restrepo',
      linkMeeting: '',
      status: 'Confirmada',
      observations: 'Primera sesión diagnóstica agendada en Consultorio de Bienestar.',
      createdAt: '2026-10-10 14:20:00'
    },
    {
      id: 2,
      studentName: 'Carlos Eduardo Peña',
      studentEmail: 'c.pena@uniempresarial.edu.co',
      studentPhone: '3204561239',
      studentProgram: 'Administración de Empresas',
      reason: 'Orientación vocacional y equilibrio de horarios modelo dual con prácticas',
      date: '2026-10-16',
      startHour: '14:00',
      endHour: '15:00',
      modality: 'Virtual',
      professionalName: 'María Elena Restrepo',
      linkMeeting: 'https://teams.microsoft.com/l/meetup-join/uniempresarial-psicologia-sesion-2',
      status: 'Confirmada',
      observations: 'Sesión virtual por Teams para asesoría de adaptación al entorno laboral.',
      createdAt: '2026-10-11 09:15:00'
    },
    {
      id: 3,
      studentName: 'Daniela Morales Silva',
      studentEmail: 'd.morales@uniempresarial.edu.co',
      studentPhone: '3109876543',
      studentProgram: 'Finanzas y Comercio Exterior',
      reason: 'Acompañamiento emocional por duelo familiar y bajo rendimiento',
      date: '2026-10-17',
      startHour: '11:00',
      endHour: '12:00',
      modality: 'Presencial',
      professionalName: 'María Elena Restrepo',
      linkMeeting: '',
      status: 'Pendiente',
      observations: 'Solicitud recibida. Pendiente confirmar disponibilidad de consultorio.',
      createdAt: '2026-10-12 11:30:00'
    }
  ];

  // Contador autonumérico para citas creadas en memoria
  private nextId = 4;

  // Constructor que recibe el UserAdapter para consultar usuarios de la base de datos
  constructor(private userAdapter?: UserAdapter) {
    this.ensureDatabaseTable();
  }

  // Crea o asegura la tabla de citas de psicología en PostgreSQL
  private async ensureDatabaseTable(): Promise<void> {
    try {
      await pool.query(`
        CREATE TABLE IF NOT EXISTS psychologist_meeting (
          id_registration SERIAL PRIMARY KEY,
          student_name VARCHAR(150),
          student_email VARCHAR(150),
          student_phone VARCHAR(50),
          student_program VARCHAR(150),
          reason TEXT,
          date DATE NOT NULL,
          start_hour TIME,
          end_hour TIME,
          modality VARCHAR(30),
          professional_name VARCHAR(150),
          link_meeting TEXT,
          status VARCHAR(30) DEFAULT 'Pendiente',
          observations TEXT,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
      `);

      // Asegura que la columna student_program exista si la tabla ya había sido creada con student_code
      await pool.query(`
        ALTER TABLE psychologist_meeting 
        ADD COLUMN IF NOT EXISTS student_program VARCHAR(150);
      `);
    } catch {
      // Si la base de datos no está disponible, continúa en memoria
    }
  }

  // Consulta y retorna el listado de citas aplicando filtros de búsqueda, estado y fecha
  async findAll(filters?: { status?: string; date?: string; search?: string }): Promise<PsychologyMeeting[]> {
    try {
      let query = `
        SELECT 
          id_registration as id,
          student_name as "studentName",
          student_email as "studentEmail",
          student_phone as "studentPhone",
          COALESCE(student_program, '') as "studentProgram",
          reason,
          TO_CHAR(date, 'YYYY-MM-DD') as date,
          SUBSTRING(start_hour::text, 1, 5) as "startHour",
          SUBSTRING(end_hour::text, 1, 5) as "endHour",
          modality,
          professional_name as "professionalName",
          link_meeting as "linkMeeting",
          status,
          observations,
          TO_CHAR(created_at, 'YYYY-MM-DD HH24:MI:SS') as "createdAt"
        FROM psychologist_meeting
        WHERE 1=1
      `;
      const params: any[] = [];
      let pIndex = 1;

      if (filters?.status && filters.status !== 'Todas') {
        query += ` AND status = $${pIndex++}`;
        params.push(filters.status);
      }
      if (filters?.date) {
        query += ` AND date = $${pIndex++}`;
        params.push(filters.date);
      }
      if (filters?.search) {
        query += ` AND (student_name ILIKE $${pIndex} OR reason ILIKE $${pIndex} OR professional_name ILIKE $${pIndex} OR student_program ILIKE $${pIndex})`;
        params.push(`%${filters.search}%`);
        pIndex++;
      }

      query += ` ORDER BY date DESC, start_hour DESC`;

      const result = await pool.query(query, params);
      if (result.rows && result.rows.length > 0) {
        return result.rows;
      }
    } catch {
      // Fallback a los datos en memoria si la BD no responde
    }

    // Filtrado sobre los datos en memoria
    let list = [...this.inMemoryMeetings];
    if (filters?.status && filters.status !== 'Todas') {
      list = list.filter(m => m.status.toLowerCase() === filters.status!.toLowerCase());
    }
    if (filters?.date) {
      list = list.filter(m => m.date === filters.date);
    }
    if (filters?.search) {
      const q = filters.search.toLowerCase();
      list = list.filter(m =>
        m.studentName.toLowerCase().includes(q) ||
        m.reason.toLowerCase().includes(q) ||
        m.professionalName.toLowerCase().includes(q) ||
        (m.studentProgram && m.studentProgram.toLowerCase().includes(q))
      );
    }
    return list;
  }

  // Busca una cita específica por su identificador
  async findById(id: string | number): Promise<PsychologyMeeting | null> {
    try {
      const result = await pool.query(`
        SELECT 
          id_registration as id,
          student_name as "studentName",
          student_email as "studentEmail",
          student_phone as "studentPhone",
          COALESCE(student_program, '') as "studentProgram",
          reason,
          TO_CHAR(date, 'YYYY-MM-DD') as date,
          SUBSTRING(start_hour::text, 1, 5) as "startHour",
          SUBSTRING(end_hour::text, 1, 5) as "endHour",
          modality,
          professional_name as "professionalName",
          link_meeting as "linkMeeting",
          status,
          observations,
          TO_CHAR(created_at, 'YYYY-MM-DD HH24:MI:SS') as "createdAt"
        FROM psychologist_meeting
        WHERE id_registration = $1
      `, [id]);

      if (result.rows && result.rows.length > 0) {
        return result.rows[0];
      }
    } catch {
      // Fallback a memoria
    }

    const found = this.inMemoryMeetings.find(m => String(m.id) === String(id));
    return found || null;
  }

  // Crea una nueva cita de psicología
  async create(meetingData: Omit<PsychologyMeeting, 'id' | 'createdAt'>): Promise<PsychologyMeeting> {
    const defaultStatus = meetingData.status || 'Pendiente';
    const now = new Date().toISOString().replace('T', ' ').substring(0, 19);

    try {
      const result = await pool.query(`
        INSERT INTO psychologist_meeting (
          student_name, student_email, student_phone, student_program,
          reason, date, start_hour, end_hour, modality,
          professional_name, link_meeting, status, observations, created_at
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, NOW())
        RETURNING 
          id_registration as id,
          student_name as "studentName",
          student_email as "studentEmail",
          student_phone as "studentPhone",
          COALESCE(student_program, '') as "studentProgram",
          reason,
          TO_CHAR(date, 'YYYY-MM-DD') as date,
          SUBSTRING(start_hour::text, 1, 5) as "startHour",
          SUBSTRING(end_hour::text, 1, 5) as "endHour",
          modality,
          professional_name as "professionalName",
          link_meeting as "linkMeeting",
          status,
          observations,
          TO_CHAR(created_at, 'YYYY-MM-DD HH24:MI:SS') as "createdAt"
      `, [
        meetingData.studentName,
        meetingData.studentEmail,
        meetingData.studentPhone || '',
        meetingData.studentProgram || '',
        meetingData.reason,
        meetingData.date,
        meetingData.startHour || '09:00',
        meetingData.endHour || '10:00',
        meetingData.modality || 'Presencial',
        meetingData.professionalName || 'María Elena Restrepo',
        meetingData.linkMeeting || '',
        defaultStatus,
        meetingData.observations || ''
      ]);

      if (result.rows && result.rows.length > 0) {
        return result.rows[0];
      }
    } catch {
      // Fallback a memoria si la base de datos no está activa
    }

    const created: PsychologyMeeting = {
      ...meetingData,
      id: this.nextId++,
      status: defaultStatus,
      createdAt: now
    };
    this.inMemoryMeetings.unshift(created);
    return created;
  }

  // Actualiza los datos o el estado de una cita existente
  async update(id: string | number, updates: Partial<PsychologyMeeting>): Promise<PsychologyMeeting> {
    try {
      const setClauses: string[] = [];
      const values: any[] = [];
      let valIdx = 1;

      if (updates.status !== undefined) {
        setClauses.push(`status = $${valIdx++}`);
        values.push(updates.status);
      }
      if (updates.linkMeeting !== undefined) {
        setClauses.push(`link_meeting = $${valIdx++}`);
        values.push(updates.linkMeeting);
      }
      if (updates.observations !== undefined) {
        setClauses.push(`observations = $${valIdx++}`);
        values.push(updates.observations);
      }
      if (updates.professionalName !== undefined) {
        setClauses.push(`professional_name = $${valIdx++}`);
        values.push(updates.professionalName);
      }
      if (updates.date !== undefined) {
        setClauses.push(`date = $${valIdx++}`);
        values.push(updates.date);
      }
      if (updates.startHour !== undefined) {
        setClauses.push(`start_hour = $${valIdx++}`);
        values.push(updates.startHour);
      }
      if (updates.endHour !== undefined) {
        setClauses.push(`end_hour = $${valIdx++}`);
        values.push(updates.endHour);
      }
      if (updates.modality !== undefined) {
        setClauses.push(`modality = $${valIdx++}`);
        values.push(updates.modality);
      }

      if (setClauses.length > 0) {
        values.push(id);
        const query = `
          UPDATE psychologist_meeting
          SET ${setClauses.join(', ')}
          WHERE id_registration = $${valIdx}
          RETURNING 
            id_registration as id,
            student_name as "studentName",
            student_email as "studentEmail",
            student_phone as "studentPhone",
            COALESCE(student_program, '') as "studentProgram",
            reason,
            TO_CHAR(date, 'YYYY-MM-DD') as date,
            SUBSTRING(start_hour::text, 1, 5) as "startHour",
            SUBSTRING(end_hour::text, 1, 5) as "endHour",
            modality,
            professional_name as "professionalName",
            link_meeting as "linkMeeting",
            status,
            observations,
            TO_CHAR(created_at, 'YYYY-MM-DD HH24:MI:SS') as "createdAt"
        `;
        const result = await pool.query(query, values);
        if (result.rows && result.rows.length > 0) {
          return result.rows[0];
        }
      }
    } catch {
      // Fallback a memoria
    }

    const index = this.inMemoryMeetings.findIndex(m => String(m.id) === String(id));
    if (index === -1) {
      throw new Error(`Cita con ID ${id} no encontrada.`);
    }

    this.inMemoryMeetings[index] = {
      ...this.inMemoryMeetings[index],
      ...updates
    };
    return this.inMemoryMeetings[index];
  }

  // Elimina una cita de psicología por su identificador
  async delete(id: string | number): Promise<boolean> {
    try {
      const result = await pool.query('DELETE FROM psychologist_meeting WHERE id_registration = $1', [id]);
      if (result.rowCount && result.rowCount > 0) {
        return true;
      }
    } catch {
      // Fallback a memoria
    }

    const initialLen = this.inMemoryMeetings.length;
    this.inMemoryMeetings = this.inMemoryMeetings.filter(m => String(m.id) !== String(id));
    return this.inMemoryMeetings.length < initialLen;
  }

  // Obtiene los profesionales consultando los usuarios con rol 'Bienestar' en la base de datos
  async getProfessionals(): Promise<PsychologistProfile[]> {
    try {
      // Consulta en PostgreSQL todos los usuarios con rol 'Bienestar' que estén activos
      const res = await pool.query(`
        SELECT 
          id_user as id,
          name_user,
          subname,
          email,
          phone_number,
          role
        FROM "user"
        WHERE LOWER(role::text) = 'bienestar' AND (status IS TRUE OR status IS NULL)
        ORDER BY id_user ASC
      `);

      if (res.rows && res.rows.length > 0) {
        return res.rows.map((r: any) => {
          const fullName = `${r.name_user} ${r.subname}`.trim();
          return {
            id: r.id,
            name: fullName,
            specialty: 'Atención Psicológica y Acompañamiento Estudiantil • Bienestar Universitario',
            email: r.email,
            availableSchedule: 'Lunes a Viernes: 8:00 AM - 12:00 PM y 2:00 PM - 5:00 PM',
            avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=600&q=80'
          };
        });
      }
    } catch {
      // Si la base de datos no está activa, consulta a través del userAdapter en memoria
    }

    // Consulta los usuarios de rol Bienestar a través del adaptador de usuarios si fue provisto
    if (this.userAdapter) {
      try {
        const allUsers = await this.userAdapter.findAll();
        const bienestarUsers = allUsers.filter(u => (u.rol || u.role)?.toLowerCase() === 'bienestar');
        if (bienestarUsers.length > 0) {
          return bienestarUsers.map(u => ({
            id: u.id_usuario ?? u.id ?? 1,
            name: u.name || `${u.nombre} ${u.apellido}`.trim(),
            specialty: 'Atención Psicológica y Acompañamiento Estudiantil • Bienestar Universitario',
            email: u.email || u.correo,
            availableSchedule: 'Lunes a Viernes: 8:00 AM - 12:00 PM y 2:00 PM - 5:00 PM',
            avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=600&q=80'
          }));
        }
      } catch {}
    }

    // Retorna el listado por defecto con el usuario institucional sembrado
    return this.professionals;
  }
}
