// Define los roles permitidos en el sistema
export type UserRole = 'Admin' | 'Bienestar' | 'Lider';

// Interfaz que modela la entidad Usuario en la base de datos
export interface User {
  // Identificador numérico único del usuario
  id_usuario: number;
  // Nombre de pila del usuario
  nombre: string;
  // Apellido del usuario
  apellido: string;
  // Correo electrónico institucional único
  correo: string;
  // Hash seguro de la contraseña
  password_hash: string;
  // Estado de actividad del usuario (activo/inactivo)
  estado: boolean;
  // Teléfono opcional de contacto
  telefono?: string | null;
  // Rol asignado al usuario
  rol: UserRole;
  // Identificador opcional para compatibilidad con el frontend
  id?: string;
  // Nombre completo opcional
  name?: string;
  // Correo opcional
  email?: string;
  // Departamento o área institucional opcional
  department?: string;
  // URL del avatar opcional
  avatar?: string;
  // Rol en formato alternativo
  role?: UserRole;
}

// Tipo de usuario que omite la contraseña para respuestas públicas seguras
export type UserWithoutPassword = Omit<User, 'password_hash'>;
// Alias para el perfil de usuario seguro
export type UserProfile = UserWithoutPassword;

// Clase de reglas de negocio para el dominio de usuarios
export class UserDomainRule {
  // Comprueba si un usuario o rol corresponde al perfil Administrador
  static isAdmin(roleOrUser: UserRole | { rol: UserRole }): boolean {
    // Normaliza la extracción del rol
    const role = typeof roleOrUser === 'string' ? roleOrUser : roleOrUser.rol;
    // Compara en minúsculas para evitar discrepancias
    return role.toLowerCase() === 'admin';
  }

  // Verifica si un usuario tiene autorización para modificar o eliminar un evento
  static isAuthorizedToManageEvent(
    user: { id_usuario: number; rol: UserRole },
    event: { id_responsable: number }
  ): boolean {
    // El Administrador tiene permiso universal sobre cualquier evento
    if (this.isAdmin(user.rol)) {
      return true;
    }
    // Otros roles solo pueden gestionar eventos donde sean el responsable
    return Number(event.id_responsable) === Number(user.id_usuario);
  }
}
