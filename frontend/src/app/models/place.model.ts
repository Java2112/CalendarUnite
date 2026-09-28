// Interfaz para representar un lugar o aula del campus universitario
export interface Place {
  // Identificador numérico del lugar en BD
  id_lugar: number;
  // Nombre o descripción del espacio
  nombre: string;
  // Dirección física opcional
  direccion?: string | null;
  // Edificio o bloque
  edificio?: string | null;
  // Aula o salón específico
  aula?: string | null;
}
