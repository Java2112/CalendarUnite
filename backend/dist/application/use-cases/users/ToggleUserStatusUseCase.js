"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ToggleUserStatusUseCase = void 0;
const User_1 = require("../../../domain/User");
class ToggleUserStatusUseCase {
    userPort;
    constructor(userPort) {
        this.userPort = userPort;
    }
    async execute(userId, estado, currentUser) {
        if (!User_1.UserDomainRule.isAdmin(currentUser)) {
            const err = new Error('Acceso denegado: Solo el Administrador puede activar o desactivar usuarios.');
            err.status = 403;
            throw err;
        }
        const existing = await this.userPort.findById(userId);
        if (!existing) {
            const err = new Error('El usuario no existe.');
            err.status = 404;
            throw err;
        }
        return this.userPort.updateStatus(userId, estado);
    }
}
exports.ToggleUserStatusUseCase = ToggleUserStatusUseCase;
