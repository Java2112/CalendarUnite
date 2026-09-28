// Interfaz que modela un Archivo Adjunto o imagen subida al sistema
export interface Attachment {
  // Identificador numérico del archivo
  id_archivo: number;
  // ID del usuario que subió el archivo
  id_usuario: number;
  // Nombre original del archivo
  nombre?: string | null;
  // Tipo MIME o formato del archivo (ej: image/png)
  tipo?: string | null;
  // URL pública o ruta de acceso al archivo
  url: string;
  // Tamaño en bytes del archivo
  tamano?: number | null;
  // Fecha y hora en que se cargó el archivo
  fecha_subida?: Date | string;
}
