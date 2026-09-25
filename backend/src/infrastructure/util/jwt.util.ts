import jwt from 'jsonwebtoken';
import { UserRole } from '../../domain/User';
import envs from '../config/environment-vars';

export interface TokenPayload {
  id_usuario: number;
  nombre: string;
  correo: string;
  rol: UserRole;
}

export function generateToken(payload: TokenPayload): string {
  return jwt.sign(payload, envs.JWT_SECRET, { expiresIn: envs.JWT_EXPIRES_IN as any });
}

export function verifyToken(token: string): TokenPayload | null {
  try {
    return jwt.verify(token, envs.JWT_SECRET) as TokenPayload;
  } catch (error) {
    return null;
  }
}
