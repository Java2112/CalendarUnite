// Importa la entidad del dominio Resource
import { Resource } from '../../domain/Resource';
// Importa el puerto del dominio ResourcePort
import { ResourcePort } from '../../domain/ResourcePort';

// Adaptador de infraestructura que implementa la persistencia / proveedor de recursos
export class ResourceAdapter implements ResourcePort {
  // Lista local de datos en memoria para recursos públicos
  private initialResources: Resource[] = [
    {
      id: 'res-1',
      title: 'Reglamento Estudiantil y Derechos Institucionales 2026',
      category: 'Reglamento / PDF',
      fileType: 'pdf',
      uploadedByRole: 'Coordinador Académico',
      uploaderName: 'Dr. Carlos Rodríguez',
      fileUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
      description: 'Documento oficial con el conjunto de derechos, deberes, procesos disciplinarios y normas académicas aplicables a todos los estudiantes matriculados en Uniempresarial.',
      date: '2026-02-15',
      size: '2.5 MB'
    },
    {
      id: 'res-2',
      title: 'Infografía: Ruta de Atención en Salud Mental y Apoyo Emocional',
      category: 'Infografía / Imagen',
      fileType: 'image',
      uploadedByRole: 'Docente / Psicóloga',
      uploaderName: 'Dra. María Fernanda Páez',
      fileUrl: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=1200&q=80',
      description: 'Guía gráfica e intuitiva sobre cómo acceder a citas de orientación psicológica gratuita, talleres de gestión de ansiedad y líneas telefónicas 24/7.',
      date: '2026-03-01',
      size: '1.8 MB'
    },
    {
      id: 'res-3',
      title: 'Guía Metodológica para Proyectos de Investigación (Normas APA 7ª Ed.)',
      category: 'Guía Técnica / PDF',
      fileType: 'pdf',
      uploadedByRole: 'Docente Investigador',
      uploaderName: 'Prof. Alejandro Gómez',
      fileUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
      description: 'Manual de estilo y citación científica estandarizado para la presentación formal de anteproyectos, monografías y trabajos de opción de grado.',
      date: '2026-01-20',
      size: '3.1 MB'
    },
    {
      id: 'res-4',
      title: 'Manual de Acceso a Plazas de Prácticas y Modelo Dual',
      category: 'Documento Académico',
      fileType: 'doc',
      uploadedByRole: 'Coordinador de Modelo Dual',
      uploaderName: 'Ing. Sandra Milena Castro',
      fileUrl: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=1200&q=80',
      description: 'Pautas para el diligenciamiento de bitácoras, evaluación en empresas co-formadoras y requisitos para el inicio de rotación laboral en empresas aliadas.',
      date: '2026-02-28',
      size: '1.2 MB'
    },
    {
      id: 'res-5',
      title: 'Folleto Informativo: Torneos Deportivos y Grupos Culturales',
      category: 'Folleto / Imagen',
      fileType: 'image',
      uploadedByRole: 'Coordinador de Bienestar',
      uploaderName: 'Lic. Javier Torres',
      fileUrl: 'https://images.unsplash.com/photo-1517649763962-0c623266ddc0?auto=format&fit=crop&w=1200&q=80',
      description: 'Resumen visual de las disciplinas deportivas (Fútbol, Baloncesto, Voleibol) y talleres artísticos (Danza, Teatro, Música) abiertos para inscripción este semestre.',
      date: '2026-03-10',
      size: '4.0 MB'
    },
    {
      id: 'res-6',
      title: 'Formato Estándar de Solicitud de Certificados y Trámites Académicos',
      category: 'Formato / Documento',
      fileType: 'doc',
      uploadedByRole: 'Secretaría Académica',
      uploaderName: 'Lic. Andrea Morales',
      fileUrl: 'https://images.unsplash.com/photo-1450133064473-71024230f91b?auto=format&fit=crop&w=1200&q=80',
      description: 'Formulario oficial reutilizable para tramitar certificados de notas, constancias de estudio, homologaciones y supletorios ante la universidad.',
      date: '2026-02-05',
      size: '450 KB'
    }
  ];

  // Implementación del método findAll del puerto
  async findAll(): Promise<Resource[]> {
    // Retorna la colección de recursos disponibles de acceso libre
    return this.initialResources;
  }

  // Implementación del método findById del puerto
  async findById(id: string | number): Promise<Resource | null> {
    // Busca un recurso por id coincidente
    const found = this.initialResources.find(r => String(r.id) === String(id));
    return found || null;
  }
}
