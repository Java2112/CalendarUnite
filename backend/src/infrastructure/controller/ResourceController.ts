// Importa los tipos Request y Response de Express
import { Request, Response } from 'express';
import path from 'path';
// Importa el caso de uso para consultar recursos públicos
import { GetResourcesUseCase } from '../../application/use-cases/resources/GetResourcesUseCase';
// Importa el caso de uso para crear recursos públicos
import { CreateResourceUseCase } from '../../application/use-cases/resources/CreateResourceUseCase';
import { Resource, ResourceFileType } from '../../domain/Resource';

// Controlador HTTP para exponer la API pública y de gestión de recursos
export class ResourceController {
  // Inyecta los casos de uso de recursos
  constructor(
    private getResourcesUseCase: GetResourcesUseCase,
    private createResourceUseCase: CreateResourceUseCase
  ) {}

  // Manejador HTTP GET para listar todos los recursos públicos
  getAll = async (req: Request, res: Response): Promise<Response> => {
    try {
      const resources = await this.getResourcesUseCase.execute();
      return res.json(resources);
    } catch (error: any) {
      return res.status(500).json({ 
        error: error.message || 'Ocurrió un error al consultar los recursos públicos de la institución' 
      });
    }
  };

  // Manejador HTTP POST para subir un nuevo archivo y registrar el recurso
  create = async (req: Request, res: Response): Promise<Response> => {
    try {
      const file = req.file;
      if (!file) {
        return res.status(400).json({ error: 'Debe seleccionar un archivo (PDF, imagen o documento).' });
      }

      const { title, category, description, uploadedByRole, uploaderName } = req.body;
      if (!title || !title.trim()) {
        return res.status(400).json({ error: 'El título del recurso es obligatorio.' });
      }

      // Determina el tipo de archivo
      const ext = path.extname(file.originalname).toLowerCase();
      let fileType: ResourceFileType = 'doc';
      if (ext === '.pdf') {
        fileType = 'pdf';
      } else if (['.png', '.jpg', '.jpeg', '.webp'].includes(ext)) {
        fileType = 'image';
      } else if (['.xls', '.xlsx'].includes(ext)) {
        fileType = 'excel';
      } else if (['.zip', '.rar'].includes(ext)) {
        fileType = 'zip';
      }

      // Calcula tamaño formateado
      const sizeInMB = file.size / (1024 * 1024);
      const sizeStr = sizeInMB >= 1 ? `${sizeInMB.toFixed(1)} MB` : `${Math.round(file.size / 1024)} KB`;

      // Construye la URL pública del archivo servido por Express
      const baseUrl = `${req.protocol}://${req.get('host')}`;
      const fileUrl = `${baseUrl}/uploads/${file.filename}`;

      // Valida o normaliza el rol
      const role = uploadedByRole || 'Bienestar';

      const newResource: Resource = {
        id: `res-${Date.now()}`,
        title: title.trim(),
        category: (category && category.trim()) || 'General',
        fileType,
        uploadedByRole: role,
        uploaderName: (uploaderName && uploaderName.trim()) || `Rol: ${role}`,
        fileUrl,
        description: (description && description.trim()) || 'Sin descripción adicional.',
        date: new Date().toISOString().split('T')[0],
        size: sizeStr
      };

      const saved = await this.createResourceUseCase.execute(newResource);
      return res.status(201).json(saved);
    } catch (error: any) {
      console.error('[ResourceController.create error]:', error);
      return res.status(500).json({
        error: error.message || 'Error al guardar el recurso y almacenar el archivo.'
      });
    }
  };
}
