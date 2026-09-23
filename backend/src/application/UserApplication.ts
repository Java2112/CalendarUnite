import { UserPort } from '../domain/UserPort';
import { UserProfile } from '../domain/User';

export class UserApplication {
  constructor(private userPort: UserPort) {}

  async login(email?: string, password?: string, role?: string): Promise<{ token: string; user: UserProfile } | null> {
    let foundUser = null;

    if (role) {
      foundUser = await this.userPort.findByRole(role);
    } else if (email && password) {
      const user = await this.userPort.findByEmail(email.trim());
      if (user && user.password === password) {
        foundUser = user;
      }
    }

    if (!foundUser) {
      return null;
    }

    const token = `token-${foundUser.role.toLowerCase()}-${Date.now()}`;
    const userProfile: UserProfile = {
      id: foundUser.id,
      name: foundUser.name,
      email: foundUser.email,
      role: foundUser.role,
      department: foundUser.department,
      avatar: foundUser.avatar
    };

    return { token, user: userProfile };
  }

  async getProfileByToken(token: string): Promise<UserProfile | null> {
    let role = '';
    if (token.includes('admin')) role = 'Admin';
    else if (token.includes('bienestar')) role = 'Bienestar';
    else if (token.includes('lider')) role = 'Lider';

    if (!role) return null;

    const user = await this.userPort.findByRole(role);
    if (!user) return null;

    return {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      department: user.department,
      avatar: user.avatar
    };
  }
}
