"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserAdapter = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const database_1 = require("../config/database");
class UserAdapter {
    constructor() {
        this.ensureInitialAdmin();
    }
    /**
     * Asegura que exista al menos un usuario administrador por defecto para iniciar sesión
     */
    async ensureInitialAdmin() {
        try {
            const res = await database_1.pool.query('SELECT COUNT(*) as count FROM "user"');
            const count = parseInt(res.rows[0]?.count || '0', 10);
            if (count === 0) {
                const hash = bcryptjs_1.default.hashSync('admin123', 10);
                await database_1.pool.query(`INSERT INTO "user" (name_user, subname, email, password_hash, status, phone_number, role)
           VALUES ($1, $2, $3, $4, $5, $6, $7)`, ['Carlos', 'Mendoza', 'admin@unite.edu.co', hash, true, '3001234567', 'Admin']);
                const bienestarHash = bcryptjs_1.default.hashSync('bienestar123', 10);
                await database_1.pool.query(`INSERT INTO "user" (name_user, subname, email, password_hash, status, phone_number, role)
           VALUES ($1, $2, $3, $4, $5, $6, $7)`, ['María Elena', 'Restrepo', 'bienestar@unite.edu.co', bienestarHash, true, '3109876543', 'Bienestar']);
                const liderHash = bcryptjs_1.default.hashSync('lider123', 10);
                await database_1.pool.query(`INSERT INTO "user" (name_user, subname, email, password_hash, status, phone_number, role)
           VALUES ($1, $2, $3, $4, $5, $6, $7)`, ['Juan Pablo', 'Ríos', 'lider@unite.edu.co', liderHash, true, '3205557890', 'Lider']);
                console.log('[UserAdapter] Usuarios iniciales sembrados en PostgreSQL con éxito.');
            }
        }
        catch (err) {
            console.warn('[UserAdapter] Advertencia al verificar/sembrar usuarios en Postgres:', err.message);
        }
    }
    mapRowToUser(row) {
        const fullName = `${row.name_user} ${row.subname}`.trim();
        return {
            id_usuario: row.id_user,
            id: String(row.id_user),
            nombre: row.name_user,
            apellido: row.subname,
            correo: row.email,
            password_hash: row.password_hash,
            estado: Boolean(row.status),
            telefono: row.phone_number || '',
            rol: row.role,
            name: fullName,
            email: row.email,
            role: row.role,
            department: row.role === 'Admin'
                ? 'Administración General'
                : row.role === 'Bienestar'
                    ? 'Bienestar Universitario'
                    : 'Líder Estudiantil Interfacultades'
        };
    }
    async findByEmail(email) {
        const res = await database_1.pool.query('SELECT * FROM "user" WHERE LOWER(email) = LOWER($1) LIMIT 1', [email]);
        if (!res.rows || res.rows.length === 0)
            return null;
        return this.mapRowToUser(res.rows[0]);
    }
    async findByRole(role) {
        const res = await database_1.pool.query('SELECT * FROM "user" WHERE LOWER(role::text) = LOWER($1) LIMIT 1', [role]);
        if (!res.rows || res.rows.length === 0)
            return null;
        return this.mapRowToUser(res.rows[0]);
    }
    async findById(id) {
        const res = await database_1.pool.query('SELECT * FROM "user" WHERE id_user = $1 LIMIT 1', [Number(id)]);
        if (!res.rows || res.rows.length === 0)
            return null;
        return this.mapRowToUser(res.rows[0]);
    }
    async findAll() {
        const res = await database_1.pool.query('SELECT * FROM "user" ORDER BY id_user ASC');
        return res.rows.map((r) => this.mapRowToUser(r));
    }
    async create(userData) {
        const res = await database_1.pool.query(`INSERT INTO "user" (name_user, subname, email, password_hash, status, phone_number, role)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       RETURNING id_user`, [
            userData.nombre,
            userData.apellido,
            userData.correo,
            userData.password_hash,
            userData.estado !== undefined ? userData.estado : true,
            userData.telefono || null,
            userData.rol
        ]);
        const insertedId = res.rows[0].id_user;
        const createdUser = await this.findById(insertedId);
        if (!createdUser) {
            throw new Error('Error al recuperar el usuario creado en PostgreSQL');
        }
        return createdUser;
    }
    async update(id, data) {
        const currentUser = await this.findById(id);
        if (!currentUser)
            return null;
        const updatedNombre = data.nombre !== undefined ? data.nombre : currentUser.nombre;
        const updatedApellido = data.apellido !== undefined ? data.apellido : currentUser.apellido;
        const updatedCorreo = data.correo !== undefined ? data.correo : currentUser.correo;
        const updatedPassword = data.password_hash !== undefined ? data.password_hash : currentUser.password_hash;
        const updatedStatus = data.estado !== undefined ? data.estado : currentUser.estado;
        const updatedTelefono = data.telefono !== undefined ? data.telefono : (currentUser.telefono || null);
        const updatedRol = data.rol !== undefined ? data.rol : currentUser.rol;
        await database_1.pool.query(`UPDATE "user" 
       SET name_user = $1, subname = $2, email = $3, password_hash = $4, status = $5, phone_number = $6, role = $7
       WHERE id_user = $8`, [
            updatedNombre,
            updatedApellido,
            updatedCorreo,
            updatedPassword,
            updatedStatus,
            updatedTelefono,
            updatedRol,
            Number(id)
        ]);
        return this.findById(id);
    }
    async updateStatus(id, estado) {
        const res = await database_1.pool.query('UPDATE "user" SET status = $1 WHERE id_user = $2', [estado, Number(id)]);
        return (res.rowCount ?? 0) > 0;
    }
    async delete(id) {
        const numId = Number(id);
        const target = await this.findById(numId);
        if (!target)
            return false;
        // Proteger al menos que quede 1 admin
        if (target.rol.toLowerCase() === 'admin') {
            const res = await database_1.pool.query("SELECT COUNT(*) as count FROM \"user\" WHERE LOWER(role::text) = 'admin'");
            const adminCount = parseInt(res.rows[0]?.count || '0', 10);
            if (adminCount <= 1) {
                return false;
            }
        }
        const res = await database_1.pool.query('DELETE FROM "user" WHERE id_user = $1', [numId]);
        return (res.rowCount ?? 0) > 0;
    }
}
exports.UserAdapter = UserAdapter;
