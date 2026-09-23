import { Attachment } from './Attachment';

export interface AttachmentPort {
  save(attachment: Omit<Attachment, 'id_archivo'>): Promise<Attachment>;
  findByUserId(userId: number): Promise<Attachment[]>;
  findByUrl(url: string): Promise<Attachment | null>;
}
