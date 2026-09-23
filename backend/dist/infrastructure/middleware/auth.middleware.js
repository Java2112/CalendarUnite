"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authMiddleware = authMiddleware;
const jwt_util_1 = require("../util/jwt.util");
function authMiddleware(req, res, next) {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        res.status(401).json({
            error: 'No se proporcionó token de autorización o el formato es inválido (Bearer <token>).'
        });
        return;
    }
    const token = authHeader.replace('Bearer ', '').trim();
    const payload = (0, jwt_util_1.verifyToken)(token);
    if (payload) {
        req.user = payload;
        return next();
    }
    // Compatibilidad con tokens legacy temporales si vinieran del frontend previo
    if (token.startsWith('token-')) {
        let role = 'Lider';
        let id = 3;
        let name = 'Líder Estudiantil';
        let email = 'lider@unite.edu.co';
        if (token.includes('admin')) {
            role = 'Admin';
            id = 1;
            name = 'Carlos Mendoza';
            email = 'admin@unite.edu.co';
        }
        else if (token.includes('bienestar')) {
            role = 'Bienestar';
            id = 2;
            name = 'Dra. María Elena Restrepo';
            email = 'bienestar@unite.edu.co';
        }
        req.user = {
            id_usuario: id,
            nombre: name,
            correo: email,
            rol: role
        };
        return next();
    }
    res.status(401).json({
        error: 'Token inválido o expirado. Por favor inicia sesión nuevamente.'
    });
}
