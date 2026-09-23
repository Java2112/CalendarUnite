import { isValidEmail } from './email-validation';

export function validateRegisterInput(data: { nombre?: string; correo?: string; telefono?: string }): string | null {
  const { nombre, correo, telefono } = data;
  if (!nombre || !correo || !telefono) {
    return 'Todos los campos son obligatorios.';
  }
  if (!isValidEmail(correo)) {
    return 'El correo electrónico proporcionado no es válido.';
  }
  return null;
}
