import { Request, Response, NextFunction } from 'express';
import { verifyToken, TokenPayload } from '../util/jwt.util';
import { UserRole } from '../../domain/User';

// Extended la interfaz de Request de Express para adjuntar la información del usuario autenticado
declare global {
  namespace Express {
    interface Request {
      user?: TokenPayload;
    }
  }
}

/**
 * Middleware de Autenticación Express:
 * Intercepta las solicitudes a rutas protegidas, extrae el token JWT del encabezado 'Authorization: Bearer <token>'
 * y verifica que el usuario esté autenticado antes de darle acceso a la ruta.
 */
export function authMiddleware(req: Request, res: Response, next: NextFunction): void {
  // 1. Extraer el encabezado de Autorización de la petición HTTP
  const authHeader = req.headers.authorization;

  // 2. Verificar que exista el encabezado y tenga el prefijo 'Bearer '
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    res.status(401).json({
      error: 'No se proporcionó token de autorización o el formato es inválido (Bearer <token>).'
    });
    return;
  }

  // 3. Limpiar la cadena para obtener el token puro y validarlo con la util de JWT
  const token = authHeader.replace('Bearer ', '').trim();
  const payload = verifyToken(token);

  // 4. Si el token JWT es válido, adjuntar los datos del usuario a req.user y continuar
  if (payload) {
    req.user = payload;
    return next();
  }

  // 5. Soporte de compatibilidad para tokens mock/legacy (ej: token-admin-123)
  if (token.startsWith('token-')) {
    let role: UserRole = 'Lider';
    let id = 3;
    let name = 'Líder Estudiantil';
    let email = 'lider@unite.edu.co';

    if (token.includes('admin')) {
      role = 'Admin';
      id = 1;
      name = 'Carlos Mendoza';
      email = 'admin@unite.edu.co';
    } else if (token.includes('bienestar')) {
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

  // 6. Si el token no es válido ni legacy, retornar error 401 Unauthorized
  res.status(401).json({
    error: 'Token inválido o expirado. Por favor inicia sesión nuevamente.'
  });
}
