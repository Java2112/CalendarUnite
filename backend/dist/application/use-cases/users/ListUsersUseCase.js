"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ListUsersUseCase = void 0;
// Importa las entidades y reglas del dominio de usuarios
const User_1 = require("../../../domain/User");
// Caso de uso para listar todos los usuarios del sistema
class ListUsersUseCase {
    userPort;
    // Inyecta el puerto de usuarios
    constructor(userPort) {
        this.userPort = userPort;
    }
    // Ejecuta la consulta de usuarios verificando rol de Administrador
    async execute(currentUser) {
        // Valida que el usuario actual sea Administrador
        if (!User_1.UserDomainRule.isAdmin(currentUser)) {
            const err = new Error('Acceso denegado: Esta operación es exclusiva para Administradores.');
            err.status = 403;
            throw err;
        }
        // Consulta y retorna todos los usuarios registrados
        return this.userPort.findAll();
    }
}
exports.ListUsersUseCase = ListUsersUseCase;
