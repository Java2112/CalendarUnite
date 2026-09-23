export type UserRole = 'Admin' | 'Bienestar' | 'Lider';

export interface User {
  id: string;
  name: string;
  email: string;
  password?: string;
  role: UserRole;
  department: string;
  avatar: string;
}

export type UserProfile = Omit<User, 'password'>;
