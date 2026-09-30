"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authMiddleware = authMiddleware;
// Importa la función de verificación y el tipo de payload de JWT
const jwt_util_1 = require("../util/jwt.util");
// Middleware de autenticación para proteger rutas mediante token JWT
function authMiddleware(req, res, next) {
    // Obtiene el encabezado authorization de la petición
    const authHeader = req.headers.authorization;
    // Verifica que exista el encabezado y que comience con 'Bearer '
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        // Retorna error 401 si falta el token o no tiene el formato esperado
        res.status(401).json({
            error: 'No se proporcionó token de autorización o el formato es inválido (Bearer <token>).'
        });
        return;
    }
    // Extrae el token eliminando el prefijo 'Bearer '
    const token = authHeader.replace('Bearer ', '').trim();
    // Verifica el token y extrae su contenido
    const payload = (0, jwt_util_1.verifyToken)(token);
    // Si el token es válido
    if (payload) {
        // Asigna el usuario decodificado a la petición
        req.user = payload;
        // Pasa al siguiente middleware o controlador
        return next();
    }
    // Soporte de compatibilidad para tokens de prueba mock (ej: token-admin-123)
    if (token.startsWith('token-')) {
        // Rol por defecto para token mock
        let role = 'Lider';
        // ID por defecto para token mock
        let id = 3;
        // Nombre por defecto
        let name = 'Líder Estudiantil';
        // Correo por defecto
        let email = 'lider@unite.edu.co';
        // Asigna datos de administrador si el token contiene 'admin'
        if (token.includes('admin')) {
            role = 'Admin';
            id = 1;
            name = 'Carlos Mendoza';
            email = 'admin@unite.edu.co';
            // Asigna datos de bienestar si el token contiene 'bienestar'
        }
        else if (token.includes('bienestar')) {
            role = 'Bienestar';
            id = 2;
            name = 'Dra. María Elena Restrepo';
            email = 'bienestar@unite.edu.co';
        }
        // Asigna el usuario simulado a la petición
        req.user = {
            id_usuario: id,
            nombre: name,
            correo: email,
            rol: role
        };
        // Continúa con la petición
        return next();
    }
    // Si el token no es válido ni de prueba, retorna 401 Unauthorized
    res.status(401).json({
        error: 'Token inválido o expirado. Por favor inicia sesión nuevamente.'
    });
}
