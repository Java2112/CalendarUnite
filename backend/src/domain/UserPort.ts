// Importa la entidad User del dominio
import { User } from './User';

// Puerto secundario (interfaz) para operaciones de persistencia de usuarios
export interface UserPort {
  // Busca un usuario por su correo electrónico
  findByEmail(email: string): Promise<User | null>;
  // Busca el primer usuario que coincida con un rol
  findByRole(role: string): Promise<User | null>;
  // Busca un usuario por su identificador numérico o alfanumérico
  findById(id: number | string): Promise<User | null>;
  // Obtiene la lista completa de usuarios
  findAll(): Promise<User[]>;
  // Crea un nuevo registro de usuario en la base de datos
  create(user: Omit<User, 'id_usuario'>): Promise<User>;
  // Actualiza los datos de un usuario existente
  update(id: number, data: Partial<User>): Promise<User | null>;
  // Cambia el estado de activación (activo/inactivo) de un usuario
  updateStatus(id: number, estado: boolean): Promise<boolean>;
  // Elimina un usuario por su ID
  delete(id: number): Promise<boolean>;
}
