import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { ResourceService } from '../../services/resource.service';
import { ResourceItem, FileType } from '../../models/resource.model';

@Component({
  selector: 'app-resources',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="dashboard-container">
      
      <!-- HERO BANNER INSTITUCIONAL DE RECURSOS PÚBLICOS -->
      <section class="hero-banner">
        <div class="hero-content">
          <span class="hero-badge">Portal de Acceso Libre • Estudiantes</span>
          <h1>Biblioteca Institucional de Recursos Educativos</h1>
          <p>
            Consulta material de apoyo, reglamentos, infografías de salud mental, guías de investigación y formatos académicos compartidos por docentes y coordinadores de Uniempresarial.
          </p>

          <!-- Estadísticas Rápidas de Recursos -->
          <div class="stats-grid">
            <div class="stat-card">
              <span class="stat-num">{{ resourcesList.length }}</span>
              <span class="stat-label">Recursos Disponibles</span>
            </div>
            <div class="stat-card">
              <span class="stat-num">{{ pdfCount }}</span>
              <span class="stat-label">Documentos PDF</span>
            </div>
            <div class="stat-card">
              <span class="stat-num">{{ imageCount }}</span>
              <span class="stat-label">Infografías e Imágenes</span>
            </div>
            <div class="stat-card accent">
              <span class="stat-num">100%</span>
              <span class="stat-label">Acceso Libre Estudiantil</span>
            </div>
          </div>
        </div>
      </section>

      <!-- BARRA DE FILTROS Y BÚSQUEDA -->
      <div class="controls-bar">
        <div class="search-box">
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="11" cy="11" r="8"/>
            <line x1="21" y1="21" x2="16.65" y2="16.65"/>
          </svg>
          <input 
            type="text" 
            [(ngModel)]="searchQuery" 
            placeholder="Buscar recurso por título, categoría o docente..." />
        </div>

        <!-- Filtros por tipo de formato -->
        <div class="modality-filters">
          <button 
            [class.active]="selectedType === 'all'" 
            (click)="selectedType = 'all'" 
            class="chip-button">
            Todos los formatos
          </button>
          <button 
            [class.active]="selectedType === 'pdf'" 
            (click)="selectedType = 'pdf'" 
            class="chip-button">
            PDFs
          </button>
          <button 
            [class.active]="selectedType === 'image'" 
            (click)="selectedType = 'image'" 
            class="chip-button">
            Imágenes / Infografías
          </button>
          <button 
            [class.active]="selectedType === 'doc'" 
            (click)="selectedType = 'doc'" 
            class="chip-button">
            Documentos / Guías
          </button>
        </div>
      </div>

      <!-- GRID / LISTA RESPONSIVA DE BANNERS DE RECURSOS (ESTILOS ION-CARD / ION-ITEM) -->
      <div class="resources-grid">
        @for (resource of filteredResources; track resource.id) {
          <div 
            class="resource-card ion-card" 
            (click)="openResourceModal(resource)"
            title="Haga clic para previsualizar este recurso">
            
            <!-- Encabezado de la tarjeta con icono de formato y categoría -->
            <div class="card-top-strip">
              <div class="file-icon-wrapper" [ngClass]="'icon-' + resource.fileType">
                <!-- Icono SVG según el tipo de archivo -->
                @if (resource.fileType === 'pdf') {
                  <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                    <polyline points="14 2 14 8 20 8"/>
                    <line x1="16" y1="13" x2="8" y2="13"/>
                    <line x1="16" y1="17" x2="8" y2="17"/>
                    <polyline points="10 9 9 9 8 9"/>
                  </svg>
                } @else if (resource.fileType === 'image') {
                  <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
                    <circle cx="8.5" cy="8.5" r="1.5"/>
                    <polyline points="21 15 16 10 5 21"/>
                  </svg>
                } @else {
                  <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                    <polyline points="14 2 14 8 20 8"/>
                    <line x1="16" y1="13" x2="8" y2="13"/>
                    <line x1="16" y1="17" x2="8" y2="17"/>
                  </svg>
                }
              </div>

              <span class="ion-badge resource-category-badge">
                {{ resource.category }}
              </span>
            </div>

            <!-- Cuerpo de la tarjeta / Banner compacta -->
            <div class="card-main-content">
              <h3 class="resource-title ion-card-title">{{ resource.title }}</h3>
              <p class="resource-desc">{{ resource.description }}</p>
            </div>

            <!-- Información del autor/rol y botón de ver -->
            <div class="card-author-footer">
              <div class="author-info">
                <span class="uploader-role-tag">
                  <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                    <circle cx="12" cy="7" r="4"/>
                  </svg>
                  {{ resource.uploadedByRole }}
                </span>
                <span class="uploader-name" *if="resource.uploaderName">
                  {{ resource.uploaderName }}
                </span>
              </div>

              <button class="view-btn-cta">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                  <circle cx="12" cy="12" r="3"/>
                </svg>
                <span>Visualizar</span>
              </button>
            </div>

          </div>
        } @empty {
          <div class="empty-state">
            <h3>No se encontraron recursos</h3>
            <p>Intenta con otros términos de búsqueda o selecciona otra categoría.</p>
          </div>
        }
      </div>

      <!-- VISOR DE RECURSOS EMERGENTE (ION-MODAL) CON PROTECCIÓN DE DESCARGA -->
      @if (selectedResource) {
        <div 
          class="modal-backdrop ion-modal-backdrop" 
          (click)="closeModal()"
          (contextmenu)="$event.preventDefault()">
          
          <div 
            class="modal-content resource-viewer-modal ion-modal" 
            (click)="$event.stopPropagation()"
            (contextmenu)="$event.preventDefault()">
            
            <!-- Encabezado del Modal sin botones de descarga ni abrir en nueva pestaña -->
            <div class="viewer-modal-header">
              <div class="header-details">
                <div class="header-badges">
                  <span class="ion-badge resource-category-badge">
                    {{ selectedResource.category }}
                  </span>
                  <span class="role-pill">
                    Subido por: {{ selectedResource.uploadedByRole }}
                  </span>
                </div>
                <h2 class="modal-resource-title">{{ selectedResource.title }}</h2>
              </div>

              <!-- BOTÓN ÚNICO Y CLARO DE CERRAR EL MODAL -->
              <button 
                class="btn-close-modal" 
                (click)="closeModal()" 
                title="Cerrar visor de recurso">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <line x1="18" y1="6" x2="6" y2="18"/>
                  <line x1="6" y1="6" x2="18" y2="18"/>
                </svg>
                <span>Cerrar</span>
              </button>
            </div>

            <!-- ADVERTENCIA INSTITUCIONAL DE PROTECCIÓN DE CONTENIDO -->
            <div class="protection-notice-bar">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
              </svg>
              <span>Lectura Protegida: Este documento es exclusivamente para consulta en pantalla. La descarga y copia directa están deshabilitadas.</span>
            </div>

            <!-- VISOR EMBEDIDO (IFRAME / VISTA PREVIA) CON CAPA DE PROTECCIÓN ANTI-DESCARGA -->
            <div 
              class="viewer-container protected-viewer"
              (contextmenu)="$event.preventDefault()"
              (selectstart)="$event.preventDefault()"
              (dragstart)="$event.preventDefault()">
              
              <!-- CAPA/OVERLAY TRANSPARENTE DE PROTECCIÓN CSS QUE BLOQUEA ACCIONES DE CLIC DERECHO / DRAG -->
              <div class="protection-overlay" (contextmenu)="$event.preventDefault()"></div>

              @if (selectedResource.fileType === 'pdf') {
                <iframe 
                  [src]="sanitizedUrl" 
                  class="embedded-iframe protected-media" 
                  frameborder="0"
                  (contextmenu)="$event.preventDefault()">
                </iframe>
              } @else if (selectedResource.fileType === 'image') {
                <div class="image-viewer-box">
                  <img 
                    [src]="selectedResource.fileUrl" 
                    [alt]="selectedResource.title"
                    class="protected-img protected-media"
                    (contextmenu)="$event.preventDefault()"
                    (dragstart)="$event.preventDefault()" />
                </div>
              } @else {
                <iframe 
                  [src]="sanitizedUrl" 
                  class="embedded-iframe protected-media" 
                  frameborder="0"
                  (contextmenu)="$event.preventDefault()">
                </iframe>
              }
            </div>

            <!-- PIE DE PÁGINA DEL MODAL CON BOTÓN DE CIERRE -->
            <div class="viewer-modal-footer">
              <span class="resource-file-meta">Tamaño: {{ selectedResource.size }} • Publicado: {{ selectedResource.date }}</span>
              <button class="btn-close-footer" (click)="closeModal()">
                Cerrar Visor
              </button>
            </div>

          </div>
        </div>
      @}

    </div>
  `,
  styles: [`
    /* ESTILOS ESPECÍFICOS PARA EL MÓDULO DE RECURSOS PÚBLICOS */
    
    .resources-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
      gap: 1.5rem;
      margin-top: 1.5rem;
    }

    .resource-card.ion-card {
      background: #ffffff;
      border: 1.5px solid var(--border-color);
      border-radius: 16px;
      padding: 1.25rem;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      transition: all 0.25s cubic-bezier(0.16, 1, 0.3, 1);
      cursor: pointer;
      box-shadow: var(--shadow-sm);
      position: relative;
      overflow: hidden;
    }

    .resource-card.ion-card:hover {
      transform: translateY(-4px);
      border-color: var(--primary-blue);
      box-shadow: var(--shadow-lg);
    }

    .card-top-strip {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 0.85rem;
    }

    .file-icon-wrapper {
      width: 42px;
      height: 42px;
      border-radius: 10px;
      display: flex;
      align-items: center;
      justify-content: center;
      background: var(--primary-blue-light);
      color: var(--primary-blue);
    }

    .file-icon-wrapper.icon-pdf {
      background: var(--accent-red-light);
      color: var(--accent-red);
    }

    .file-icon-wrapper.icon-image {
      background: #ecfdf5;
      color: #047857;
    }

    .file-icon-wrapper.icon-doc {
      background: #eff6ff;
      color: #1d4ed8;
    }

    .resource-category-badge.ion-badge {
      font-size: 0.75rem;
      font-weight: 700;
      padding: 0.3rem 0.7rem;
      border-radius: 20px;
      background: #f1f5f9;
      color: var(--primary-blue);
      border: 1px solid var(--primary-blue-border);
      text-transform: uppercase;
      letter-spacing: 0.03em;
    }

    .card-main-content {
      margin-bottom: 1.25rem;
      flex: 1;
    }

    .resource-title.ion-card-title {
      font-size: 1.05rem;
      font-weight: 800;
      color: var(--primary-blue);
      margin-bottom: 0.5rem;
      line-height: 1.35;
    }

    .resource-desc {
      font-size: 0.85rem;
      color: var(--text-muted);
      line-height: 1.45;
      display: -webkit-box;
      -webkit-line-clamp: 3;
      -webkit-box-orient: vertical;
      overflow: hidden;
    }

    .card-author-footer {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding-top: 0.85rem;
      border-top: 1px solid #f1f5f9;
      gap: 0.5rem;
    }

    .author-info {
      display: flex;
      flex-direction: column;
      gap: 0.15rem;
    }

    .uploader-role-tag {
      font-size: 0.775rem;
      font-weight: 700;
      color: var(--primary-blue);
      display: flex;
      align-items: center;
      gap: 0.25rem;
    }

    .uploader-name {
      font-size: 0.725rem;
      color: var(--text-muted);
    }

    .view-btn-cta {
      background: var(--primary-blue);
      color: #ffffff;
      border: none;
      padding: 0.5rem 0.9rem;
      border-radius: 8px;
      font-size: 0.825rem;
      font-weight: 700;
      display: flex;
      align-items: center;
      gap: 0.35rem;
      cursor: pointer;
      transition: background 0.2s ease;
    }

    .view-btn-cta:hover {
      background: var(--primary-blue-dark);
    }

    /* ESTILOS DEL MODAL DE VISUALIZACIÓN PROTEGIDA (ION-MODAL) */

    .resource-viewer-modal.ion-modal {
      max-width: 900px;
      width: 92%;
      max-height: 92vh;
      display: flex;
      flex-direction: column;
      background: #ffffff;
      border-radius: 20px;
      overflow: hidden;
      border: 2px solid var(--primary-blue);
      box-shadow: 0 25px 50px -12px rgba(14, 31, 135, 0.35);
      user-select: none;
      -webkit-user-select: none;
    }

    .viewer-modal-header {
      padding: 1.25rem 1.5rem;
      background: #ffffff;
      border-bottom: 1.5px solid var(--border-color);
      display: flex;
      align-items: flex-start;
      justify-content: space-between;
      gap: 1rem;
    }

    .header-details {
      display: flex;
      flex-direction: column;
      gap: 0.4rem;
    }

    .header-badges {
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }

    .role-pill {
      font-size: 0.75rem;
      font-weight: 700;
      color: var(--accent-red);
      background: var(--accent-red-light);
      padding: 0.2rem 0.6rem;
      border-radius: 12px;
    }

    .modal-resource-title {
      font-size: 1.25rem;
      font-weight: 800;
      color: var(--primary-blue);
      line-height: 1.3;
      margin: 0;
    }

    .btn-close-modal {
      background: var(--accent-red-light);
      color: var(--accent-red);
      border: 1.5px solid var(--accent-red-border);
      padding: 0.45rem 0.95rem;
      border-radius: 8px;
      font-weight: 700;
      font-size: 0.85rem;
      cursor: pointer;
      display: flex;
      align-items: center;
      gap: 0.35rem;
      transition: all 0.2s ease;
      flex-shrink: 0;
    }

    .btn-close-modal:hover {
      background: var(--accent-red);
      color: white;
    }

    .protection-notice-bar {
      background: #fff7ed;
      border-bottom: 1px solid #fed7aa;
      color: #9a3412;
      font-size: 0.785rem;
      font-weight: 600;
      padding: 0.6rem 1.5rem;
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }

    /* CONTENEDOR DEL VISOR EMBEDIDO CON REGLAS DE PROTECCIÓN DE DESCARGA */
    .viewer-container.protected-viewer {
      position: relative;
      flex: 1;
      min-height: 480px;
      max-height: 65vh;
      background: #0f172a;
      display: flex;
      align-items: center;
      justify-content: center;
      overflow: hidden;
      user-select: none;
      -webkit-user-select: none;
      -webkit-touch-callout: none;
    }

    /* OVERLAY TRANSPARENTE QUE PREVIENE CLIC DERECHO Y ARRASTRE */
    .protection-overlay {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      z-index: 5;
      pointer-events: none;
      user-select: none;
    }

    .embedded-iframe.protected-media {
      width: 100%;
      height: 100%;
      min-height: 480px;
      border: none;
      user-select: none;
      pointer-events: auto;
    }

    .image-viewer-box {
      width: 100%;
      height: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 1rem;
      overflow: auto;
    }

    .protected-img.protected-media {
      max-width: 100%;
      max-height: 60vh;
      object-fit: contain;
      border-radius: 8px;
      box-shadow: 0 10px 25px rgba(0, 0, 0, 0.5);
      user-select: none;
      -webkit-user-drag: none;
      pointer-events: auto;
    }

    .viewer-modal-footer {
      padding: 0.85rem 1.5rem;
      background: #ffffff;
      border-top: 1.5px solid var(--border-color);
      display: flex;
      align-items: center;
      justify-content: space-between;
    }

    .resource-file-meta {
      font-size: 0.8rem;
      color: var(--text-muted);
      font-weight: 600;
    }

    .btn-close-footer {
      background: var(--primary-blue);
      color: white;
      border: none;
      padding: 0.5rem 1.25rem;
      border-radius: 8px;
      font-weight: 700;
      font-size: 0.85rem;
      cursor: pointer;
    }

    .btn-close-footer:hover {
      background: var(--primary-blue-dark);
    }
  `]
})
export class ResourcesComponent implements OnInit {
  // Búsqueda en texto libre
  searchQuery: string = '';
  // Filtro por tipo de archivo seleccionable ('all', 'pdf', 'image', 'doc')
  selectedType: string = 'all';

  // Almacena el recurso seleccionado para visualizarlo en el modal
  selectedResource: ResourceItem | null = null;
  // URL sanitizada para el iframe
  sanitizedUrl: SafeResourceUrl | null = null;

  constructor(
    public resourceService: ResourceService,
    private sanitizer: DomSanitizer
  ) {}

  ngOnInit(): void {
    // Carga los recursos del servicio
    this.resourceService.loadResources().subscribe();
  }

  // Lista de todos los recursos
  get resourcesList(): ResourceItem[] {
    return this.resourceService.resources();
  }

  // Conteo de recursos PDF
  get pdfCount(): number {
    return this.resourcesList.filter(r => r.fileType === 'pdf').length;
  }

  // Conteo de recursos de tipo imagen
  get imageCount(): number {
    return this.resourcesList.filter(r => r.fileType === 'image').length;
  }

  // Recursos filtrados según búsqueda y tipo seleccionado
  get filteredResources(): ResourceItem[] {
    return this.resourcesList.filter(item => {
      const matchesType = this.selectedType === 'all' || item.fileType === this.selectedType;
      const q = this.searchQuery.toLowerCase().trim();
      const matchesQuery = !q || 
        item.title.toLowerCase().includes(q) ||
        item.category.toLowerCase().includes(q) ||
        item.uploadedByRole.toLowerCase().includes(q) ||
        (item.uploaderName && item.uploaderName.toLowerCase().includes(q));
      
      return matchesType && matchesQuery;
    });
  }

  // Abre la ventana emergente (modal) con el visor del recurso
  openResourceModal(resource: ResourceItem): void {
    this.selectedResource = resource;
    // Sanitiza la URL para permitir su renderizado en iframe sin restricciones de Angular
    this.sanitizedUrl = this.sanitizer.bypassSecurityTrustResourceUrl(resource.fileUrl);
  }

  // Cierra el modal de previsualización
  closeModal(): void {
    this.selectedResource = null;
    this.sanitizedUrl = null;
  }
}
