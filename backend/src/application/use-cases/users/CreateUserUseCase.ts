import bcrypt from 'bcryptjs';
import { UserPort } from '../../../domain/UserPort';
import { User, UserRole, UserDomainRule } from '../../../domain/User';

export interface CreateUserDTO {
  nombre: string;
  apellido: string;
  correo: string;
  password?: string;
  rol: UserRole;
  telefono?: string;
  estado?: boolean;
}

export class CreateUserUseCase {
  constructor(private userPort: UserPort) {}

  async execute(dto: CreateUserDTO, currentUser: { rol: UserRole }): Promise<User> {
    if (!UserDomainRule.isAdmin(currentUser)) {
      const err: any = new Error('Acceso denegado: Solo el Administrador puede registrar nuevos usuarios.');
      err.status = 403;
      throw err;
    }

    if (!dto.nombre || !dto.apellido || !dto.correo) {
      throw new Error('Nombre, apellido y correo son campos obligatorios.');
    }

    const cleanEmail = dto.correo.trim().toLowerCase();
    const existing = await this.userPort.findByEmail(cleanEmail);
    if (existing) {
      const err: any = new Error('Ya existe un usuario registrado con este correo electrónico.');
      err.status = 400;
      throw err;
    }

    const rawPassword = dto.password || 'Unite2026*';
    const passwordHash = await bcrypt.hash(rawPassword, 10);

    const newUser: Omit<User, 'id_usuario'> = {
      nombre: dto.nombre.trim(),
      apellido: dto.apellido.trim(),
      correo: cleanEmail,
      password_hash: passwordHash,
      rol: dto.rol || 'Lider',
      telefono: dto.telefono ? dto.telefono.trim() : null,
      estado: dto.estado !== undefined ? dto.estado : true
    };

    return this.userPort.create(newUser);
  }
}
