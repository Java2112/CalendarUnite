"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AttachmentAdapter = void 0;
const database_1 = require("../config/database");
class AttachmentAdapter {
    mapRowToAttachment(row) {
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
    async save(attachmentData) {
        const [result] = await database_1.pool.execute('INSERT INTO attached_file (id_user, name, type, url, size) VALUES (?, ?, ?, ?, ?)', [
            attachmentData.id_usuario,
            attachmentData.nombre || null,
            attachmentData.tipo || null,
            attachmentData.url || null,
            attachmentData.tamano || null
        ]);
        const [rows] = await database_1.pool.query('SELECT * FROM attached_file WHERE id_archive = ?', [result.insertId]);
        if (rows && rows.length > 0) {
            return this.mapRowToAttachment(rows[0]);
        }
        return {
            id_archivo: result.insertId,
            fecha_subida: new Date(),
            ...attachmentData
        };
    }
    async findByUserId(userId) {
        const [rows] = await database_1.pool.query('SELECT * FROM attached_file WHERE id_user = ? ORDER BY id_archive DESC', [Number(userId)]);
        return rows.map((r) => this.mapRowToAttachment(r));
    }
    async findByUrl(url) {
        const [rows] = await database_1.pool.query('SELECT * FROM attached_file WHERE url = ? LIMIT 1', [url]);
        if (!rows || rows.length === 0)
            return null;
        return this.mapRowToAttachment(rows[0]);
    }
}
exports.AttachmentAdapter = AttachmentAdapter;
