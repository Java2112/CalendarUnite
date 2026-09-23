// Definición de roles admitidos en el sistema CalendarUnite
export type UserRole = 'Admin' | 'Bienestar' | 'Lider';

// Modelo de datos del usuario autenticado
export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  department: string;
  avatar?: string;
}

// Estructura de la respuesta recibida tras un login exitoso
export interface AuthResponse {
  message: string;
  token: string;
  user: User;
}

// Estructura para la solicitud de inicio de sesión con correo y clave
export interface LoginCredentials {
  email?: string;
  password?: string;
  role?: UserRole;
}
