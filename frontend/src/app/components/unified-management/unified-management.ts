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
          } @else if (activeTab === 'resources') {
            <button class="btn-cu-primary" (click)="openUploadModal()">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
              <span>Subir Archivo (PDF / Imagen)</span>
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

        <!-- Pestaña de Recursos y Archivos para Admin, Bienestar y Líderes -->
        <button
          class="tab-btn"
          [class.active]="activeTab === 'resources'"
          (click)="activeTab = 'resources'"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>
          <span>Recursos y Archivos</span>
          <span class="badge-pill">{{ resourceService.resources().length }}</span>
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

      <!-- ==================================================================== -->
      <!-- PESTAÑA: GESTIÓN DE RECURSOS Y ARCHIVOS (LOCALES)                    -->
      <!-- ==================================================================== -->
      @if (activeTab === 'resources') {
        <div class="tab-content-area">
          
          <div style="background:var(--primary-blue-light); border:1.5px solid var(--primary-blue-border); padding:16px 20px; border-radius:12px; margin-bottom:20px; display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:16px;">
            <div>
              <h3 style="color:var(--primary-blue); margin:0 0 4px 0; font-size:16px; font-weight:800;">
                Módulo de Almacenamiento de Documentos Institucionales
              </h3>
              <p style="margin:0; font-size:13px; color:var(--text-muted);">
                Los archivos que subas se guardan físicamente en el backend y se publican automáticamente en la pantalla de Recursos de acceso estudiantil.
              </p>
            </div>
            <button class="btn-cu-primary" (click)="openUploadModal()" style="padding:8px 16px; font-size:14px;">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
              <span>Subir Archivo</span>
            </button>
          </div>

          <!-- Filtros de recursos -->
          <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:16px; margin-bottom:16px;">
            <div style="display:flex; gap:10px; align-items:center;">
              <input
                type="text"
                [(ngModel)]="searchResourceQuery"
                placeholder="Buscar por título, categoría o autor..."
                class="form-input"
                style="padding:8px 14px; border:1.5px solid var(--border-color); border-radius:6px; font-size:14px; min-width:280px;"
              />
            </div>
            <div style="font-size:13px; color:var(--text-muted);">
              Total archivos: <strong>{{ filteredResources.length }}</strong>
            </div>
          </div>

          <div class="table-responsive">
            <table class="cu-table">
              <thead>
                <tr>
                  <th>Formato</th>
                  <th>Título y Descripción</th>
                  <th>Categoría</th>
                  <th>Subido Por</th>
                  <th>Tamaño / Fecha</th>
                  <th style="text-align:right;">Acciones</th>
                </tr>
              </thead>
              <tbody>
                @for (res of filteredResources; track res.id) {
                  <tr>
                    <td>
                      <span class="role-badge" [ngClass]="res.fileType === 'pdf' ? 'admin' : (res.fileType === 'image' ? 'bienestar' : 'lider')">
                        {{ res.fileType.toUpperCase() }}
                      </span>
                    </td>
                    <td style="max-width:320px;">
                      <strong style="color:var(--primary-blue); display:block; font-size:14px;">{{ res.title }}</strong>
                      <span style="font-size:12px; color:var(--text-muted); display:-webkit-box; -webkit-line-clamp:2; -webkit-box-orient:vertical; overflow:hidden;">
                        {{ res.description }}
                      </span>
                    </td>
                    <td>
                      <span style="font-size:12px; font-weight:700; color:var(--text-dark); background:#f1f5f9; padding:3px 8px; border-radius:12px;">
                        {{ res.category }}
                      </span>
                    </td>
                    <td>
                      <span class="role-badge" [ngClass]="res.uploadedByRole.toLowerCase()">
                        {{ res.uploadedByRole }}
                      </span>
                      <span style="display:block; font-size:11px; color:var(--text-muted); margin-top:3px;">
                        {{ res.uploaderName || 'Autor institucional' }}
                      </span>
                    </td>
                    <td>
                      <span style="font-size:13px; font-weight:600; color:var(--text-dark); display:block;">{{ res.size }}</span>
                      <span style="font-size:11px; color:var(--text-muted);">{{ res.date }}</span>
                    </td>
                    <td style="text-align:right;">
                      <div class="table-actions" style="justify-content:flex-end;">
                        <a
                          [href]="res.fileUrl"
                          target="_blank"
                          class="btn-cu-outline"
                          style="padding:6px 12px; font-size:13px; text-decoration:none; display:inline-flex; align-items:center; gap:4px;"
                          title="Abrir archivo real local"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
                          <span>Ver</span>
                        </a>
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

    <!-- Modal de Subida de Archivos y Recursos Locales -->
    @if (isUploadModalOpen) {
      <div class="modal-backdrop" (click)="closeUploadModal()">
        <div class="modal-content" (click)="$event.stopPropagation()" style="max-width:580px; width:92%; background:white; border-radius:16px; padding:24px; box-shadow:var(--shadow-lg); border:1.5px solid var(--primary-blue);">
          
          <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:20px; border-bottom:1.5px solid var(--border-color); padding-bottom:12px;">
            <div>
              <h2 style="font-size:1.25rem; font-weight:800; color:var(--primary-blue); margin:0;">
                Subir Archivo Local / Recurso
              </h2>
              <span style="font-size:12px; color:var(--text-muted);">
                Se guardará físicamente en la carpeta local del backend y estará visible en la pantalla inicial de Recursos.
              </span>
            </div>
            <button (click)="closeUploadModal()" style="background:none; border:none; cursor:pointer; color:var(--text-muted); font-size:20px; font-weight:700;">✕</button>
          </div>

          <form (ngSubmit)="submitUploadResource()" style="display:flex; flex-direction:column; gap:16px;">
            
            <!-- Selector de Archivo -->
            <div>
              <label style="display:block; font-size:13px; font-weight:700; color:var(--text-dark); margin-bottom:6px;">
                Seleccionar Archivo (PDF, Imagen o Documento) *
              </label>
              <input
                type="file"
                (change)="onFileSelected($event)"
                accept=".pdf,image/*,.doc,.docx,.xls,.xlsx"
                style="display:block; width:100%; padding:10px; border:1.5px dashed var(--primary-blue-border); border-radius:8px; background:var(--primary-blue-light); cursor:pointer; font-size:13px;"
                required
              />
              @if (selectedUploadFile) {
                <div style="margin-top:6px; font-size:12px; color:var(--primary-blue); font-weight:600;">
                  Archivo seleccionado: {{ selectedUploadFile.name }} ({{ (selectedUploadFile.size / 1024 / 1024).toFixed(2) }} MB)
                </div>
              }
            </div>

            <!-- Título -->
            <div>
              <label style="display:block; font-size:13px; font-weight:700; color:var(--text-dark); margin-bottom:6px;">
                Título del Recurso *
              </label>
              <input
                type="text"
                [(ngModel)]="newResourceTitle"
                name="title"
                placeholder="Ej: Reglamento Institucional de Bienestar 2026"
                class="form-input"
                style="width:100%; padding:10px 14px; border:1.5px solid var(--border-color); border-radius:8px; font-size:14px;"
                required
              />
            </div>

            <div style="display:grid; grid-template-columns:1fr 1fr; gap:12px;">
              <!-- Categoría -->
              <div>
                <label style="display:block; font-size:13px; font-weight:700; color:var(--text-dark); margin-bottom:6px;">
                  Categoría
                </label>
                <select
                  [(ngModel)]="newResourceCategory"
                  name="category"
                  class="form-input"
                  style="width:100%; padding:10px 14px; border:1.5px solid var(--border-color); border-radius:8px; font-size:14px; background:white;"
                >
                  <option value="Reglamento / PDF">Reglamento / PDF</option>
                  <option value="Guía / PDF">Guía / PDF</option>
                  <option value="Infografía / Imagen">Infografía / Imagen</option>
                  <option value="Documento Académico">Documento Académico</option>
                  <option value="Folleto / Imagen">Folleto / Imagen</option>
                  <option value="Formato / Trámite">Formato / Trámite</option>
                </select>
              </div>

              <!-- Rol Publicador -->
              <div>
                <label style="display:block; font-size:13px; font-weight:700; color:var(--text-dark); margin-bottom:6px;">
                  Rol que Publica
                </label>
                <select
                  [(ngModel)]="newResourceRole"
                  name="role"
                  class="form-input"
                  style="width:100%; padding:10px 14px; border:1.5px solid var(--border-color); border-radius:8px; font-size:14px; background:white;"
                >
                  <option value="Bienestar">Bienestar</option>
                  <option value="Lider">Líder Estudiantil</option>
                  <option value="Admin">Administrador</option>
                </select>
              </div>
            </div>

            <!-- Descripción -->
            <div>
              <label style="display:block; font-size:13px; font-weight:700; color:var(--text-dark); margin-bottom:6px;">
                Descripción del Contenido
              </label>
              <textarea
                [(ngModel)]="newResourceDescription"
                name="description"
                rows="3"
                placeholder="Breve explicación sobre el documento o guía para los estudiantes..."
                class="form-input"
                style="width:100%; padding:10px 14px; border:1.5px solid var(--border-color); border-radius:8px; font-size:14px; resize:vertical;"
              ></textarea>
            </div>

            <!-- Botones de Acción -->
            <div style="display:flex; justify-content:flex-end; gap:10px; margin-top:8px;">
              <button
                type="button"
                (click)="closeUploadModal()"
                class="btn-cu-outline"
                style="padding:10px 18px; font-size:14px;"
                [disabled]="isUploading"
              >
                Cancelar
              </button>
              <button
                type="submit"
                class="btn-cu-primary"
                style="padding:10px 20px; font-size:14px;"
                [disabled]="isUploading || !selectedUploadFile || !newResourceTitle.trim()"
              >
                @if (isUploading) {
                  <span>Subiendo archivo...</span>
                } @else {
                  <span>Subir y Publicar</span>
                }
              </button>
            </div>

          </form>

        </div>
      </div>
    }
  `
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
