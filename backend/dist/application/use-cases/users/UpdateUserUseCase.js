"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateUserUseCase = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const User_1 = require("../../../domain/User");
class UpdateUserUseCase {
    userPort;
    constructor(userPort) {
        this.userPort = userPort;
    }
    async execute(userId, dto, currentUser) {
        if (!User_1.UserDomainRule.isAdmin(currentUser)) {
            const err = new Error('Acceso denegado: Solo el Administrador puede editar usuarios.');
            err.status = 403;
            throw err;
        }
        const existing = await this.userPort.findById(userId);
        if (!existing) {
            const err = new Error('El usuario no existe.');
            err.status = 404;
            throw err;
        }
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
        if (dto.password && dto.password.trim() !== '') {
            updateData.password_hash = await bcryptjs_1.default.hash(dto.password.trim(), 10);
        }
        const updated = await this.userPort.update(userId, updateData);
        if (!updated) {
            throw new Error('No se pudo actualizar el usuario.');
        }
        return updated;
    }
}
exports.UpdateUserUseCase = UpdateUserUseCase;
