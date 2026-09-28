// Importa el puerto de persistencia de usuarios
import { UserPort } from '../../../domain/UserPort';
// Importa las entidades y reglas del dominio de usuarios
import { User, UserRole, UserDomainRule } from '../../../domain/User';

// Caso de uso para listar todos los usuarios del sistema
export class ListUsersUseCase {
  // Inyecta el puerto de usuarios
  constructor(private userPort: UserPort) {}

  // Ejecuta la consulta de usuarios verificando rol de Administrador
  async execute(currentUser: { rol: UserRole }): Promise<User[]> {
    // Valida que el usuario actual sea Administrador
    if (!UserDomainRule.isAdmin(currentUser)) {
      const err: any = new Error('Acceso denegado: Esta operación es exclusiva para Administradores.');
      err.status = 403;
      throw err;
    }

    // Consulta y retorna todos los usuarios registrados
    return this.userPort.findAll();
  }
}
