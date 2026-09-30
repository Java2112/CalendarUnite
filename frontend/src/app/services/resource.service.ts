import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, tap, catchError } from 'rxjs';
import { ResourceItem } from '../models/resource.model';

@Injectable({
  providedIn: 'root'
})
// Servicio para gestionar el listado y subida de recursos públicos institucionales
export class ResourceService {
  // URL base del backend
  private apiUrl = 'http://localhost:3000/api/recursos';

  // Arreglo inicial de datos institucionales con archivos locales
  private mockResources: ResourceItem[] = [
    {
      id: 'res-1',
      title: 'Reglamento Estudiantil y Derechos Institucionales 2026',
      category: 'Reglamento / PDF',
      fileType: 'pdf',
      uploadedByRole: 'Bienestar',
      uploaderName: 'Coordinación de Bienestar',
      fileUrl: 'http://localhost:3000/uploads/reglamento-estudiantil-2026.pdf',
      description: 'Documento oficial con el conjunto de derechos, deberes, procesos disciplinarios y normas académicas aplicables a todos los estudiantes matriculados en Uniempresarial.',
      date: '2026-02-15',
      size: '2.5 MB'
    },
    {
      id: 'res-2',
      title: 'Infografía: Ruta de Atención en Salud Mental y Apoyo Emocional',
      category: 'Infografía / Imagen',
      fileType: 'image',
      uploadedByRole: 'Bienestar',
      uploaderName: 'Psicología y Bienestar',
      fileUrl: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=1200&q=80',
      description: 'Guía gráfica e intuitiva sobre cómo acceder a citas de orientación psicológica gratuita, talleres de gestión de ansiedad y líneas telefónicas 24/7.',
      date: '2026-03-01',
      size: '1.8 MB'
    },
    {
      id: 'res-3',
      title: 'Guía de Liderazgo y Participación en Grupos Estudiantiles',
      category: 'Guía / PDF',
      fileType: 'pdf',
      uploadedByRole: 'Lider',
      uploaderName: 'Representación Estudiantil',
      fileUrl: 'http://localhost:3000/uploads/reglamento-estudiantil-2026.pdf',
      description: 'Pautas y estatutos para la conformación de grupos de interés, semilleros y comités liderados por estudiantes.',
      date: '2026-01-20',
      size: '1.4 MB'
    },
    {
      id: 'res-4',
      title: 'Manual de Acceso a Plazas de Prácticas y Modelo Dual',
      category: 'Documento Académico',
      fileType: 'doc',
      uploadedByRole: 'Admin',
      uploaderName: 'Administración Institucional',
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
      uploadedByRole: 'Bienestar',
      uploaderName: 'Coordinador de Bienestar',
      fileUrl: 'https://images.unsplash.com/photo-1517649763962-0c623266ddc0?auto=format&fit=crop&w=1200&q=80',
      description: 'Resumen visual de las disciplinas deportivas (Fútbol, Baloncesto, Voleibol) y talleres artísticos (Danza, Teatro, Música) abiertos para inscripción este semestre.',
      date: '2026-03-10',
      size: '4.0 MB'
    }
  ];

  // Señal reactiva con la lista de recursos actuales
  public resources = signal<ResourceItem[]>(this.mockResources);
  // Señal reactiva de estado de carga
  public isLoading = signal<boolean>(false);

  constructor(private http: HttpClient) {}

  // Carga los recursos desde el backend o usa los mock data si no responde
  loadResources(): Observable<ResourceItem[]> {
    this.isLoading.set(true);
    return this.http.get<ResourceItem[]>(this.apiUrl).pipe(
      tap((data) => {
        if (data && data.length > 0) {
          this.resources.set(data);
        } else {
          this.resources.set(this.mockResources);
        }
        this.isLoading.set(false);
      }),
      catchError(() => {
        // En caso de error o servidor desconectado, usa los datos con URL local
        this.resources.set(this.mockResources);
        this.isLoading.set(false);
        return of(this.mockResources);
      })
    );
  }

  // Sube un nuevo archivo al backend (multipart/form-data)
  uploadResource(formData: FormData): Observable<ResourceItem> {
    return this.http.post<ResourceItem>(this.apiUrl, formData).pipe(
      tap((newRes) => {
        // Agrega el nuevo recurso al inicio de la señal reactiva
        this.resources.update(current => [newRes, ...current]);
      })
    );
  }

  // Retorna los datos iniciales
  getMockResources(): ResourceItem[] {
    return this.mockResources;
  }
}
