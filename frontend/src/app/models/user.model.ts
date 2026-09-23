// Definición de roles admitidos en el sistema CalendarUnite
export type UserRole = 'Admin' | 'Bienestar' | 'Lider';

// Modelo de datos del usuario autenticado y gestionado en el sistema
export interface User {
  id_usuario?: number;
  id?: string;
  nombre?: string;
  apellido?: string;
  name: string;
  correo?: string;
  email: string;
  role: UserRole;
  rol?: UserRole;
  estado?: boolean;
  telefono?: string | null;
  department?: string;
  avatar?: string;
}

// Estructura de la respuesta recibida tras un login exitoso
export interface AuthResponse {
  message: string;
  token: string;
  user: User;
}

// Estructura para la solicitud de inicio de sesión
export interface LoginCredentials {
  email?: string;
  password?: string;
  role?: UserRole;
}

// DTO para crear nuevo usuario (Admin)
export interface CreateUserRequest {
  nombre: string;
  apellido: string;
  correo: string;
  password?: string;
  rol: UserRole;
  telefono?: string;
  estado?: boolean;
}

// DTO para editar usuario (Admin)
export interface UpdateUserRequest {
  nombre?: string;
  apellido?: string;
  correo?: string;
  password?: string;
  rol?: UserRole;
  telefono?: string;
  estado?: boolean;
}
