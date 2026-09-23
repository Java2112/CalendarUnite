export interface Attachment {
  id_archivo: number;
  id_usuario: number;
  nombre?: string | null;
  tipo?: string | null;
  url: string;
  tamano?: number | null;
  fecha_subida?: Date | string;
}
