"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.requireAuthorizedOrganizers = exports.requireAdmin = void 0;
exports.requireRoles = requireRoles;
function requireRoles(...allowedRoles) {
    return (req, res, next) => {
        if (!req.user) {
            res.status(401).json({ error: 'No autenticado.' });
            return;
        }
        const userRole = req.user.rol;
        const hasPermission = allowedRoles.some(role => role.toLowerCase() === userRole.toLowerCase());
        if (!hasPermission) {
            res.status(403).json({
                error: `Acceso restringido: Esta acción requiere uno de los siguientes roles: [${allowedRoles.join(', ')}]. Tu rol actual es: ${userRole}.`
            });
            return;
        }
        next();
    };
}
exports.requireAdmin = requireRoles('Admin');
exports.requireAuthorizedOrganizers = requireRoles('Admin', 'Bienestar', 'Lider');
