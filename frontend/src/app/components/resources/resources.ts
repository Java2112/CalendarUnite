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
  templateUrl: './resources.html',
  styleUrl: './resources.css'
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
