import { User } from './User';

export interface UserPort {
  findByEmail(email: string): Promise<User | null>;
  findByRole(role: string): Promise<User | null>;
  findById(id: number | string): Promise<User | null>;
  findAll(): Promise<User[]>;
  create(user: Omit<User, 'id_usuario'>): Promise<User>;
  update(id: number, data: Partial<User>): Promise<User | null>;
  updateStatus(id: number, estado: boolean): Promise<boolean>;
  delete(id: number): Promise<boolean>;
}
