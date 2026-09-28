// Importa bcryptjs para hashear la nueva contraseña si se provee
import bcrypt from 'bcryptjs';
// Importa el puerto de persistencia de usuarios
import { UserPort } from '../../../domain/UserPort';
// Importa los tipos y reglas de negocio del dominio de usuarios
import { User, UserRole, UserDomainRule } from '../../../domain/User';

// DTO con los datos opcionales para actualizar un usuario
export interface UpdateUserDTO {
  // Nombre actualizado
  nombre?: string;
  // Apellido actualizado
  apellido?: string;
  // Correo institucional actualizado
  correo?: string;
  // Nueva contraseña opcional
  password?: string;
  // Nuevo rol opcional
  rol?: UserRole;
  // Nuevo teléfono opcional
  telefono?: string;
  // Nuevo estado de actividad opcional
  estado?: boolean;
}

// Caso de uso para editar la información de un usuario
export class UpdateUserUseCase {
  // Inyecta el puerto de usuarios
  constructor(private userPort: UserPort) {}

  // Ejecuta la actualización verificando rol de Administrador
  async execute(
    userId: number,
    dto: UpdateUserDTO,
    currentUser: { rol: UserRole }
  ): Promise<User> {
    // Valida que el usuario que ejecuta la acción sea Administrador
    if (!UserDomainRule.isAdmin(currentUser)) {
      const err: any = new Error('Acceso denegado: Solo el Administrador puede editar usuarios.');
      err.status = 403;
      throw err;
    }

    // Consulta si el usuario existe
    const existing = await this.userPort.findById(userId);
    // Si no existe, lanza error 404
    if (!existing) {
      const err: any = new Error('El usuario no existe.');
      err.status = 404;
      throw err;
    }

    // Construye el payload de actualización con los campos enviados
    const updateData: Partial<User> = {};
    if (dto.nombre !== undefined) updateData.nombre = dto.nombre.trim();
    if (dto.apellido !== undefined) updateData.apellido = dto.apellido.trim();
    if (dto.correo !== undefined) updateData.correo = dto.correo.trim().toLowerCase();
    if (dto.rol !== undefined) updateData.rol = dto.rol;
    if (dto.telefono !== undefined) updateData.telefono = dto.telefono.trim();
    if (dto.estado !== undefined) updateData.estado = dto.estado;

    // Si se envió una nueva contraseña, genera su hash
    if (dto.password && dto.password.trim() !== '') {
      updateData.password_hash = await bcrypt.hash(dto.password.trim(), 10);
    }

    // Actualiza el usuario en la base de datos
    const updated = await this.userPort.update(userId, updateData);
    // Si la actualización falla, lanza excepción
    if (!updated) {
      throw new Error('No se pudo actualizar el usuario.');
    }
    // Retorna el usuario actualizado
    return updated;
  }
}
