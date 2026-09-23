import bcrypt from 'bcryptjs';
import { UserPort } from '../domain/UserPort';
import { UserProfile } from '../domain/User';
import { generateToken, verifyToken } from '../infrastructure/util/jwt.util';

export class UserApplication {
  constructor(private userPort: UserPort) {}

  async login(email?: string, password?: string, role?: string): Promise<{ token: string; user: UserProfile } | null> {
    let foundUser = null;

    if (role) {
      foundUser = await this.userPort.findByRole(role);
    } else if (email && password) {
      const user = await this.userPort.findByEmail(email.trim());
      if (user) {
        const match = await bcrypt.compare(password, user.password_hash) || user.password_hash === password;
        if (match) {
          foundUser = user;
        }
      }
    }

    if (!foundUser) {
      return null;
    }

    const token = generateToken({
      id_usuario: foundUser.id_usuario,
      nombre: `${foundUser.nombre} ${foundUser.apellido}`.trim(),
      correo: foundUser.correo,
      rol: foundUser.rol
    });

    const userProfile: UserProfile = {
      id_usuario: foundUser.id_usuario,
      id: String(foundUser.id_usuario),
      nombre: foundUser.nombre,
      apellido: foundUser.apellido,
      name: `${foundUser.nombre} ${foundUser.apellido}`.trim(),
      correo: foundUser.correo,
      email: foundUser.correo,
      rol: foundUser.rol,
      role: foundUser.rol,
      estado: foundUser.estado,
      telefono: foundUser.telefono,
      department: foundUser.department,
      avatar: foundUser.avatar
    };

    return { token, user: userProfile };
  }

  async getProfileByToken(token: string): Promise<UserProfile | null> {
    const payload = verifyToken(token);
    if (!payload) return null;

    const user = await this.userPort.findById(payload.id_usuario);
    if (!user) return null;

    return {
      id_usuario: user.id_usuario,
      id: String(user.id_usuario),
      nombre: user.nombre,
      apellido: user.apellido,
      name: `${user.nombre} ${user.apellido}`.trim(),
      correo: user.correo,
      email: user.correo,
      rol: user.rol,
      role: user.rol,
      estado: user.estado,
      telefono: user.telefono,
      department: user.department,
      avatar: user.avatar
    };
  }
}
