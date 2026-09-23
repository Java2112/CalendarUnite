import bcrypt from 'bcryptjs';
import { UserPort } from '../../../domain/UserPort';
import { User, UserRole, UserDomainRule } from '../../../domain/User';

export interface UpdateUserDTO {
  nombre?: string;
  apellido?: string;
  correo?: string;
  password?: string;
  rol?: UserRole;
  telefono?: string;
  estado?: boolean;
}

export class UpdateUserUseCase {
  constructor(private userPort: UserPort) {}

  async execute(
    userId: number,
    dto: UpdateUserDTO,
    currentUser: { rol: UserRole }
  ): Promise<User> {
    if (!UserDomainRule.isAdmin(currentUser)) {
      const err: any = new Error('Acceso denegado: Solo el Administrador puede editar usuarios.');
      err.status = 403;
      throw err;
    }

    const existing = await this.userPort.findById(userId);
    if (!existing) {
      const err: any = new Error('El usuario no existe.');
      err.status = 404;
      throw err;
    }

    const updateData: Partial<User> = {};
    if (dto.nombre !== undefined) updateData.nombre = dto.nombre.trim();
    if (dto.apellido !== undefined) updateData.apellido = dto.apellido.trim();
    if (dto.correo !== undefined) updateData.correo = dto.correo.trim().toLowerCase();
    if (dto.rol !== undefined) updateData.rol = dto.rol;
    if (dto.telefono !== undefined) updateData.telefono = dto.telefono.trim();
    if (dto.estado !== undefined) updateData.estado = dto.estado;

    if (dto.password && dto.password.trim() !== '') {
      updateData.password_hash = await bcrypt.hash(dto.password.trim(), 10);
    }

    const updated = await this.userPort.update(userId, updateData);
    if (!updated) {
      throw new Error('No se pudo actualizar el usuario.');
    }
    return updated;
  }
}
