"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateUserUseCase = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const User_1 = require("../../../domain/User");
class CreateUserUseCase {
    userPort;
    constructor(userPort) {
        this.userPort = userPort;
    }
    async execute(dto, currentUser) {
        if (!User_1.UserDomainRule.isAdmin(currentUser)) {
            const err = new Error('Acceso denegado: Solo el Administrador puede registrar nuevos usuarios.');
            err.status = 403;
            throw err;
        }
        if (!dto.nombre || !dto.apellido || !dto.correo) {
            throw new Error('Nombre, apellido y correo son campos obligatorios.');
        }
        const cleanEmail = dto.correo.trim().toLowerCase();
        const existing = await this.userPort.findByEmail(cleanEmail);
        if (existing) {
            const err = new Error('Ya existe un usuario registrado con este correo electrónico.');
            err.status = 400;
            throw err;
        }
        const rawPassword = dto.password || 'Unite2026*';
        const passwordHash = await bcryptjs_1.default.hash(rawPassword, 10);
        const newUser = {
            nombre: dto.nombre.trim(),
            apellido: dto.apellido.trim(),
            correo: cleanEmail,
            password_hash: passwordHash,
            rol: dto.rol || 'Lider',
            telefono: dto.telefono ? dto.telefono.trim() : null,
            estado: dto.estado !== undefined ? dto.estado : true
        };
        return this.userPort.create(newUser);
    }
}
exports.CreateUserUseCase = CreateUserUseCase;
