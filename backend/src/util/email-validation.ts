// Función utilitaria que valida si un texto cumple con el formato estándar de correo
export function isValidEmail(email: string): boolean {
  // Si no se proporcionó correo, retorna falso
  if (!email) return false;
  // Expresión regular para validar formato de correo electrónico
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  // Evalúa el correo contra la expresión regular y retorna el resultado booleano
  return emailRegex.test(email);
}
