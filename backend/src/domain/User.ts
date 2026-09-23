export type UserRole = 'Admin' | 'Bienestar' | 'Lider';

export interface User {
  id_usuario: number;
  nombre: string;
  apellido: string;
  correo: string;
  password_hash: string;
  estado: boolean;
  telefono?: string | null;
  rol: UserRole;
  // Campos de apoyo y compatibilidad
  id?: string;
  name?: string;
  email?: string;
  department?: string;
  avatar?: string;
  role?: UserRole;
}

export type UserWithoutPassword = Omit<User, 'password_hash'>;
export type UserProfile = UserWithoutPassword;

export class UserDomainRule {
  static isAdmin(roleOrUser: UserRole | { rol: UserRole }): boolean {
    const role = typeof roleOrUser === 'string' ? roleOrUser : roleOrUser.rol;
    return role.toLowerCase() === 'admin';
  }

  static isAuthorizedToManageEvent(
    user: { id_usuario: number; rol: UserRole },
    event: { id_responsable: number }
  ): boolean {
    if (this.isAdmin(user.rol)) {
      return true;
    }
    return Number(event.id_responsable) === Number(user.id_usuario);
  }
}
