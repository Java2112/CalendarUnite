"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateUserUseCase = void 0;
// Importa bcryptjs para generar el hash seguro de la contraseña
const bcryptjs_1 = __importDefault(require("bcryptjs"));
// Importa las entidades y reglas del dominio de usuarios
const User_1 = require("../../../domain/User");
// Caso de uso para crear un nuevo usuario con verificación de rol administrador
class CreateUserUseCase {
    userPort;
    // Inyecta el puerto de persistencia de usuarios
    constructor(userPort) {
        this.userPort = userPort;
    }
    // Ejecuta la creación del usuario validando permisos y unicidad de correo
    async execute(dto, currentUser) {
        // Valida que el usuario que ejecuta la acción sea Administrador
        if (!User_1.UserDomainRule.isAdmin(currentUser)) {
            const err = new Error('Acceso denegado: Solo el Administrador puede registrar nuevos usuarios.');
            err.status = 403;
            throw err;
        }
        // Valida presencia de campos obligatorios
        if (!dto.nombre || !dto.apellido || !dto.correo) {
            throw new Error('Nombre, apellido y correo son campos obligatorios.');
        }
        // Normaliza el correo electrónico
        const cleanEmail = dto.correo.trim().toLowerCase();
        // Comprueba si el correo ya está en uso
        const existing = await this.userPort.findByEmail(cleanEmail);
        // Si ya existe, lanza error 400
        if (existing) {
            const err = new Error('Ya existe un usuario registrado con este correo electrónico.');
            err.status = 400;
            throw err;
        }
        // Establece la contraseña por defecto o la enviada
        const rawPassword = dto.password || 'Unite2026*';
        // Genera el hash seguro con 10 rondas de salteo
        const passwordHash = await bcryptjs_1.default.hash(rawPassword, 10);
        // Estructura el objeto de usuario para persistir
        const newUser = {
            nombre: dto.nombre.trim(),
            apellido: dto.apellido.trim(),
            correo: cleanEmail,
            password_hash: passwordHash,
            rol: dto.rol || 'Lider',
            telefono: dto.telefono ? dto.telefono.trim() : null,
            estado: dto.estado !== undefined ? dto.estado : true
        };
        // Guarda el nuevo usuario en la base de datos y lo retorna
        return this.userPort.create(newUser);
    }
}
exports.CreateUserUseCase = CreateUserUseCase;
