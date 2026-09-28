// Tipos de roles admitidos en el sistema CalendarUnite
export type UserRole = 'Admin' | 'Bienestar' | 'Lider';

// Modelo de datos del usuario autenticado y gestionado en el sistema
export interface User {
  // Identificador numérico de la BD
  id_usuario?: number;
  // Identificador de compatibilidad
  id?: string;
  // Nombre de pila
  nombre?: string;
  // Apellido
  apellido?: string;
  // Nombre completo combinado
  name: string;
  // Correo de BD
  correo?: string;
  // Correo electrónico institucional
  email: string;
  // Rol del usuario en la plataforma
  role: UserRole;
  // Rol alternativo
  rol?: UserRole;
  // Estado activo o inactivo
  estado?: boolean;
  // Teléfono de contacto
  telefono?: string | null;
  // Área o departamento institucional
  department?: string;
  // URL de la foto de perfil o avatar
  avatar?: string;
}

// Estructura de la respuesta del backend tras un login exitoso
export interface AuthResponse {
  // Mensaje descriptivo
  message: string;
  // Token JWT para autorizar peticiones
  token: string;
  // Datos del perfil de usuario
  user: User;
}

// Estructura para la solicitud de inicio de sesión
export interface LoginCredentials {
  // Correo institucional
  email?: string;
  // Contraseña en texto plano
  password?: string;
  // Rol para acceso rápido de prueba
  role?: UserRole;
}

// DTO para registrar un nuevo usuario en la base de datos
export interface CreateUserRequest {
  // Nombre
  nombre: string;
  // Apellido
  apellido: string;
  // Correo institucional
  correo: string;
  // Contraseña opcional
  password?: string;
  // Rol asignado
  rol: UserRole;
  // Teléfono de contacto
  telefono?: string;
  // Estado inicial
  estado?: boolean;
}

// DTO para actualizar los datos de un usuario existente
export interface UpdateUserRequest {
  // Nombre actualizado
  nombre?: string;
  // Apellido actualizado
  apellido?: string;
  // Correo institucional actualizado
  correo?: string;
  // Nueva contraseña opcional
  password?: string;
  // Nuevo rol
  rol?: UserRole;
  // Nuevo teléfono
  telefono?: string;
  // Nuevo estado
  estado?: boolean;
}
