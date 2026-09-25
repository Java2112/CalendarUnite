import { RowDataPacket, ResultSetHeader } from 'mysql2/promise';
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
    const [result] = await pool.execute<ResultSetHeader>(
      'INSERT INTO attached_file (id_user, name, type, url, size) VALUES (?, ?, ?, ?, ?)',
      [
        attachmentData.id_usuario,
        attachmentData.nombre || null,
        attachmentData.tipo || null,
        attachmentData.url || null,
        attachmentData.tamano || null
      ]
    );

    const [rows] = await pool.query<RowDataPacket[]>(
      'SELECT * FROM attached_file WHERE id_archive = ?',
      [result.insertId]
    );

    if (rows && rows.length > 0) {
      return this.mapRowToAttachment(rows[0]);
    }

    return {
      id_archivo: result.insertId,
      fecha_subida: new Date(),
      ...attachmentData
    };
  }

  async findByUserId(userId: number): Promise<Attachment[]> {
    const [rows] = await pool.query<RowDataPacket[]>(
      'SELECT * FROM attached_file WHERE id_user = ? ORDER BY id_archive DESC',
      [Number(userId)]
    );
    return rows.map((r: any) => this.mapRowToAttachment(r));
  }

  async findByUrl(url: string): Promise<Attachment | null> {
    const [rows] = await pool.query<RowDataPacket[]>(
      'SELECT * FROM attached_file WHERE url = ? LIMIT 1',
      [url]
    );
    if (!rows || rows.length === 0) return null;
    return this.mapRowToAttachment(rows[0]);
  }
}
