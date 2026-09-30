"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserDomainRule = void 0;
// Clase de reglas de negocio para el dominio de usuarios
class UserDomainRule {
    // Comprueba si un usuario o rol corresponde al perfil Administrador
    static isAdmin(roleOrUser) {
        // Normaliza la extracción del rol
        const role = typeof roleOrUser === 'string' ? roleOrUser : roleOrUser.rol;
        // Compara en minúsculas para evitar discrepancias
        return role.toLowerCase() === 'admin';
    }
    // Verifica si un usuario tiene autorización para modificar o eliminar un evento
    static isAuthorizedToManageEvent(user, event) {
        // El Administrador tiene permiso universal sobre cualquier evento
        if (this.isAdmin(user.rol)) {
            return true;
        }
        // Otros roles solo pueden gestionar eventos donde sean el responsable
        return Number(event.id_responsable) === Number(user.id_usuario);
    }
}
exports.UserDomainRule = UserDomainRule;
