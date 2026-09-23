"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ListUsersUseCase = void 0;
const User_1 = require("../../../domain/User");
class ListUsersUseCase {
    userPort;
    constructor(userPort) {
        this.userPort = userPort;
    }
    async execute(currentUser) {
        if (!User_1.UserDomainRule.isAdmin(currentUser)) {
            const err = new Error('Acceso denegado: Esta operación es exclusiva para Administradores.');
            err.status = 403;
            throw err;
        }
        return this.userPort.findAll();
    }
}
exports.ListUsersUseCase = ListUsersUseCase;
