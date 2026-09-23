"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserController = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jwt_util_1 = require("../util/jwt.util");
class UserController {
    userPort;
    listUsersUseCase;
    createUserUseCase;
    updateUserUseCase;
    toggleUserStatusUseCase;
    constructor(userPort, listUsersUseCase, createUserUseCase, updateUserUseCase, toggleUserStatusUseCase) {
        this.userPort = userPort;
        this.listUsersUseCase = listUsersUseCase;
        this.createUserUseCase = createUserUseCase;
        this.updateUserUseCase = updateUserUseCase;
        this.toggleUserStatusUseCase = toggleUserStatusUseCase;
    }
    login = async (req, res) => {
        try {
            const { email, password, role } = req.body;
            let user = null;
            if (role) {
                user = await this.userPort.findByRole(role);
            }
            else if (email && password) {
                const found = await this.userPort.findByEmail(email.trim());
                if (found) {
                    const isValid = await bcryptjs_1.default.compare(password, found.password_hash) || password === found.password_hash;
                    if (isValid) {
                        user = found;
                    }
                }
            }
            if (!user) {
                return res.status(401).json({
                    error: 'Credenciales inválidas. Por favor verifica el correo y contraseña.'
                });
            }
            if (!user.estado) {
                return res.status(403).json({
                    error: 'Tu cuenta se encuentra inactiva. Contacta al Administrador de Bienestar Universitario.'
                });
            }
            const token = (0, jwt_util_1.generateToken)({
                id_usuario: user.id_usuario,
                nombre: `${user.nombre} ${user.apellido}`.trim(),
                correo: user.correo,
                rol: user.rol
            });
            const userProfile = {
                id: String(user.id_usuario),
                id_usuario: user.id_usuario,
                name: `${user.nombre} ${user.apellido}`.trim(),
                nombre: user.nombre,
                apellido: user.apellido,
                email: user.correo,
                correo: user.correo,
                role: user.rol,
                rol: user.rol,
                estado: user.estado,
                telefono: user.telefono,
                department: user.department || (user.rol === 'Admin' ? 'Administración' : user.rol === 'Bienestar' ? 'Bienestar Universitario' : 'Liderazgo Estudiantil'),
                avatar: user.avatar
            };
            return res.json({
                message: `Inicio de sesión exitoso como ${user.rol}`,
                token,
                user: userProfile
            });
        }
        catch (error) {
            return res.status(500).json({ error: error.message || 'Error interno del servidor' });
        }
    };
    getMe = async (req, res) => {
        try {
            if (!req.user) {
                return res.status(401).json({ error: 'No autenticado' });
            }
            const user = await this.userPort.findById(req.user.id_usuario);
            if (!user) {
                return res.status(404).json({ error: 'Usuario no encontrado' });
            }
            const userProfile = {
                id: String(user.id_usuario),
                id_usuario: user.id_usuario,
                name: `${user.nombre} ${user.apellido}`.trim(),
                nombre: user.nombre,
                apellido: user.apellido,
                email: user.correo,
                correo: user.correo,
                role: user.rol,
                rol: user.rol,
                estado: user.estado,
                telefono: user.telefono,
                department: user.department,
                avatar: user.avatar
            };
            return res.json({ user: userProfile });
        }
        catch (error) {
            return res.status(500).json({ error: error.message || 'Error interno del servidor' });
        }
    };
    listUsers = async (req, res) => {
        try {
            if (!req.user) {
                return res.status(401).json({ error: 'No autenticado' });
            }
            const users = await this.listUsersUseCase.execute(req.user);
            const sanitized = users.map(u => ({
                id_usuario: u.id_usuario,
                id: String(u.id_usuario),
                nombre: u.nombre,
                apellido: u.apellido,
                name: `${u.nombre} ${u.apellido}`.trim(),
                correo: u.correo,
                email: u.correo,
                rol: u.rol,
                role: u.rol,
                estado: u.estado,
                telefono: u.telefono,
                department: u.department,
                avatar: u.avatar
            }));
            return res.json(sanitized);
        }
        catch (error) {
            const status = error.status || 500;
            return res.status(status).json({ error: error.message || 'Error al listar usuarios' });
        }
    };
    createUser = async (req, res) => {
        try {
            if (!req.user) {
                return res.status(401).json({ error: 'No autenticado' });
            }
            const created = await this.createUserUseCase.execute(req.body, req.user);
            return res.status(201).json({
                message: 'Usuario creado exitosamente.',
                user: {
                    id_usuario: created.id_usuario,
                    nombre: created.nombre,
                    apellido: created.apellido,
                    correo: created.correo,
                    rol: created.rol,
                    estado: created.estado,
                    telefono: created.telefono
                }
            });
        }
        catch (error) {
            const status = error.status || 400;
            return res.status(status).json({ error: error.message || 'Error al crear usuario' });
        }
    };
    updateUser = async (req, res) => {
        try {
            if (!req.user) {
                return res.status(401).json({ error: 'No autenticado' });
            }
            const { id } = req.params;
            const updated = await this.updateUserUseCase.execute(Number(id), req.body, req.user);
            return res.json({
                message: 'Usuario actualizado exitosamente.',
                user: {
                    id_usuario: updated.id_usuario,
                    nombre: updated.nombre,
                    apellido: updated.apellido,
                    correo: updated.correo,
                    rol: updated.rol,
                    estado: updated.estado,
                    telefono: updated.telefono
                }
            });
        }
        catch (error) {
            const status = error.status || 400;
            return res.status(status).json({ error: error.message || 'Error al actualizar usuario' });
        }
    };
    toggleStatus = async (req, res) => {
        try {
            if (!req.user) {
                return res.status(401).json({ error: 'No autenticado' });
            }
            const { id } = req.params;
            const { estado } = req.body;
            const success = await this.toggleUserStatusUseCase.execute(Number(id), Boolean(estado), req.user);
            return res.json({
                message: `Estado del usuario ${estado ? 'activado' : 'desactivado'} con éxito.`,
                success
            });
        }
        catch (error) {
            const status = error.status || 400;
            return res.status(status).json({ error: error.message || 'Error al cambiar estado del usuario' });
        }
    };
    deleteUser = async (req, res) => {
        try {
            if (!req.user) {
                return res.status(401).json({ error: 'No autenticado' });
            }
            if (req.user.rol.toLowerCase() !== 'admin') {
                return res.status(403).json({ error: 'Solo los administradores pueden eliminar usuarios.' });
            }
            const { id } = req.params;
            const targetId = Number(id);
            if (targetId === req.user.id_usuario) {
                return res.status(400).json({ error: 'No puedes eliminar tu propia cuenta de administrador en sesión.' });
            }
            const deleted = await this.userPort.delete(targetId);
            if (!deleted) {
                return res.status(400).json({ error: 'No es posible eliminar este usuario (cuenta administrativa protegida o no encontrada).' });
            }
            return res.json({ message: 'Usuario eliminado satisfactoriamente.' });
        }
        catch (error) {
            return res.status(500).json({ error: error.message || 'Error al eliminar usuario' });
        }
    };
}
exports.UserController = UserController;
