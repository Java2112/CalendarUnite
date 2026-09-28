// Importa bcryptjs para generar el hash seguro de la contraseña
import bcrypt from 'bcryptjs';
// Importa el puerto de persistencia de usuarios
import { UserPort } from '../../../domain/UserPort';
// Importa las entidades y reglas del dominio de usuarios
import { User, UserRole, UserDomainRule } from '../../../domain/User';

// DTO con los datos necesarios para registrar un nuevo usuario
export interface CreateUserDTO {
  // Nombre del usuario
  nombre: string;
  // Apellido del usuario
  apellido: string;
  // Correo electrónico institucional
  correo: string;
  // Contraseña en texto plano opcional (se usa una por defecto si no se indica)
  password?: string;
  // Rol que tendrá el usuario
  rol: UserRole;
  // Teléfono de contacto opcional
  telefono?: string;
  // Estado de activación inicial
  estado?: boolean;
}

// Caso de uso para crear un nuevo usuario con verificación de rol administrador
export class CreateUserUseCase {
  // Inyecta el puerto de persistencia de usuarios
  constructor(private userPort: UserPort) {}

  // Ejecuta la creación del usuario validando permisos y unicidad de correo
  async execute(dto: CreateUserDTO, currentUser: { rol: UserRole }): Promise<User> {
    // Valida que el usuario que ejecuta la acción sea Administrador
    if (!UserDomainRule.isAdmin(currentUser)) {
      const err: any = new Error('Acceso denegado: Solo el Administrador puede registrar nuevos usuarios.');
      err.status = 403;
      throw err;
    }

    // Valida presencia de campos obligatorios
    if (!dto.nombre || !dto.apellido || !dto.correo) {
      throw new Error('Nombre, apellido y correo son campos obligatorios.');
    }

    // Normaliza el correo electrónico
    const cleanEmail = dto.correo.trim().toLowerCase();
    // Comprueba si el correo ya está en uso
    const existing = await this.userPort.findByEmail(cleanEmail);
    // Si ya existe, lanza error 400
    if (existing) {
      const err: any = new Error('Ya existe un usuario registrado con este correo electrónico.');
      err.status = 400;
      throw err;
    }

    // Establece la contraseña por defecto o la enviada
    const rawPassword = dto.password || 'Unite2026*';
    // Genera el hash seguro con 10 rondas de salteo
    const passwordHash = await bcrypt.hash(rawPassword, 10);

    // Estructura el objeto de usuario para persistir
    const newUser: Omit<User, 'id_usuario'> = {
      nombre: dto.nombre.trim(),
      apellido: dto.apellido.trim(),
      correo: cleanEmail,
      password_hash: passwordHash,
      rol: dto.rol || 'Lider',
      telefono: dto.telefono ? dto.telefono.trim() : null,
      estado: dto.estado !== undefined ? dto.estado : true
    };

    // Guarda el nuevo usuario en la base de datos y lo retorna
    return this.userPort.create(newUser);
  }
}
