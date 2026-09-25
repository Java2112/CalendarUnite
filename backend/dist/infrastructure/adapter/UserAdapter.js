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
            const [rows] = await database_1.pool.query('SELECT COUNT(*) as count FROM user');
            const count = rows[0]?.count || 0;
            if (count === 0) {
                const hash = bcryptjs_1.default.hashSync('admin123', 10);
                await database_1.pool.query(`INSERT INTO user (name_user, subname, email, password_hash, status, phone_number, role)
           VALUES (?, ?, ?, ?, ?, ?, ?)`, ['Carlos', 'Mendoza', 'admin@unite.edu.co', hash, true, '3001234567', 'Admin']);
                const bienestarHash = bcryptjs_1.default.hashSync('bienestar123', 10);
                await database_1.pool.query(`INSERT INTO user (name_user, subname, email, password_hash, status, phone_number, role)
           VALUES (?, ?, ?, ?, ?, ?, ?)`, ['María Elena', 'Restrepo', 'bienestar@unite.edu.co', bienestarHash, true, '3109876543', 'Bienestar']);
                const liderHash = bcryptjs_1.default.hashSync('lider123', 10);
                await database_1.pool.query(`INSERT INTO user (name_user, subname, email, password_hash, status, phone_number, role)
           VALUES (?, ?, ?, ?, ?, ?, ?)`, ['Juan Pablo', 'Ríos', 'lider@unite.edu.co', liderHash, true, '3205557890', 'Lider']);
                console.log('[UserAdapter] Usuarios iniciales sembrados en MySQL con éxito.');
            }
        }
        catch (err) {
            console.warn('[UserAdapter] Advertencia al verificar/sembrar usuarios iniciales:', err.message);
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
        const [rows] = await database_1.pool.query('SELECT * FROM user WHERE LOWER(email) = LOWER(?) LIMIT 1', [email]);
        if (!rows || rows.length === 0)
            return null;
        return this.mapRowToUser(rows[0]);
    }
    async findByRole(role) {
        const [rows] = await database_1.pool.query('SELECT * FROM user WHERE LOWER(role) = LOWER(?) LIMIT 1', [role]);
        if (!rows || rows.length === 0)
            return null;
        return this.mapRowToUser(rows[0]);
    }
    async findById(id) {
        const [rows] = await database_1.pool.query('SELECT * FROM user WHERE id_user = ? LIMIT 1', [Number(id)]);
        if (!rows || rows.length === 0)
            return null;
        return this.mapRowToUser(rows[0]);
    }
    async findAll() {
        const [rows] = await database_1.pool.query('SELECT * FROM user ORDER BY id_user ASC');
        return rows.map((r) => this.mapRowToUser(r));
    }
    async create(userData) {
        const [result] = await database_1.pool.execute(`INSERT INTO user (name_user, subname, email, password_hash, status, phone_number, role)
       VALUES (?, ?, ?, ?, ?, ?, ?)`, [
            userData.nombre,
            userData.apellido,
            userData.correo,
            userData.password_hash,
            userData.estado !== undefined ? userData.estado : true,
            userData.telefono || null,
            userData.rol
        ]);
        const insertedId = result.insertId;
        const createdUser = await this.findById(insertedId);
        if (!createdUser) {
            throw new Error('Error al recuperar el usuario creado en MySQL');
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
        await database_1.pool.query(`UPDATE user 
       SET name_user = ?, subname = ?, email = ?, password_hash = ?, status = ?, phone_number = ?, role = ?
       WHERE id_user = ?`, [
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
        const [result] = await database_1.pool.execute('UPDATE user SET status = ? WHERE id_user = ?', [estado, Number(id)]);
        return result.affectedRows > 0;
    }
    async delete(id) {
        const numId = Number(id);
        const target = await this.findById(numId);
        if (!target)
            return false;
        // Proteger al menos que quede 1 admin
        if (target.rol.toLowerCase() === 'admin') {
            const [admins] = await database_1.pool.query("SELECT COUNT(*) as count FROM user WHERE LOWER(role) = 'admin'");
            if ((admins[0]?.count || 0) <= 1) {
                return false;
            }
        }
        const [result] = await database_1.pool.execute('DELETE FROM user WHERE id_user = ?', [numId]);
        return result.affectedRows > 0;
    }
}
exports.UserAdapter = UserAdapter;
