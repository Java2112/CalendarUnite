// Interfaces y tipos para el modelo de datos de Recursos Públicos

export type FileType = 'pdf' | 'image' | 'doc' | 'excel' | 'zip';

export interface ResourceItem {
  id: string | number;
  title: string;
  category: string;
  fileType: FileType;
  uploadedByRole: string;
  uploaderName?: string;
  fileUrl: string;
  description: string;
  date: string;
  size: string;
}
