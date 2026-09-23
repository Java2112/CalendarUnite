import { UserPort } from '../../../domain/UserPort';
import { User, UserRole, UserDomainRule } from '../../../domain/User';

export class ListUsersUseCase {
  constructor(private userPort: UserPort) {}

  async execute(currentUser: { rol: UserRole }): Promise<User[]> {
    if (!UserDomainRule.isAdmin(currentUser)) {
      const err: any = new Error('Acceso denegado: Esta operación es exclusiva para Administradores.');
      err.status = 403;
      throw err;
    }

    return this.userPort.findAll();
  }
}
