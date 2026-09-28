// Importa el puerto de persistencia de usuarios
import { UserPort } from '../../../domain/UserPort';
// Importa los roles y reglas de negocio del dominio de usuarios
import { UserRole, UserDomainRule } from '../../../domain/User';

// Caso de uso para activar o desactivar un usuario
export class ToggleUserStatusUseCase {
  // Inyecta el puerto de usuarios
  constructor(private userPort: UserPort) {}

  // Ejecuta el cambio de estado verificando rol de Administrador
  async execute(
    userId: number,
    estado: boolean,
    currentUser: { rol: UserRole }
  ): Promise<boolean> {
    // Comprueba que el usuario que ejecuta la acción sea Administrador
    if (!UserDomainRule.isAdmin(currentUser)) {
      const err: any = new Error('Acceso denegado: Solo el Administrador puede activar o desactivar usuarios.');
      err.status = 403;
      throw err;
    }

    // Busca si el usuario existe en la base de datos
    const existing = await this.userPort.findById(userId);
    // Si no existe, lanza error 404
    if (!existing) {
      const err: any = new Error('El usuario no existe.');
      err.status = 404;
      throw err;
    }

    // Actualiza el estado booleano del usuario a través del puerto
    return this.userPort.updateStatus(userId, estado);
  }
}
