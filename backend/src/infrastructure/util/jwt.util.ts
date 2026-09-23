import jwt from 'jsonwebtoken';
import { UserRole } from '../../domain/User';

const JWT_SECRET = process.env.JWT_SECRET || 'calendarunite_institutional_jwt_secret_2026_key';
const JWT_EXPIRES_IN = '24h';

export interface TokenPayload {
  id_usuario: number;
  nombre: string;
  correo: string;
  rol: UserRole;
}

export function generateToken(payload: TokenPayload): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
}

export function verifyToken(token: string): TokenPayload | null {
  try {
    return jwt.verify(token, JWT_SECRET) as TokenPayload;
  } catch (error) {
    return null;
  }
}
