import { Request, Response, NextFunction } from 'express';
import { UserRole } from '../../domain/User';

export function requireRoles(...allowedRoles: UserRole[]) {
  return (req: Request, res: Response, next: NextFunction): void => {
    if (!req.user) {
      res.status(401).json({ error: 'No autenticado.' });
      return;
    }

    const userRole = req.user.rol;
    const hasPermission = allowedRoles.some(
      role => role.toLowerCase() === userRole.toLowerCase()
    );

    if (!hasPermission) {
      res.status(403).json({
        error: `Acceso restringido: Esta acción requiere uno de los siguientes roles: [${allowedRoles.join(', ')}]. Tu rol actual es: ${userRole}.`
      });
      return;
    }

    next();
  };
}

export const requireAdmin = requireRoles('Admin');
export const requireAuthorizedOrganizers = requireRoles('Admin', 'Bienestar', 'Lider');
