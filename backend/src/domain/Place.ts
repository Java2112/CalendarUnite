// Interfaz que modela un Lugar o espacio físico/virtual del campus
export interface Place {
  // Identificador numérico único del lugar
  id_lugar: number;
  // Nombre o denominación del espacio (ej: Auditorio Principal)
  nombre: string;
  // Dirección física opcional
  direccion?: string | null;
  // Edificio o bloque donde se ubica
  edificio?: string | null;
  // Número de aula o salón específico
  aula?: string | null;
}
