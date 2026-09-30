"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserController = void 0;
// Importa bcryptjs para verificar contraseñas
const bcryptjs_1 = __importDefault(require("bcryptjs"));
// Importa la utilidad para firmar tokens JWT
const jwt_util_1 = require("../util/jwt.util");
// Controlador HTTP para gestionar la autenticación y administración de usuarios
class UserController {
    userPort;
    listUsersUseCase;
    createUserUseCase;
    updateUserUseCase;
    toggleUserStatusUseCase;
    // Inyecta el puerto y casos de uso de usuarios
    constructor(userPort, listUsersUseCase, createUserUseCase, updateUserUseCase, toggleUserStatusUseCase) {
        this.userPort = userPort;
        this.listUsersUseCase = listUsersUseCase;
        this.createUserUseCase = createUserUseCase;
        this.updateUserUseCase = updateUserUseCase;
        this.toggleUserStatusUseCase = toggleUserStatusUseCase;
    }
    // Manejador POST para autenticar un usuario y generar su token JWT
    login = async (req, res) => {
        // Inicia bloque try-catch
        try {
            // Extrae email, password y rol opcional del cuerpo
            const { email, password, role } = req.body;
            // Variable para almacenar el usuario autenticado
            let user = null;
            // Si se envía rol directo (para acceso rápido)
            if (role) {
                user = await this.userPort.findByRole(role);
                // Si se envía correo y contraseña
            }
            else if (email && password) {
                // Busca al usuario por su correo
                const found = await this.userPort.findByEmail(email.trim());
                // Si el usuario existe
                if (found) {
                    // Compara la contraseña con el hash
                    const isValid = await bcryptjs_1.default.compare(password, found.password_hash) || password === found.password_hash;
                    // Si es correcta, asigna el usuario
                    if (isValid) {
                        user = found;
                    }
                }
            }
            // Si no se encontró o la contraseña falló, retorna 401
            if (!user) {
                return res.status(401).json({
                    error: 'Credenciales inválidas. Por favor verifica el correo y contraseña.'
                });
            }
            // Si la cuenta está inactiva, retorna 403
            if (!user.estado) {
                return res.status(403).json({
                    error: 'Tu cuenta se encuentra inactiva. Contacta al Administrador de Bienestar Universitario.'
                });
            }
            // Genera el token JWT
            const token = (0, jwt_util_1.generateToken)({
                id_usuario: user.id_usuario,
                nombre: `${user.nombre} ${user.apellido}`.trim(),
                correo: user.correo,
                rol: user.rol
            });
            // Mapea el perfil del usuario para respuesta
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
            // Retorna respuesta 200 con token y perfil
            return res.json({
                message: `Inicio de sesión exitoso como ${user.rol}`,
                token,
                user: userProfile
            });
        }
        catch (error) {
            // Retorna error 500 en caso de falla
            return res.status(500).json({ error: error.message || 'Error interno del servidor' });
        }
    };
    // Manejador GET para obtener el perfil del usuario en sesión
    getMe = async (req, res) => {
        // Inicia bloque try-catch
        try {
            // Valida autenticación
            if (!req.user) {
                return res.status(401).json({ error: 'No autenticado' });
            }
            // Busca el usuario en la BD por su ID en el token
            const user = await this.userPort.findById(req.user.id_usuario);
            // Si ya no existe, retorna 404
            if (!user) {
                return res.status(404).json({ error: 'Usuario no encontrado' });
            }
            // Construye el perfil de usuario seguro
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
            // Retorna el perfil en JSON
            return res.json({ user: userProfile });
        }
        catch (error) {
            // Retorna error 500
            return res.status(500).json({ error: error.message || 'Error interno del servidor' });
        }
    };
    // Manejador GET para listar todos los usuarios (solo administradores)
    listUsers = async (req, res) => {
        // Inicia bloque try-catch
        try {
            // Valida autenticación
            if (!req.user) {
                return res.status(401).json({ error: 'No autenticado' });
            }
            // Ejecuta el caso de uso de listado
            const users = await this.listUsersUseCase.execute(req.user);
            // Sanitiza y formatea la lista de usuarios
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
            // Retorna la lista en JSON
            return res.json(sanitized);
        }
        catch (error) {
            // Obtiene el status o 500
            const status = error.status || 500;
            // Retorna error
            return res.status(status).json({ error: error.message || 'Error al listar usuarios' });
        }
    };
    // Manejador POST para registrar un nuevo usuario en el sistema
    createUser = async (req, res) => {
        // Inicia bloque try-catch
        try {
            // Valida autenticación
            if (!req.user) {
                return res.status(401).json({ error: 'No autenticado' });
            }
            // Ejecuta caso de uso de creación
            const created = await this.createUserUseCase.execute(req.body, req.user);
            // Retorna respuesta 201 Created con el usuario nuevo
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
            // Obtiene status de error o 400
            const status = error.status || 400;
            // Retorna respuesta de error
            return res.status(status).json({ error: error.message || 'Error al crear usuario' });
        }
    };
    // Manejador PUT para actualizar la información de un usuario
    updateUser = async (req, res) => {
        // Inicia bloque try-catch
        try {
            // Valida autenticación
            if (!req.user) {
                return res.status(401).json({ error: 'No autenticado' });
            }
            // Extrae el ID de la URL
            const { id } = req.params;
            // Ejecuta caso de uso de actualización
            const updated = await this.updateUserUseCase.execute(Number(id), req.body, req.user);
            // Retorna respuesta con los datos actualizados
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
            // Obtiene status de error
            const status = error.status || 400;
            // Retorna error
            return res.status(status).json({ error: error.message || 'Error al actualizar usuario' });
        }
    };
    // Manejador PATCH para activar o desactivar la cuenta de un usuario
    toggleStatus = async (req, res) => {
        // Inicia bloque try-catch
        try {
            // Valida autenticación
            if (!req.user) {
                return res.status(401).json({ error: 'No autenticado' });
            }
            // Extrae ID y nuevo estado
            const { id } = req.params;
            const { estado } = req.body;
            // Ejecuta caso de uso para cambiar estado
            const success = await this.toggleUserStatusUseCase.execute(Number(id), Boolean(estado), req.user);
            // Retorna confirmación
            return res.json({
                message: `Estado del usuario ${estado ? 'activado' : 'desactivado'} con éxito.`,
                success
            });
        }
        catch (error) {
            // Obtiene status de error
            const status = error.status || 400;
            // Retorna error
            return res.status(status).json({ error: error.message || 'Error al cambiar estado del usuario' });
        }
    };
    // Manejador DELETE para remover permanentemente a un usuario
    deleteUser = async (req, res) => {
        // Inicia bloque try-catch
        try {
            // Valida autenticación
            if (!req.user) {
                return res.status(401).json({ error: 'No autenticado' });
            }
            // Valida que el rol sea Admin
            if (req.user.rol.toLowerCase() !== 'admin') {
                return res.status(403).json({ error: 'Solo los administradores pueden eliminar usuarios.' });
            }
            // Extrae y convierte el ID
            const { id } = req.params;
            const targetId = Number(id);
            // Impide que el administrador borre su propia cuenta en sesión
            if (targetId === req.user.id_usuario) {
                return res.status(400).json({ error: 'No puedes eliminar tu propia cuenta de administrador en sesión.' });
            }
            // Ejecuta la eliminación en el puerto
            const deleted = await this.userPort.delete(targetId);
            // Si no se pudo eliminar retorna 400
            if (!deleted) {
                return res.status(400).json({ error: 'No es posible eliminar este usuario (cuenta administrativa protegida o no encontrada).' });
            }
            // Retorna mensaje de éxito
            return res.json({ message: 'Usuario eliminado satisfactoriamente.' });
        }
        catch (error) {
            // Retorna error 500
            return res.status(500).json({ error: error.message || 'Error al eliminar usuario' });
        }
    };
}
exports.UserController = UserController;
