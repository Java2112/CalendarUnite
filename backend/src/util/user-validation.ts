// Importa la función de validación de formato de correo
import { isValidEmail } from './email-validation';

// Función utilitaria que valida los datos requeridos para registrar a un asistente
export function validateRegisterInput(data: { nombre?: string; correo?: string; telefono?: string }): string | null {
  // Desestructura los campos recibidos
  const { nombre, correo, telefono } = data;
  // Comprueba que todos los campos obligatorios estén presentes
  if (!nombre || !correo || !telefono) {
    // Retorna mensaje de error si falta algún campo
    return 'Todos los campos son obligatorios.';
  }
  // Valida que el correo tenga una estructura correcta
  if (!isValidEmail(correo)) {
    // Retorna mensaje de error si el formato del correo es inválido
    return 'El correo electrónico proporcionado no es válido.';
  }
  // Retorna null indicando que los datos son válidos
  return null;
}
