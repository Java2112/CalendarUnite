// Importa los tipos Request, Response y NextFunction de Express
import { Request, Response, NextFunction } from 'express';
// Importa el tipo de rol de usuario del dominio
import { UserRole } from '../../domain/User';

// Fábrica de middleware que restringe el acceso según roles permitidos
export function requireRoles(...allowedRoles: UserRole[]) {
  // Retorna la función middleware de Express
  return (req: Request, res: Response, next: NextFunction): void => {
    // Si no hay usuario en la petición, no está autenticado
    if (!req.user) {
      // Retorna error 401 Unauthorized
      res.status(401).json({ error: 'No autenticado.' });
      return;
    }

    // Obtiene el rol del usuario autenticado
    const userRole = req.user.rol;
    // Comprueba si el rol del usuario coincide con alguno de los permitidos
    const hasPermission = allowedRoles.some(
      role => role.toLowerCase() === userRole.toLowerCase()
    );

    // Si el usuario no tiene los permisos requeridos
    if (!hasPermission) {
      // Retorna error 403 Forbidden con mensaje detallado
      res.status(403).json({
        error: `Acceso restringido: Esta acción requiere uno de los siguientes roles: [${allowedRoles.join(', ')}]. Tu rol actual es: ${userRole}.`
      });
      return;
    }

    // Continúa con el siguiente middleware o controlador
    next();
  };
}

// Middleware preconfigurado para requerir rol de Administrador
export const requireAdmin = requireRoles('Admin');
// Middleware preconfigurado para requerir roles autorizados a crear/editar eventos
export const requireAuthorizedOrganizers = requireRoles('Admin', 'Bienestar', 'Lider');
