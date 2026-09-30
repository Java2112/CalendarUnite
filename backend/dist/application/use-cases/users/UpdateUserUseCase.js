"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateUserUseCase = void 0;
// Importa bcryptjs para hashear la nueva contraseña si se provee
const bcryptjs_1 = __importDefault(require("bcryptjs"));
// Importa los tipos y reglas de negocio del dominio de usuarios
const User_1 = require("../../../domain/User");
// Caso de uso para editar la información de un usuario
class UpdateUserUseCase {
    userPort;
    // Inyecta el puerto de usuarios
    constructor(userPort) {
        this.userPort = userPort;
    }
    // Ejecuta la actualización verificando rol de Administrador
    async execute(userId, dto, currentUser) {
        // Valida que el usuario que ejecuta la acción sea Administrador
        if (!User_1.UserDomainRule.isAdmin(currentUser)) {
            const err = new Error('Acceso denegado: Solo el Administrador puede editar usuarios.');
            err.status = 403;
            throw err;
        }
        // Consulta si el usuario existe
        const existing = await this.userPort.findById(userId);
        // Si no existe, lanza error 404
        if (!existing) {
            const err = new Error('El usuario no existe.');
            err.status = 404;
            throw err;
        }
        // Construye el payload de actualización con los campos enviados
        const updateData = {};
        if (dto.nombre !== undefined)
            updateData.nombre = dto.nombre.trim();
        if (dto.apellido !== undefined)
            updateData.apellido = dto.apellido.trim();
        if (dto.correo !== undefined)
            updateData.correo = dto.correo.trim().toLowerCase();
        if (dto.rol !== undefined)
            updateData.rol = dto.rol;
        if (dto.telefono !== undefined)
            updateData.telefono = dto.telefono.trim();
        if (dto.estado !== undefined)
            updateData.estado = dto.estado;
        // Si se envió una nueva contraseña, genera su hash
        if (dto.password && dto.password.trim() !== '') {
            updateData.password_hash = await bcryptjs_1.default.hash(dto.password.trim(), 10);
        }
        // Actualiza el usuario en la base de datos
        const updated = await this.userPort.update(userId, updateData);
        // Si la actualización falla, lanza excepción
        if (!updated) {
            throw new Error('No se pudo actualizar el usuario.');
        }
        // Retorna el usuario actualizado
        return updated;
    }
}
exports.UpdateUserUseCase = UpdateUserUseCase;
