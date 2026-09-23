import bcrypt from 'bcryptjs';
import { UserPort } from '../../domain/UserPort';
import { User } from '../../domain/User';

export class UserAdapter implements UserPort {
  private users: User[] = [
    {
      id_usuario: 1,
      id: '1',
      nombre: 'Carlos',
      apellido: 'Mendoza',
      correo: 'admin@unite.edu.co',
      password_hash: bcrypt.hashSync('admin123', 10),
      estado: true,
      telefono: '3001234567',
      rol: 'Admin',
      name: 'Carlos Mendoza',
      email: 'admin@unite.edu.co',
      role: 'Admin',
      department: 'Administración General'
    },
    {
      id_usuario: 2,
      id: '2',
      nombre: 'María Elena',
      apellido: 'Restrepo',
      correo: 'bienestar@unite.edu.co',
      password_hash: bcrypt.hashSync('bienestar123', 10),
      estado: true,
      telefono: '3109876543',
      rol: 'Bienestar',
      name: 'Dra. María Elena Restrepo',
      email: 'bienestar@unite.edu.co',
      role: 'Bienestar',
      department: 'Coordinación de Bienestar Universitario'
    },
    {
      id_usuario: 3,
      id: '3',
      nombre: 'Juan Pablo',
      apellido: 'Ríos',
      correo: 'lider@unite.edu.co',
      password_hash: bcrypt.hashSync('lider123', 10),
      estado: true,
      telefono: '3205557890',
      rol: 'Lider',
      name: 'Juan Pablo Ríos',
      email: 'lider@unite.edu.co',
      role: 'Lider',
      department: 'Líder Estudiantil Interfacultades'
    },
    {
      id_usuario: 4,
      id: '4',
      nombre: 'Administrador',
      apellido: 'Principal',
      correo: 'superadmin@unite.edu.co',
      password_hash: bcrypt.hashSync('admin123', 10),
      estado: true,
      telefono: '3009998877',
      rol: 'Admin',
      name: 'Administrador Principal',
      email: 'superadmin@unite.edu.co',
      role: 'Admin',
      department: 'Dirección de Tecnología y Sistemas'
    }
  ];

  async findByEmail(email: string): Promise<User | null> {
    const user = this.users.find(u => u.correo.toLowerCase() === email.toLowerCase());
    return user ? { ...user } : null;
  }

  async findByRole(role: string): Promise<User | null> {
    const user = this.users.find(u => u.rol.toLowerCase() === role.toLowerCase());
    return user ? { ...user } : null;
  }

  async findById(id: number | string): Promise<User | null> {
    const numId = Number(id);
    const user = this.users.find(u => u.id_usuario === numId);
    return user ? { ...user } : null;
  }

  async findAll(): Promise<User[]> {
    return this.users.map(u => ({ ...u }));
  }

  async create(userData: Omit<User, 'id_usuario'>): Promise<User> {
    const nextId = this.users.length > 0 ? Math.max(...this.users.map(u => u.id_usuario)) + 1 : 1;
    const fullName = `${userData.nombre} ${userData.apellido}`.trim();

    const newUser: User = {
      ...userData,
      id_usuario: nextId,
      id: String(nextId),
      name: fullName,
      email: userData.correo,
      role: userData.rol,
      department: userData.department || (userData.rol === 'Admin' ? 'Administración' : userData.rol === 'Bienestar' ? 'Bienestar Universitario' : 'Liderazgo Estudiantil')
    };

    this.users.push(newUser);
    return { ...newUser };
  }

  async update(id: number, data: Partial<User>): Promise<User | null> {
    const userIndex = this.users.findIndex(u => u.id_usuario === Number(id));
    if (userIndex === -1) return null;

    const current = this.users[userIndex];
    const updated: User = {
      ...current,
      ...data,
      id_usuario: current.id_usuario,
      id: String(current.id_usuario)
    };

    if (data.nombre || data.apellido) {
      const name = `${updated.nombre} ${updated.apellido}`.trim();
      updated.name = name;
    }
    if (data.correo) {
      updated.email = data.correo;
    }
    if (data.rol) {
      updated.role = data.rol;
    }

    this.users[userIndex] = updated;
    return { ...updated };
  }

  async updateStatus(id: number, estado: boolean): Promise<boolean> {
    const user = this.users.find(u => u.id_usuario === Number(id));
    if (!user) return false;
    user.estado = estado;
    return true;
  }

  async delete(id: number): Promise<boolean> {
    const numId = Number(id);
    // Proteger cuentas de administrador raíz
    if (numId === 1 || numId === 4) {
      return false;
    }
    const target = this.users.find(u => u.id_usuario === numId);
    if (target && target.rol.toLowerCase() === 'admin') {
      const adminCount = this.users.filter(u => u.rol.toLowerCase() === 'admin').length;
      if (adminCount <= 1) {
        return false;
      }
    }
    const initialLen = this.users.length;
    this.users = this.users.filter(u => u.id_usuario !== numId);
    return this.users.length < initialLen;
  }
}
