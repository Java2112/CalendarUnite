import { AttachmentPort } from '../../domain/AttachmentPort';
import { Attachment } from '../../domain/Attachment';
import { pool } from '../config/database';

export class AttachmentAdapter implements AttachmentPort {
  private mapRowToAttachment(row: any): Attachment {
    return {
      id_archivo: row.id_archive,
      id_usuario: row.id_user,
      nombre: row.name || '',
      tipo: row.type || '',
      url: row.url || '',
      tamano: row.size || 0,
      fecha_subida: row.update_date ? new Date(row.update_date) : new Date()
    };
  }

  async save(attachmentData: Omit<Attachment, 'id_archivo'>): Promise<Attachment> {
    const res = await pool.query(
      `INSERT INTO attached_file (id_user, name, type, url, size) 
       VALUES ($1, $2, $3, $4, $5) 
       RETURNING *`,
      [
        attachmentData.id_usuario,
        attachmentData.nombre || null,
        attachmentData.tipo || null,
        attachmentData.url || null,
        attachmentData.tamano || null
      ]
    );

    if (res.rows && res.rows.length > 0) {
      return this.mapRowToAttachment(res.rows[0]);
    }

    return {
      id_archivo: 0,
      fecha_subida: new Date(),
      ...attachmentData
    };
  }

  async findByUserId(userId: number): Promise<Attachment[]> {
    const res = await pool.query(
      'SELECT * FROM attached_file WHERE id_user = $1 ORDER BY id_archive DESC',
      [Number(userId)]
    );
    return res.rows.map((r: any) => this.mapRowToAttachment(r));
  }

  async findByUrl(url: string): Promise<Attachment | null> {
    const res = await pool.query(
      'SELECT * FROM attached_file WHERE url = $1 LIMIT 1',
      [url]
    );
    if (!res.rows || res.rows.length === 0) return null;
    return this.mapRowToAttachment(res.rows[0]);
  }
}
