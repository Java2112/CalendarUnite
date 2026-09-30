"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ToggleUserStatusUseCase = void 0;
// Importa los roles y reglas de negocio del dominio de usuarios
const User_1 = require("../../../domain/User");
// Caso de uso para activar o desactivar un usuario
class ToggleUserStatusUseCase {
    userPort;
    // Inyecta el puerto de usuarios
    constructor(userPort) {
        this.userPort = userPort;
    }
    // Ejecuta el cambio de estado verificando rol de Administrador
    async execute(userId, estado, currentUser) {
        // Comprueba que el usuario que ejecuta la acción sea Administrador
        if (!User_1.UserDomainRule.isAdmin(currentUser)) {
            const err = new Error('Acceso denegado: Solo el Administrador puede activar o desactivar usuarios.');
            err.status = 403;
            throw err;
        }
        // Busca si el usuario existe en la base de datos
        const existing = await this.userPort.findById(userId);
        // Si no existe, lanza error 404
        if (!existing) {
            const err = new Error('El usuario no existe.');
            err.status = 404;
            throw err;
        }
        // Actualiza el estado booleano del usuario a través del puerto
        return this.userPort.updateStatus(userId, estado);
    }
}
exports.ToggleUserStatusUseCase = ToggleUserStatusUseCase;
