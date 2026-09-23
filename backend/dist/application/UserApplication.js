"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserApplication = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jwt_util_1 = require("../infrastructure/util/jwt.util");
class UserApplication {
    userPort;
    constructor(userPort) {
        this.userPort = userPort;
    }
    async login(email, password, role) {
        let foundUser = null;
        if (role) {
            foundUser = await this.userPort.findByRole(role);
        }
        else if (email && password) {
            const user = await this.userPort.findByEmail(email.trim());
            if (user) {
                const match = await bcryptjs_1.default.compare(password, user.password_hash) || user.password_hash === password;
                if (match) {
                    foundUser = user;
                }
            }
        }
        if (!foundUser) {
            return null;
        }
        const token = (0, jwt_util_1.generateToken)({
            id_usuario: foundUser.id_usuario,
            nombre: `${foundUser.nombre} ${foundUser.apellido}`.trim(),
            correo: foundUser.correo,
            rol: foundUser.rol
        });
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
        return { token, user: userProfile };
    }
    async getProfileByToken(token) {
        const payload = (0, jwt_util_1.verifyToken)(token);
        if (!payload)
            return null;
        const user = await this.userPort.findById(payload.id_usuario);
        if (!user)
            return null;
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
