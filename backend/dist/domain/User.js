"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserDomainRule = void 0;
class UserDomainRule {
    static isAdmin(roleOrUser) {
        const role = typeof roleOrUser === 'string' ? roleOrUser : roleOrUser.rol;
        return role.toLowerCase() === 'admin';
    }
    static isAuthorizedToManageEvent(user, event) {
        if (this.isAdmin(user.rol)) {
            return true;
        }
        return Number(event.id_responsable) === Number(user.id_usuario);
    }
}
exports.UserDomainRule = UserDomainRule;
