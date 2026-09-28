// Importa la librería jsonwebtoken para firmar y validar tokens
import jwt from 'jsonwebtoken';
// Importa el tipo de rol de usuario del dominio
import { UserRole } from '../../domain/User';
// Importa las variables de entorno
import envs from '../config/environment-vars';

// Interfaz para la carga útil que contendrá el token JWT
export interface TokenPayload {
  // ID único del usuario
  id_usuario: number;
  // Nombre completo del usuario
  nombre: string;
  // Correo electrónico institucional
  correo: string;
  // Rol del usuario dentro del sistema
  rol: UserRole;
}

// Función que genera y firma un nuevo token JWT
export function generateToken(payload: TokenPayload): string {
  // Firma el payload con la clave secreta y tiempo de expiración
  return jwt.sign(payload, envs.JWT_SECRET, { expiresIn: envs.JWT_EXPIRES_IN as any });
}

// Función que verifica la autenticidad de un token JWT recibido
export function verifyToken(token: string): TokenPayload | null {
  // Intenta decodificar y validar el token
  try {
    // Verifica la firma con la clave secreta y retorna el payload
    return jwt.verify(token, envs.JWT_SECRET) as TokenPayload;
  } catch (error) {
    // Si el token es inválido o expiró, retorna null
    return null;
  }
}
