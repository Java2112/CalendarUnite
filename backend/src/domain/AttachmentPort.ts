// Importa la entidad Attachment del dominio
import { Attachment } from './Attachment';

// Puerto secundario (interfaz) para operaciones de persistencia de archivos adjuntos
export interface AttachmentPort {
  // Guarda la información de un archivo adjunto
  save(attachment: Omit<Attachment, 'id_archivo'>): Promise<Attachment>;
  // Consulta los archivos subidos por un usuario
  findByUserId(userId: number): Promise<Attachment[]>;
  // Busca un registro de archivo por su URL
  findByUrl(url: string): Promise<Attachment | null>;
}
