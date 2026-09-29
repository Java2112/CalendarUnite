// Tipo de formato soportado para los recursos educativos
export type ResourceFileType = 'pdf' | 'image' | 'doc' | 'excel' | 'zip';

// Interfaz del dominio que modela un Recurso Público de Acceso Libre
export interface Resource {
  // Identificador único del recurso
  id: string | number;
  // Título explicativo del recurso
  title: string;
  // Categoría temática o del documento (ej. Reglamento, Infografía, Guía)
  category: string;
  // Tipo de archivo para icono y renderizado (pdf, image, doc)
  fileType: ResourceFileType;
  // Rol institucional del usuario que subió el recurso (Docente, Coordinador, Bienestar)
  uploadedByRole: string;
  // Nombre del autor o responsable opcional
  uploaderName?: string;
  // URL o ruta al recurso ejecutable/visualizable en iframe o visor
  fileUrl: string;
  // Descripción o resumen del contenido del recurso
  description: string;
  // Fecha de publicación en formato AAAA-MM-DD
  date: string;
  // Tamaño aproximado del archivo (ej. 2.5 MB)
  size: string;
}
