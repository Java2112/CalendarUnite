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
            const res = await database_1.pool.query('SELECT COUNT(*) as count FROM site');
            const count = parseInt(res.rows[0]?.count || '0', 10);
            if (count === 0) {
                const initialPlaces = [
                    ['Auditorio Principal', 'Campus Principal Cra 15 # 45-20', 'Edificio A - Fundadores', 'Auditorio 1'],
                    ['Salón de Cultura y Expresión Artística', 'Campus Principal Cra 15 # 45-20', 'Casa U Bienestar', 'Salón 201'],
                    ['Canchas Sintéticas Múltiples', 'Campus Norte - Sector Deportivo', 'Complejo Deportivo', 'Cancha Principal'],
                    ['Taller de Artes B-204', 'Campus Principal Cra 15 # 45-20', 'Edificio B - Artes Integradas', 'Taller 204'],
                    ['Espacio Virtual Institucional', 'Plataforma Digital', 'Campus Virtual', 'Sala Digital']
                ];
                for (const p of initialPlaces) {
                    await database_1.pool.query('INSERT INTO site (name, address, building, classroom) VALUES ($1, $2, $3, $4)', p);
                }
                console.log('[PlaceAdapter] Lugares/Sitios iniciales sembrados en PostgreSQL con éxito.');
            }
        }
        catch (err) {
            console.warn('[PlaceAdapter] Advertencia al verificar/sembrar sitios en PostgreSQL:', err.message);
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
        const res = await database_1.pool.query('SELECT * FROM site ORDER BY id_site ASC');
        return res.rows.map((r) => this.mapRowToPlace(r));
    }
    async findById(id) {
        const res = await database_1.pool.query('SELECT * FROM site WHERE id_site = $1 LIMIT 1', [Number(id)]);
        if (!res.rows || res.rows.length === 0)
            return null;
        return this.mapRowToPlace(res.rows[0]);
    }
    async create(placeData) {
        const res = await database_1.pool.query('INSERT INTO site (name, address, building, classroom) VALUES ($1, $2, $3, $4) RETURNING id_site', [placeData.nombre, placeData.direccion || null, placeData.edificio || null, placeData.aula || null]);
        const created = await this.findById(res.rows[0].id_site);
        if (!created) {
            throw new Error('Error al recuperar el sitio creado en PostgreSQL');
        }
        return created;
    }
}
exports.PlaceAdapter = PlaceAdapter;
