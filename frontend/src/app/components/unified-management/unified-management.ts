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

@Component({
  selector: 'app-unified-management',
  standalone: true,
  imports: [CommonModule, FormsModule, EventFormComponent, UserFormComponent],
  template: `
    <div class="management-container">
      
      <!-- Encabezado del Módulo de Gestión -->
      <div class="management-header">
        <div class="title-area">
          <h1>
            <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
            </svg>
            Panel de Gestión Unificada
          </h1>
          <p>
            Plataforma centralizada para Líderes Estudiantiles, Coordinación de Bienestar y Administradores.
          </p>
        </div>

        <div class="header-actions">
          @if (activeTab === 'events') {
            <button class="btn-cu-primary" (click)="openCreateEventModal()">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
              <span>Nueva Actividad</span>
            </button>
          } @else if (activeTab === 'users' && isAdmin()) {
            <button class="btn-cu-primary" (click)="openCreateUserModal()">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
              <span>Nuevo Usuario</span>
            </button>
          }
        </div>
      </div>

      <!-- Pestañas de Navegación del Módulo -->
      <div class="management-tabs">
        <button
          class="tab-btn"
          [class.active]="activeTab === 'events'"
          (click)="activeTab = 'events'"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect width="18" height="18" x="3" y="4" rx="2" ry="2"/><line x1="16" x2="16" y1="2" y2="6"/><line x1="8" x2="8" y1="2" y2="6"/><line x1="3" x2="21" y1="10" y2="10"/></svg>
          <span>Gestión de Actividades</span>
          <span class="badge-pill">{{ eventService.events().length }}</span>
        </button>

        <button
          class="tab-btn"
          [class.active]="activeTab === 'places'"
          (click)="activeTab = 'places'"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>
          <span>Catálogo de Lugares (Campus)</span>
          <span class="badge-pill">{{ places().length }}</span>
        </button>

        @if (isAdmin()) {
          <button
            class="tab-btn"
            [class.active]="activeTab === 'users'"
            (click)="activeTab = 'users'"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
            <span>Gestión de Usuarios (Admin)</span>
            <span class="badge-pill">{{ users().length }}</span>
          </button>
        }
      </div>

      <!-- Notificación o Alerta de Éxito / Error -->
      @if (actionSuccessMessage) {
        <div style="background:#dcfce7; border:1px solid #86efac; color:#15803d; padding:12px 16px; border-radius:8px; margin-bottom:20px; font-weight:600; display:flex; align-items:center; gap:8px;">
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
          <span>{{ actionSuccessMessage }}</span>
        </div>
      }
      @if (actionErrorMessage) {
        <div style="background:#fee2e2; border:1px solid #f87171; color:#991b1b; padding:12px 16px; border-radius:8px; margin-bottom:20px; font-weight:600; display:flex; align-items:center; gap:8px;">
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
          <span>{{ actionErrorMessage }}</span>
        </div>
      }

      <!-- ==================================================================== -->
      <!-- PESTAÑA 1: GESTIÓN DE EVENTOS / ACTIVIDADES                          -->
      <!-- ==================================================================== -->
      @if (activeTab === 'events') {
        <div class="tab-content-area">
          
          <!-- Filtros de la tabla -->
          <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:16px; margin-bottom:16px;">
            <div style="display:flex; gap:10px; align-items:center;">
              <input
                type="text"
                [(ngModel)]="searchEventQuery"
                placeholder="Buscar actividades..."
                class="form-input"
                style="padding:8px 14px; border:1.5px solid var(--border-color); border-radius:6px; font-size:14px; min-width:260px;"
              />
              <select
                [(ngModel)]="filterEventModality"
                class="form-input"
                style="padding:8px 14px; border:1.5px solid var(--border-color); border-radius:6px; font-size:14px; background:white;"
              >
                <option value="Todas">Todas las Modalidades</option>
                <option value="Presencial">Presencial</option>
                <option value="Virtual">Virtual</option>
                <option value="Nocturna">Jornada Nocturna</option>
              </select>
            </div>

            <div style="font-size:13px; color:var(--text-muted);">
              Mostrando <strong>{{ filteredEvents.length }}</strong> actividades
            </div>
          </div>

          <!-- Tabla de Actividades con Ownership RBAC -->
          <div class="table-responsive">
            <table class="cu-table">
              <thead>
                <tr>
                  <th>Actividad</th>
                  <th>Modalidad</th>
                  <th>Fecha & Horario</th>
                  <th>Lugar</th>
                  <th>Responsable / Propiedad</th>
                  <th>Cupos</th>
                  <th style="text-align:right;">Acciones</th>
                </tr>
              </thead>
              <tbody>
                @for (event of filteredEvents; track event.id_evento || event.id) {
                  <tr>
                    <!-- Nombre y Banner -->
                    <td>
                      <div style="display:flex; align-items:center; gap:12px;">
                        <img
                          [src]="event.banner_url || event.imageUrl || 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&w=100&q=80'"
                          alt="Banner"
                          style="width:48px; height:48px; border-radius:6px; object-fit:cover; border:1px solid var(--border-color);"
                        />
                        <div>
                          <strong style="color:var(--primary-blue-dark); font-size:14px; display:block;">
                            {{ event.nombre || event.title }}
                          </strong>
                          <span style="font-size:12px; color:var(--text-muted);">
                            {{ event.category || 'Bienestar' }}
                          </span>
                        </div>
                      </div>
                    </td>

                    <!-- Modalidad -->
                    <td>
                      <span class="role-badge" [ngClass]="(event.modalidad || event.modality || '').toLowerCase()">
                        {{ event.modalidad || event.modality }}
                      </span>
                    </td>

                    <!-- Fecha y Horario -->
                    <td>
                      <div style="font-size:13px; display:flex; flex-direction:column; gap:4px;">
                        <div style="display:flex; align-items:center; gap:6px;">
                          <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
                          <span>{{ event.fecha_inicio || event.date }}</span>
                        </div>
                        <div style="color:var(--text-muted); font-size:12px; display:flex; align-items:center; gap:6px;">
                          <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                          <span>{{ event.time || (event.hora_inicio + ' - ' + event.hora_fin) }}</span>
                        </div>
                      </div>
                    </td>

                    <!-- Lugar -->
                    <td>
                      <span style="font-size:13px; color:var(--text-dark);">
                        {{ event.location || (event.lugar ? event.lugar.nombre : 'Por definir') }}
                      </span>
                    </td>

                    <!-- Responsable & Ownership Badge (RF11) -->
                    <td>
                      <div>
                        <span style="font-size:13px; font-weight:600; display:block;">
                          {{ event.organizer || (event.responsable ? (event.responsable.nombre + ' ' + event.responsable.apellido) : 'Institucional') }}
                        </span>
                        
                        <!-- Badge de Pertenencia -->
                        @if (isMyEvent(event)) {
                          <span class="ownership-badge ownership-mine">
                            Creado por mí
                          </span>
                        } @else {
                          <span class="ownership-badge ownership-other">
                            Organizado por otro
                          </span>
                        }
                      </div>
                    </td>

                    <!-- Cupos -->
                    <td>
                      <span style="font-weight:700; color:var(--primary-blue);">
                        {{ event.availableSpots }} / {{ event.totalSpots }}
                      </span>
                    </td>

                    <!-- Acciones con RBAC estricto -->
                    <td style="text-align:right;">
                      <div class="table-actions" style="justify-content:flex-end;">
                        @if (canManage(event)) {
                          <button
                            class="btn-cu-outline"
                            style="padding:6px 12px; font-size:13px;"
                            (click)="openEditEventModal(event)"
                            title="Editar actividad"
                          >
                            Editar
                          </button>
                          <button
                            class="btn-cu-danger-outline"
                            style="padding:6px 12px; font-size:13px;"
                            (click)="confirmDeleteEvent(event)"
                            title="Eliminar actividad"
                          >
                            Eliminar
                          </button>
                        } @else {
                          <span
                            style="font-size:12px; color:var(--text-muted); font-style:italic; background:#f1f5f9; padding:4px 8px; border-radius:4px;"
                            title="Solo el usuario responsable o un Administrador pueden modificar este evento."
                          >
                            Solo Lectura
                          </span>
                        }
                      </div>
                    </td>
                  </tr>
                }
                @if (filteredEvents.length === 0) {
                  <tr>
                    <td colspan="7" style="text-align:center; padding:32px; color:var(--text-muted);">
                      No se encontraron actividades que coincidan con los filtros aplicados.
                    </td>
                  </tr>
                }
              </tbody>
            </table>
          </div>
        </div>
      }

      <!-- ==================================================================== -->
      <!-- PESTAÑA 2: CATÁLOGO DE LUGARES (CAMPUS)                              -->
      <!-- ==================================================================== -->
      @if (activeTab === 'places') {
        <div class="tab-content-area">
          <div style="margin-bottom:16px;">
            <p style="color:var(--text-muted); font-size:14px;">
              Espacios físicos e instalaciones digitales registrados en la base de datos (Tabla <code>public.lugar</code>) para albergar eventos.
            </p>
          </div>

          <div style="display:grid; grid-template-columns:repeat(auto-fill, minmax(280px, 1fr)); gap:20px;">
            @for (place of places(); track place.id_lugar) {
              <div class="cu-card">
                <div style="display:flex; align-items:center; gap:10px; margin-bottom:12px;">
                  <div style="background:var(--primary-blue-light); color:var(--primary-blue); padding:10px; border-radius:8px;">
                    <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>
                  </div>
                  <div>
                    <strong style="color:var(--primary-blue-dark); font-size:16px; display:block;">
                      {{ place.nombre }}
                    </strong>
                    <span style="font-size:12px; color:var(--text-muted);">ID Lugar: #{{ place.id_lugar }}</span>
                  </div>
                </div>

                <div style="font-size:14px; color:var(--text-dark); display:flex; flex-direction:column; gap:6px;">
                  <div><strong>Edificio:</strong> {{ place.edificio || 'Campus General' }}</div>
                  <div><strong>Aula / Espacio:</strong> {{ place.aula || 'General' }}</div>
                  <div style="color:var(--text-muted); font-size:13px; display:flex; align-items:center; gap:6px;">
                    <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
                    <span>{{ place.direccion || 'Sede Principal' }}</span>
                  </div>
                </div>
              </div>
            }
          </div>
        </div>
      }

      <!-- ==================================================================== -->
      <!-- PESTAÑA 3: GESTIÓN DE USUARIOS (EXCLUSIVO ADMINISTRADOR - RF9)       -->
      <!-- ==================================================================== -->
      @if (activeTab === 'users' && isAdmin()) {
        <div class="tab-content-area">
          <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:16px; margin-bottom:16px;">
            <input
              type="text"
              [(ngModel)]="searchUserQuery"
              placeholder="Buscar usuarios por nombre, correo o rol..."
              class="form-input"
              style="padding:8px 14px; border:1.5px solid var(--border-color); border-radius:6px; font-size:14px; min-width:280px;"
            />
            <div style="font-size:13px; color:var(--text-muted);">
              Total usuarios: <strong>{{ filteredUsers.length }}</strong>
            </div>
          </div>

          <div class="table-responsive">
            <table class="cu-table">
              <thead>
                <tr>
                  <th>Usuario</th>
                  <th>Correo Electrónico</th>
                  <th>Teléfono</th>
                  <th>Rol Institucional</th>
                  <th>Estado</th>
                  <th style="text-align:right;">Acciones</th>
                </tr>
              </thead>
              <tbody>
                @for (user of filteredUsers; track user.id_usuario || user.id) {
                  <tr>
                    <td>
                      <div style="display:flex; align-items:center; gap:10px;">
                        <div class="user-avatar-circle" [title]="user.nombre ? (user.nombre + ' ' + (user.apellido || '')) : user.name">
                          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/>
                            <circle cx="12" cy="7" r="4"/>
                          </svg>
                        </div>
                        <div>
                          <strong style="color:var(--text-dark); display:block;">
                            {{ user.nombre ? (user.nombre + ' ' + (user.apellido || '')) : user.name }}
                          </strong>
                          <span style="font-size:12px; color:var(--text-muted);">ID: #{{ user.id_usuario || user.id }}</span>
                        </div>
                      </div>
                    </td>

                    <td>{{ user.correo || user.email }}</td>
                    <td>{{ user.telefono || 'Sin teléfono' }}</td>

                    <td>
                      <span class="role-badge" [ngClass]="(user.rol || user.role || '').toLowerCase()">
                        {{ user.rol || user.role }}
                      </span>
                    </td>

                    <td>
                      <span class="status-badge" [ngClass]="user.estado ? 'status-active' : 'status-inactive'">
                        {{ user.estado ? 'Activo' : 'Inactivo' }}
                      </span>
                    </td>

                    <td style="text-align:right;">
                      <div class="table-actions" style="justify-content:flex-end;">
                        <button
                          class="btn-cu-outline"
                          style="padding:6px 12px; font-size:13px;"
                          (click)="openEditUserModal(user)"
                          title="Editar usuario"
                        >
                          Editar
                        </button>
                        <button
                          class="btn-cu-outline"
                          style="padding:6px 12px; font-size:13px;"
                          (click)="toggleUserStatus(user)"
                          [title]="user.estado ? 'Desactivar usuario' : 'Activar usuario'"
                        >
                          {{ user.estado ? 'Desactivar' : 'Activar' }}
                        </button>
                        <button
                          class="btn-cu-danger-outline"
                          style="padding:6px 12px; font-size:13px;"
                          (click)="confirmDeleteUser(user)"
                          title="Eliminar usuario"
                        >
                          Eliminar
                        </button>
                      </div>
                    </td>
                  </tr>
                }
              </tbody>
            </table>
          </div>
        </div>
      }

    </div>

    <!-- Modales de Creación y Edición -->
    @if (isEventModalOpen) {
      <app-event-form
        [eventToEdit]="selectedEventToEdit"
        (close)="closeEventModal()"
        (saved)="onEventSaved($event)"
      ></app-event-form>
    }

    @if (isUserModalOpen) {
      <app-user-form
        [userToEdit]="selectedUserToEdit"
        (close)="closeUserModal()"
        (saved)="onUserSaved($event)"
      ></app-user-form>
    }
  `
})
export class UnifiedManagementComponent implements OnInit {
  activeTab: 'events' | 'places' | 'users' = 'events';

  // Filtros de eventos
  searchEventQuery: string = '';
  filterEventModality: string = 'Todas';

  // Filtros de usuarios
  searchUserQuery: string = '';

  // Datos reactivos
  places = signal<Place[]>([]);
  users = signal<User[]>([]);

  // Estados de modales
  isEventModalOpen: boolean = false;
  selectedEventToEdit: EventItem | null = null;

  isUserModalOpen: boolean = false;
  selectedUserToEdit: User | null = null;

  // Mensajes de retroalimentación
  actionSuccessMessage: string | null = null;
  actionErrorMessage: string | null = null;

  constructor(
    public eventService: EventService,
    public authService: AuthService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.refreshAll();
  }

  refreshAll(): void {
    this.eventService.loadEvents().subscribe();
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
