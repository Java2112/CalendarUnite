import multer from 'multer';
import path from 'path';
import fs from 'fs';

// Directorio físico donde se almacenarán los archivos subidos localmente
const uploadDirectory = path.resolve(process.cwd(), 'uploads');

// Asegura que la carpeta uploads exista físicamente
if (!fs.existsSync(uploadDirectory)) {
  fs.mkdirSync(uploadDirectory, { recursive: true });
}

// Configuración de almacenamiento en disco para multer
const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, uploadDirectory);
  },
  filename: (_req, file, cb) => {
    // Sanitiza el nombre original para evitar problemas con espacios y caracteres especiales
    const sanitizedOriginal = file.originalname.replace(/[^a-zA-Z0-9._-]/g, '_');
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e4)}`;
    cb(null, `${uniqueSuffix}-${sanitizedOriginal}`);
  }
});

// Filtro de tipos de archivos permitidos
const fileFilter = (
  _req: any,
  file: Express.Multer.File,
  cb: multer.FileFilterCallback
) => {
  const allowedExtensions = ['.pdf', '.png', '.jpg', '.jpeg', '.webp', '.doc', '.docx', '.xls', '.xlsx', '.zip'];
  const ext = path.extname(file.originalname).toLowerCase();
  
  if (allowedExtensions.includes(ext)) {
    cb(null, true);
  } else {
    cb(new Error(`Tipo de archivo no permitido (${ext}). Se permiten: PDF, imágenes y documentos.`));
  }
};

// Middleware exportado para subir un archivo único en el campo 'archivo' o 'file'
export const uploadResourceFile = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 30 * 1024 * 1024 // Límite de 30 MB
  }
}).single('file');
