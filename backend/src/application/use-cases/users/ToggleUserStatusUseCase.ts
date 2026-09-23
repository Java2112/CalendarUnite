import { UserPort } from '../../../domain/UserPort';
import { UserRole, UserDomainRule } from '../../../domain/User';

export class ToggleUserStatusUseCase {
  constructor(private userPort: UserPort) {}

  async execute(
    userId: number,
    estado: boolean,
    currentUser: { rol: UserRole }
  ): Promise<boolean> {
    if (!UserDomainRule.isAdmin(currentUser)) {
      const err: any = new Error('Acceso denegado: Solo el Administrador puede activar o desactivar usuarios.');
      err.status = 403;
      throw err;
    }

    const existing = await this.userPort.findById(userId);
    if (!existing) {
      const err: any = new Error('El usuario no existe.');
      err.status = 404;
      throw err;
    }

    return this.userPort.updateStatus(userId, estado);
  }
}
