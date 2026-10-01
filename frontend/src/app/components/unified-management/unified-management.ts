import { Component, OnInit, signal, computed, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { EventService } from '../../services/event.service';
import { AuthService } from '../../services/auth.service';
import { EventItem } from '../../models/event.model';
import { Place } from '../../models/place.model';
import { User } from '../../models/user.model';
import { EventFormComponent } from '../event-form/event-form';
import { UserFormComponent } from '../user-form/user-form';
import { ResourceService } from '../../services/resource.service';
import { ResourceItem } from '../../models/resource.model';

@Component({
  selector: 'app-unified-management',
  standalone: true,
  imports: [CommonModule, FormsModule, EventFormComponent, UserFormComponent],
  templateUrl: './unified-management.html',
  styleUrl: './unified-management.css'
})
// Componente del panel de gestión unificada para eventos, usuarios y lugares
export class UnifiedManagementComponent implements OnInit {
  // Pestaña activa ('events', 'places', 'users' o 'resources')
  activeTab: 'events' | 'places' | 'users' | 'resources' = 'events';

  // Filtros de eventos
  searchEventQuery: string = '';
  filterEventModality: string = 'Todas';

  // Filtros de usuarios
  searchUserQuery: string = '';

  // Filtro y datos para gestión de recursos locales
  searchResourceQuery: string = '';
  isUploadModalOpen: boolean = false;
  isUploading: boolean = false;
  selectedUploadFile: File | null = null;
  newResourceTitle: string = '';
  newResourceCategory: string = 'Reglamento / PDF';
  newResourceDescription: string = '';
  newResourceRole: 'Bienestar' | 'Lider' | 'Admin' = 'Bienestar';

  // Datos reactivos para lugares y usuarios
  places = signal<Place[]>([]);
  users = signal<User[]>([]);

  // Estados de modales y elementos en edición
  isEventModalOpen: boolean = false;
  selectedEventToEdit: EventItem | null = null;

  isUserModalOpen: boolean = false;
  selectedUserToEdit: User | null = null;

  // Mensajes de retroalimentación
  actionSuccessMessage: string | null = null;
  actionErrorMessage: string | null = null;

  // Inyecta los servicios necesarios
  constructor(
    public eventService: EventService,
    public authService: AuthService,
    public resourceService: ResourceService,
    private cdr: ChangeDetectorRef
  ) {}

  // Inicializa cargando todos los catálogos
  ngOnInit(): void {
    this.refreshAll();
  }

  refreshAll(): void {
    this.eventService.loadEvents().subscribe();
    this.resourceService.loadResources().subscribe();
    this.eventService.loadPlaces().subscribe({
      next: (data) => this.places.set(data)
    });

    if (this.isAdmin()) {
      this.loadUsers();
    }
  }

  loadUsers(): void {
    this.authService.getUsers().subscribe({
      next: (data) => this.users.set(data),
      error: () => {}
    });
  }

  isAdmin(): boolean {
    const role = this.authService.userRole();
    return role?.toLowerCase() === 'admin';
  }

  // Verifica si el evento pertenece al usuario actual (RF11)
  isMyEvent(event: EventItem): boolean {
    const current = this.authService.currentUser();
    if (!current) return false;
    const currentUserId = current.id_usuario || Number(current.id);
    return Number(event.id_responsable) === Number(currentUserId);
  }

  // Control Estricto de Propiedad (Ownership & RBAC):
  // Admin puede editar/eliminar todo. Líder y Bienestar solo sus propios eventos.
  canManage(event: EventItem): boolean {
    if (this.isAdmin()) return true;
    return this.isMyEvent(event);
  }

  get filteredEvents(): EventItem[] {
    let list = this.eventService.events();

    if (this.filterEventModality !== 'Todas') {
      list = list.filter(
        e => (e.modalidad || e.modality || '').toLowerCase() === this.filterEventModality.toLowerCase()
      );
    }

    if (this.searchEventQuery.trim() !== '') {
      const q = this.searchEventQuery.toLowerCase().trim();
      list = list.filter(e =>
        (e.nombre || e.title || '').toLowerCase().includes(q) ||
        (e.descripcion || e.description || '').toLowerCase().includes(q) ||
        (e.organizer || '').toLowerCase().includes(q)
      );
    }

    return list;
  }

  get filteredUsers(): User[] {
    let list = this.users();
    if (this.searchUserQuery.trim() !== '') {
      const q = this.searchUserQuery.toLowerCase().trim();
      list = list.filter(u =>
        (u.nombre || u.name || '').toLowerCase().includes(q) ||
        (u.apellido || '').toLowerCase().includes(q) ||
        (u.correo || u.email || '').toLowerCase().includes(q) ||
        (u.rol || u.role || '').toLowerCase().includes(q)
      );
    }
    return list;
  }

  // -------------------------
  // GESTIÓN DE EVENTOS
  // -------------------------
  openCreateEventModal(): void {
    this.selectedEventToEdit = null;
    this.isEventModalOpen = true;
  }

  openEditEventModal(event: EventItem): void {
    this.selectedEventToEdit = event;
    this.isEventModalOpen = true;
  }

  closeEventModal(): void {
    this.isEventModalOpen = false;
    this.selectedEventToEdit = null;
  }

  onEventSaved(savedEvent: EventItem): void {
    this.closeEventModal();
    this.showSuccess('Actividad guardada exitosamente en el cronograma institucional.');
    this.eventService.loadEvents().subscribe();
  }

  confirmDeleteEvent(event: EventItem): void {
    const title = event.nombre || event.title;
    if (confirm(`¿Estás seguro de que deseas eliminar la actividad "${title}"?`)) {
      const id = event.id_evento || event.id;
      this.eventService.deleteEvent(id).subscribe({
        next: () => {
          this.showSuccess(`Actividad "${title}" eliminada satisfactoriamente.`);
        },
        error: (err) => {
          this.showError(err.error?.error || 'Error al eliminar la actividad.');
        }
      });
    }
  }

  // -------------------------
  // GESTIÓN DE USUARIOS (RF9)
  // -------------------------
  openCreateUserModal(): void {
    this.selectedUserToEdit = null;
    this.isUserModalOpen = true;
  }

  openEditUserModal(user: User): void {
    this.selectedUserToEdit = user;
    this.isUserModalOpen = true;
  }

  closeUserModal(): void {
    this.isUserModalOpen = false;
    this.selectedUserToEdit = null;
  }

  onUserSaved(user: User): void {
    this.closeUserModal();
    this.showSuccess('Usuario guardado exitosamente.');
    this.loadUsers();
  }

  toggleUserStatus(user: User): void {
    const id = user.id_usuario || Number(user.id);
    const newStatus = !user.estado;
    this.authService.toggleUserStatus(id, newStatus).subscribe({
      next: () => {
        this.showSuccess(`Estado del usuario ${newStatus ? 'activado' : 'desactivado'} con éxito.`);
        this.loadUsers();
      },
      error: (err) => {
        this.showError(err.error?.error || 'Error al cambiar estado del usuario.');
      }
    });
  }

  confirmDeleteUser(user: User): void {
    const name = user.nombre ? `${user.nombre} ${user.apellido || ''}` : user.name;
    if (confirm(`¿Eliminar al usuario "${name}" del sistema? Esta acción no se puede deshacer.`)) {
      const id = user.id_usuario || Number(user.id);
      this.authService.deleteUser(id).subscribe({
        next: () => {
          this.showSuccess(`Usuario "${name}" eliminado.`);
          this.loadUsers();
        },
        error: (err) => {
          this.showError(err.error?.error || 'Error al eliminar usuario.');
        }
      });
    }
  }

  get filteredResources(): ResourceItem[] {
    const list = this.resourceService.resources();
    if (!this.searchResourceQuery.trim()) {
      return list;
    }
    const q = this.searchResourceQuery.toLowerCase().trim();
    return list.filter(r =>
      r.title.toLowerCase().includes(q) ||
      r.category.toLowerCase().includes(q) ||
      r.uploadedByRole.toLowerCase().includes(q) ||
      (r.uploaderName && r.uploaderName.toLowerCase().includes(q))
    );
  }

  // -------------------------
  // GESTIÓN DE RECURSOS / ARCHIVOS (LOCALES)
  // -------------------------
  openUploadModal(): void {
    this.selectedUploadFile = null;
    this.newResourceTitle = '';
    this.newResourceCategory = 'Reglamento / PDF';
    this.newResourceDescription = '';
    
    // Autoselecciona el rol del usuario conectado (Bienestar, Lider, Admin)
    const current = this.authService.currentUser();
    const role = (current?.role || current?.rol || 'Bienestar') as 'Bienestar' | 'Lider' | 'Admin';
    if (['Bienestar', 'Lider', 'Admin'].includes(role)) {
      this.newResourceRole = role;
    } else {
      this.newResourceRole = 'Bienestar';
    }

    this.isUploadModalOpen = true;
  }

  closeUploadModal(): void {
    this.isUploadModalOpen = false;
    this.selectedUploadFile = null;
    this.isUploading = false;
  }

  onFileSelected(event: any): void {
    const file = event.target?.files?.[0];
    if (file) {
      this.selectedUploadFile = file;
      if (!this.newResourceTitle) {
        const nameWithoutExt = file.name.replace(/\.[^/.]+$/, "");
        this.newResourceTitle = nameWithoutExt.replace(/[-_]/g, ' ');
      }
    }
  }

  submitUploadResource(): void {
    if (!this.selectedUploadFile) {
      this.showError('Por favor selecciona un archivo para subir.');
      return;
    }
    if (!this.newResourceTitle.trim()) {
      this.showError('El título del recurso es obligatorio.');
      return;
    }

    this.isUploading = true;
    const formData = new FormData();
    formData.append('file', this.selectedUploadFile);
    formData.append('title', this.newResourceTitle.trim());
    formData.append('category', this.newResourceCategory);
    formData.append('description', this.newResourceDescription.trim());
    formData.append('uploadedByRole', this.newResourceRole);

    const currentUser = this.authService.currentUser();
    const uploaderName = currentUser?.nombre 
      ? `${currentUser.nombre} ${currentUser.apellido || ''}`.trim() 
      : (currentUser?.name || `Rol: ${this.newResourceRole}`);
    formData.append('uploaderName', uploaderName);

    this.resourceService.uploadResource(formData).subscribe({
      next: (savedResource) => {
        this.isUploading = false;
        this.closeUploadModal();
        this.showSuccess(`¡Archivo "${savedResource.title}" subido y guardado exitosamente en el servidor!`);
        this.resourceService.loadResources().subscribe();
      },
      error: (err) => {
        this.isUploading = false;
        console.error('Error al subir recurso:', err);
        this.showError(err.error?.error || 'Error al conectar con el servidor para subir el archivo.');
      }
    });
  }

  private showSuccess(msg: string): void {
    this.actionSuccessMessage = msg;
    this.actionErrorMessage = null;
    this.cdr.markForCheck();
    setTimeout(() => {
      this.actionSuccessMessage = null;
      this.cdr.markForCheck();
    }, 4000);
  }

  private showError(msg: string): void {
    this.actionErrorMessage = msg;
    this.actionSuccessMessage = null;
    this.cdr.markForCheck();
    setTimeout(() => {
      this.actionErrorMessage = null;
      this.cdr.markForCheck();
    }, 5000);
  }
}
