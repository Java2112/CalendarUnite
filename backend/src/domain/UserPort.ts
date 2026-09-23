import { User } from './User';

export interface UserPort {
  findByEmail(email: string): Promise<User | null>;
  findByRole(role: string): Promise<User | null>;
  findById(id: string): Promise<User | null>;
}
