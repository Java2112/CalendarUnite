"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserApplication = void 0;
// Importa bcryptjs para verificar contraseñas hasheadas
const bcryptjs_1 = __importDefault(require("bcryptjs"));
// Importa las utilidades de generación y verificación de JWT
const jwt_util_1 = require("../infrastructure/util/jwt.util");
// Servicio de aplicación para la autenticación y perfil de usuarios
class UserApplication {
    userPort;
    // Inyecta el puerto de usuarios
    constructor(userPort) {
        this.userPort = userPort;
    }
    // Autentica al usuario por credenciales o rol y genera un token JWT
    async login(email, password, role) {
        // Variable para almacenar el usuario encontrado
        let foundUser = null;
        // Si se envía rol directo (modo rápido de pruebas)
        if (role) {
            foundUser = await this.userPort.findByRole(role);
            // Si se envía correo y contraseña
        }
        else if (email && password) {
            // Busca el usuario por correo electrónico
            const user = await this.userPort.findByEmail(email.trim());
            // Si el usuario existe
            if (user) {
                // Compara la contraseña ingresada contra el hash almacenado
                const match = await bcryptjs_1.default.compare(password, user.password_hash) || user.password_hash === password;
                // Si coincide la contraseña
                if (match) {
                    foundUser = user;
                }
            }
        }
        // Si no se encontró un usuario válido con las credenciales, retorna null
        if (!foundUser) {
            return null;
        }
        // Genera el token JWT firmado con los datos del usuario
        const token = (0, jwt_util_1.generateToken)({
            id_usuario: foundUser.id_usuario,
            nombre: `${foundUser.nombre} ${foundUser.apellido}`.trim(),
            correo: foundUser.correo,
            rol: foundUser.rol
        });
        // Mapea el perfil del usuario sin exponer la contraseña
        const userProfile = {
            id_usuario: foundUser.id_usuario,
            id: String(foundUser.id_usuario),
            nombre: foundUser.nombre,
            apellido: foundUser.apellido,
            name: `${foundUser.nombre} ${foundUser.apellido}`.trim(),
            correo: foundUser.correo,
            email: foundUser.correo,
            rol: foundUser.rol,
            role: foundUser.rol,
            estado: foundUser.estado,
            telefono: foundUser.telefono,
            department: foundUser.department,
            avatar: foundUser.avatar
        };
        // Retorna el token y los datos del perfil
        return { token, user: userProfile };
    }
    // Obtiene el perfil de un usuario a partir de su token JWT
    async getProfileByToken(token) {
        // Decodifica y valida el token
        const payload = (0, jwt_util_1.verifyToken)(token);
        // Si el token es inválido, retorna null
        if (!payload)
            return null;
        // Busca al usuario en la base de datos por el ID del token
        const user = await this.userPort.findById(payload.id_usuario);
        // Si el usuario ya no existe, retorna null
        if (!user)
            return null;
        // Retorna el perfil seguro del usuario
        return {
            id_usuario: user.id_usuario,
            id: String(user.id_usuario),
            nombre: user.nombre,
            apellido: user.apellido,
            name: `${user.nombre} ${user.apellido}`.trim(),
            correo: user.correo,
            email: user.correo,
            rol: user.rol,
            role: user.rol,
            estado: user.estado,
            telefono: user.telefono,
            department: user.department,
            avatar: user.avatar
        };
    }
}
exports.UserApplication = UserApplication;
