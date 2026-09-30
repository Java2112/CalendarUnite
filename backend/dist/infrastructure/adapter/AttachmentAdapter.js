"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AttachmentAdapter = void 0;
// Importa el pool de conexiones a la base de datos
const database_1 = require("../config/database");
// Adaptador de infraestructura para persistencia de archivos en PostgreSQL
class AttachmentAdapter {
    // Función auxiliar privada para mapear registros de la base de datos a la entidad Attachment
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
    // Guarda la metadata de un archivo adjunto en la base de datos
    async save(attachmentData) {
        // Inserta el registro en la tabla attached_file
        const res = await database_1.pool.query(`INSERT INTO attached_file (id_user, name, type, url, size) 
       VALUES ($1, $2, $3, $4, $5) 
       RETURNING *`, [
            attachmentData.id_usuario,
            attachmentData.nombre || null,
            attachmentData.tipo || null,
            attachmentData.url || null,
            attachmentData.tamano || null
        ]);
        // Si se insertó correctamente, retorna la entidad mapeada
        if (res.rows && res.rows.length > 0) {
            return this.mapRowToAttachment(res.rows[0]);
        }
        // Retorna objeto por defecto si no hubo filas de retorno
        return {
            id_archivo: 0,
            fecha_subida: new Date(),
            ...attachmentData
        };
    }
    // Consulta los archivos subidos por un usuario
    async findByUserId(userId) {
        // Ejecuta la consulta SQL por id_user
        const res = await database_1.pool.query('SELECT * FROM attached_file WHERE id_user = $1 ORDER BY id_archive DESC', [Number(userId)]);
        // Mapea y retorna cada registro
        return res.rows.map((r) => this.mapRowToAttachment(r));
    }
    // Busca un archivo por su URL
    async findByUrl(url) {
        // Ejecuta la consulta buscando coincidencia exacta de URL
        const res = await database_1.pool.query('SELECT * FROM attached_file WHERE url = $1 LIMIT 1', [url]);
        // Si no se encuentra, retorna null
        if (!res.rows || res.rows.length === 0)
            return null;
        // Retorna la entidad mapeada
        return this.mapRowToAttachment(res.rows[0]);
    }
}
exports.AttachmentAdapter = AttachmentAdapter;
