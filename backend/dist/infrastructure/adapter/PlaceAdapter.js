"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PlaceAdapter = void 0;
const database_1 = require("../config/database");
class PlaceAdapter {
    constructor() {
        this.ensureInitialSites();
    }
    async ensureInitialSites() {
        try {
            const [rows] = await database_1.pool.query('SELECT COUNT(*) as count FROM site');
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
                    await database_1.pool.query('INSERT INTO site (name, address, building, classroom) VALUES (?, ?, ?, ?)', p);
                }
                console.log('[PlaceAdapter] Lugares/Sitios iniciales sembrados en MySQL con éxito.');
            }
        }
        catch (err) {
            console.warn('[PlaceAdapter] Advertencia al verificar/sembrar sitios iniciales:', err.message);
        }
    }
    mapRowToPlace(row) {
        return {
            id_lugar: row.id_site,
            nombre: row.name,
            direccion: row.address || '',
            edificio: row.building || '',
            aula: row.classroom || ''
        };
    }
    async findAll() {
        const [rows] = await database_1.pool.query('SELECT * FROM site ORDER BY id_site ASC');
        return rows.map((r) => this.mapRowToPlace(r));
    }
    async findById(id) {
        const [rows] = await database_1.pool.query('SELECT * FROM site WHERE id_site = ? LIMIT 1', [Number(id)]);
        if (!rows || rows.length === 0)
            return null;
        return this.mapRowToPlace(rows[0]);
    }
    async create(placeData) {
        const [result] = await database_1.pool.execute('INSERT INTO site (name, address, building, classroom) VALUES (?, ?, ?, ?)', [placeData.nombre, placeData.direccion || null, placeData.edificio || null, placeData.aula || null]);
        const created = await this.findById(result.insertId);
        if (!created) {
            throw new Error('Error al recuperar el sitio creado en MySQL');
        }
        return created;
    }
}
exports.PlaceAdapter = PlaceAdapter;
