import { Component, EventEmitter, Input, OnInit, Output, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { EventItem, CreateEventRequest, UpdateEventRequest } from '../../models/event.model';
import { Place } from '../../models/place.model';
import { EventService } from '../../services/event.service';

@Component({
  selector: 'app-event-form',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="cu-modal-backdrop" (click)="onClose()">
      <div class="cu-modal-card" (click)="$event.stopPropagation()">
        
        <!-- Header -->
        <div class="cu-modal-header">
          <h2>{{ isEditing ? 'Editar Actividad' : 'Publicar Nueva Actividad' }}</h2>
          <button class="btn-cu-icon" (click)="onClose()" title="Cerrar modal">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
          </button>
        </div>

        <!-- Formulario completo -->
        <form (ngSubmit)="onSubmit()" style="display:flex; flex-direction:column; flex:1; overflow:hidden; margin:0;">
          <!-- Body con Scroll -->
          <div class="cu-modal-body" style="flex:1; overflow-y:auto; padding:24px;">
            @if (errorMessage) {
              <div class="error-banner" style="background:#fee2e2; border:1px solid #f87171; color:#991b1b; padding:10px 14px; border-radius:8px; margin-bottom:16px; font-size:14px; display:flex; align-items:center; gap:8px;">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <circle cx="12" cy="12" r="10"/>
                  <line x1="12" y1="8" x2="12" y2="12"/>
                  <line x1="12" y1="16" x2="12.01" y2="16"/>
                </svg>
                <span>{{ errorMessage }}</span>
              </div>
            }

            <!-- Nombre del Evento -->
            <div class="form-group" style="margin-bottom: 16px;">
              <label style="display:block; font-weight:600; font-size:14px; margin-bottom:6px; color:var(--text-dark);">
                Nombre de la Actividad *
              </label>
              <input
                type="text"
                [(ngModel)]="nombre"
                name="nombre"
                required
                placeholder="Ej. Taller de Manejo del Estrés Académico"
                class="form-input"
                style="width:100%; padding:10px 14px; border:1.5px solid var(--border-color); border-radius:6px; font-size:15px;"
              />
            </div>

            <!-- Modalidad y Lugar -->
            <div class="form-grid-2" style="margin-bottom: 16px;">
              <div class="form-group">
                <label style="display:block; font-weight:600; font-size:14px; margin-bottom:6px; color:var(--text-dark);">
                  Modalidad *
                </label>
                <select
                  [(ngModel)]="modalidad"
                  name="modalidad"
                  class="form-input"
                  style="width:100%; padding:10px 14px; border:1.5px solid var(--border-color); border-radius:6px; font-size:15px; background:white;"
                >
                  <option value="Presencial">Presencial</option>
                  <option value="Virtual">Virtual</option>
                  <option value="Nocturna">Jornada Nocturna</option>
                </select>
              </div>

              <div class="form-group">
                <label style="display:block; font-weight:600; font-size:14px; margin-bottom:6px; color:var(--text-dark);">
                  Lugar Institucional (Tabla 'Lugar') *
                </label>
                <select
                  [(ngModel)]="id_lugar"
                  name="id_lugar"
                  required
                  class="form-input"
                  style="width:100%; padding:10px 14px; border:1.5px solid var(--border-color); border-radius:6px; font-size:15px; background:white;"
                >
                  @for (place of places; track place.id_lugar) {
                    <option [value]="place.id_lugar">
                      {{ place.nombre }} ({{ place.edificio || 'Campus' }} - {{ place.aula || 'General' }})
                    </option>
                  }
                </select>
              </div>
            </div>

            <!-- Fechas: Inicio y Fin -->
            <div class="form-grid-2" style="margin-bottom: 16px;">
              <div class="form-group">
                <label style="display:block; font-weight:600; font-size:14px; margin-bottom:6px; color:var(--text-dark);">
                  Fecha de Inicio *
                </label>
                <input
                  type="date"
                  [(ngModel)]="fecha_inicio"
                  name="fecha_inicio"
                  required
                  class="form-input"
                  style="width:100%; padding:10px 14px; border:1.5px solid var(--border-color); border-radius:6px; font-size:15px;"
                />
              </div>

              <div class="form-group">
                <label style="display:block; font-weight:600; font-size:14px; margin-bottom:6px; color:var(--text-dark);">
                  Fecha de Cierre (Opcional)
                </label>
                <input
                  type="date"
                  [(ngModel)]="fecha_fin"
                  name="fecha_fin"
                  class="form-input"
                  style="width:100%; padding:10px 14px; border:1.5px solid var(--border-color); border-radius:6px; font-size:15px;"
                />
              </div>
            </div>

            <!-- Horarios: Inicio y Fin -->
            <div class="form-grid-2" style="margin-bottom: 16px;">
              <div class="form-group">
                <label style="display:block; font-weight:600; font-size:14px; margin-bottom:6px; color:var(--text-dark);">
                  Hora de Inicio
                </label>
                <input
                  type="time"
                  [(ngModel)]="hora_inicio"
                  name="hora_inicio"
                  class="form-input"
                  style="width:100%; padding:10px 14px; border:1.5px solid var(--border-color); border-radius:6px; font-size:15px;"
                />
              </div>

              <div class="form-group">
                <label style="display:block; font-weight:600; font-size:14px; margin-bottom:6px; color:var(--text-dark);">
                  Hora de Finalización
                </label>
                <input
                  type="time"
                  [(ngModel)]="hora_fin"
                  name="hora_fin"
                  class="form-input"
                  style="width:100%; padding:10px 14px; border:1.5px solid var(--border-color); border-radius:6px; font-size:15px;"
                />
              </div>
            </div>

            <!-- Enlaces Virtuales (array link_virtual) -->
            <div class="form-group" style="margin-bottom: 16px;">
              <label style="display:flex; justify-content:space-between; align-items:center; font-weight:600; font-size:14px; margin-bottom:6px; color:var(--text-dark);">
                <span>Enlaces Virtuales (Google Meet, Teams, Zoom)</span>
                <button type="button" (click)="addVirtualLink()" class="btn-cu-outline" style="padding:4px 10px; font-size:12px;">+ Agregar Enlace</button>
              </label>
              @for (link of link_virtual; track $index) {
                <div style="display:flex; gap:8px; margin-bottom:8px;">
                  <input
                    type="url"
                    [(ngModel)]="link_virtual[$index]"
                    [name]="'link_' + $index"
                    placeholder="https://meet.google.com/..."
                    class="form-input"
                    style="flex:1; padding:8px 12px; border:1.5px solid var(--border-color); border-radius:6px; font-size:14px;"
                  />
                  <button type="button" (click)="removeVirtualLink($index)" class="btn-cu-danger-outline" style="padding:6px 10px; font-size:12px;" title="Quitar enlace">&times;</button>
                </div>
              }
              @if (link_virtual.length === 0) {
                <p style="font-size:13px; color:var(--text-muted); font-style:italic;">No se han agregado enlaces virtuales aún.</p>
              }
            </div>

            <!-- Cupos y Categoría -->
            <div class="form-grid-2" style="margin-bottom: 16px;">
              <div class="form-group">
                <label style="display:block; font-weight:600; font-size:14px; margin-bottom:6px; color:var(--text-dark);">
                  Cupos Estimados
                </label>
                <input
                  type="number"
                  [(ngModel)]="totalSpots"
                  name="totalSpots"
                  min="1"
                  max="1000"
                  class="form-input"
                  style="width:100%; padding:10px 14px; border:1.5px solid var(--border-color); border-radius:6px; font-size:15px;"
                />
              </div>

              <div class="form-group">
                <label style="display:block; font-weight:600; font-size:14px; margin-bottom:6px; color:var(--text-dark);">
                  Categoría
                </label>
                <select
                  [(ngModel)]="category"
                  name="category"
                  class="form-input"
                  style="width:100%; padding:10px 14px; border:1.5px solid var(--border-color); border-radius:6px; font-size:15px; background:white;"
                >
                  <option value="Psicología y Salud Mental">Psicología y Salud Mental</option>
                  <option value="Deportes y Recreación">Deportes y Recreación</option>
                  <option value="Cultura y Arte">Cultura y Arte</option>
                  <option value="Desarrollo Profesional">Desarrollo Profesional</option>
                  <option value="Salud Integral">Salud Integral</option>
                  <option value="Institucional">Institucional</option>
                </select>
              </div>
            </div>

            <!-- Imagen / Banner Promocional con Previsualización (RF4) -->
            <div class="form-group" style="margin-bottom: 16px;">
              <label style="display:block; font-weight:600; font-size:14px; margin-bottom:6px; color:var(--text-dark);">
                URL del Banner / Imagen Promocional (Almacenamiento y Archivo Adjunto)
              </label>
              <input
                type="url"
                [(ngModel)]="banner_url"
                name="banner_url"
                placeholder="https://images.unsplash.com/..."
                class="form-input"
                style="width:100%; padding:10px 14px; border:1.5px solid var(--border-color); border-radius:6px; font-size:15px;"
              />
              @if (banner_url) {
                <div style="margin-top:10px; border-radius:8px; overflow:hidden; border:1px solid var(--border-color); max-height:160px;">
                  <img [src]="banner_url" alt="Previsualización de Banner" style="width:100%; height:160px; object-fit:cover;" (error)="onImageError()" />
                </div>
              }
            </div>

            <!-- Descripción -->
            <div class="form-group" style="margin-bottom: 20px;">
              <label style="display:block; font-weight:600; font-size:14px; margin-bottom:6px; color:var(--text-dark);">
                Descripción de la Actividad *
              </label>
              <textarea
                [(ngModel)]="descripcion"
                name="descripcion"
                required
                rows="4"
                placeholder="Detalla los objetivos de la actividad, requisitos, recomendaciones e impacto para la comunidad estudiantil..."
                class="form-input"
                style="width:100%; padding:10px 14px; border:1.5px solid var(--border-color); border-radius:6px; font-size:15px; font-family:inherit;"
              ></textarea>
            </div>
          </div>

          <!-- Footer fijo con Botones -->
          <div class="cu-modal-footer">
            <button type="button" (click)="onClose()" class="btn-cu-outline">
              Cancelar
            </button>
            <button type="submit" [disabled]="isSubmitting" class="btn-cu-primary">
              {{ isSubmitting ? 'Guardando...' : (isEditing ? 'Actualizar Actividad' : 'Publicar Actividad') }}
            </button>
          </div>
        </form>

      </div>
    </div>
  `
})
export class EventFormComponent implements OnInit {
  @Input() eventToEdit: EventItem | null = null;
  @Output() close = new EventEmitter<void>();
  @Output() saved = new EventEmitter<EventItem>();

  nombre: string = '';
  modalidad: 'Presencial' | 'Virtual' | 'Nocturna' = 'Presencial';
  link_virtual: string[] = [];
  descripcion: string = '';
  fecha_inicio: string = '';
  fecha_fin: string = '';
  hora_inicio: string = '09:00';
  hora_fin: string = '11:00';
  id_lugar: number = 1;
  banner_url: string = '';
  totalSpots: number = 50;
  category: string = 'Psicología y Salud Mental';

  places: Place[] = [];
  isSubmitting: boolean = false;
  errorMessage: string | null = null;

  get isEditing(): boolean {
    return this.eventToEdit !== null;
  }

  constructor(
    private eventService: EventService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    // Cargar catálogo de lugares
    this.eventService.loadPlaces().subscribe({
      next: (placesList) => {
        this.places = placesList;
        if (!this.isEditing && placesList.length > 0) {
          this.id_lugar = placesList[0].id_lugar;
        }
      },
      error: () => {
        this.places = [
          { id_lugar: 1, nombre: 'Auditorio Principal', edificio: 'Edificio A', aula: 'Auditorio 1' },
          { id_lugar: 2, nombre: 'Salón de Cultura', edificio: 'Casa U', aula: 'Salón 201' },
          { id_lugar: 3, nombre: 'Canchas Sintéticas Múltiples', edificio: 'Complejo Deportivo', aula: 'Cancha 1' },
          { id_lugar: 4, nombre: 'Taller de Artes B-204', edificio: 'Edificio B', aula: '204' },
          { id_lugar: 5, nombre: 'Espacio Virtual Institucional', edificio: 'Campus Virtual', aula: 'Digital' }
        ];
      }
    });

    if (this.eventToEdit) {
      this.nombre = this.eventToEdit.nombre || this.eventToEdit.title || '';
      this.modalidad = (this.eventToEdit.modalidad || this.eventToEdit.modality || 'Presencial') as any;
      this.descripcion = this.eventToEdit.descripcion || this.eventToEdit.description || '';
      this.fecha_inicio = this.eventToEdit.fecha_inicio || this.eventToEdit.date || '';
      this.fecha_fin = this.eventToEdit.fecha_fin || this.fecha_inicio;
      this.hora_inicio = this.eventToEdit.hora_inicio || (this.eventToEdit.time ? this.eventToEdit.time.split(' - ')[0] : '09:00');
      this.hora_fin = this.eventToEdit.hora_fin || (this.eventToEdit.time ? this.eventToEdit.time.split(' - ')[1] : '11:00');
      this.id_lugar = this.eventToEdit.id_lugar || 1;
      this.banner_url = this.eventToEdit.banner_url || this.eventToEdit.imageUrl || '';
      this.totalSpots = this.eventToEdit.totalSpots || 50;
      this.category = this.eventToEdit.category || 'Psicología y Salud Mental';
      this.link_virtual = Array.isArray(this.eventToEdit.link_virtual) ? [...this.eventToEdit.link_virtual] : [];
    } else {
      // Fecha por defecto mañana
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      this.fecha_inicio = tomorrow.toISOString().split('T')[0];
      this.banner_url = 'https://images.unsplash.com/photo-1523580494863-6f3031224c94?auto=format&fit=crop&w=600&q=80';
    }
  }

  addVirtualLink(): void {
    this.link_virtual.push('');
  }

  removeVirtualLink(index: number): void {
    this.link_virtual.splice(index, 1);
  }

  onImageError(): void {
    this.banner_url = 'https://images.unsplash.com/photo-1523580494863-6f3031224c94?auto=format&fit=crop&w=600&q=80';
  }

  onClose(): void {
    this.close.emit();
  }

  onSubmit(): void {
    if (!this.nombre.trim() || !this.descripcion.trim() || !this.fecha_inicio) {
      this.errorMessage = 'Por favor completa los campos obligatorios: Nombre, Fecha de Inicio y Descripción.';
      return;
    }

    this.isSubmitting = true;
    this.errorMessage = null;

    const cleanLinks = this.link_virtual.map(l => l.trim()).filter(l => l.length > 0);

    if (this.isEditing && this.eventToEdit) {
      const updateData: UpdateEventRequest = {
        nombre: this.nombre.trim(),
        modalidad: this.modalidad,
        link_virtual: cleanLinks,
        descripcion: this.descripcion.trim(),
        fecha_inicio: this.fecha_inicio,
        fecha_fin: this.fecha_fin || null,
        hora_inicio: this.hora_inicio,
        hora_fin: this.hora_fin,
        id_lugar: Number(this.id_lugar),
        banner_url: this.banner_url.trim(),
        category: this.category,
        totalSpots: Number(this.totalSpots)
      };

      const eventId = this.eventToEdit.id_evento || this.eventToEdit.id;
      this.eventService.updateEvent(eventId, updateData).subscribe({
        next: (res) => {
          this.isSubmitting = false;
          this.cdr.markForCheck();
          this.saved.emit(res.event);
        },
        error: (err) => {
          this.isSubmitting = false;
          this.errorMessage = err.error?.error || 'Error al actualizar el evento.';
          this.cdr.markForCheck();
        }
      });
    } else {
      const createData: CreateEventRequest = {
        nombre: this.nombre.trim(),
        modalidad: this.modalidad,
        link_virtual: cleanLinks,
        descripcion: this.descripcion.trim(),
        fecha_inicio: this.fecha_inicio,
        fecha_fin: this.fecha_fin || null,
        hora_inicio: this.hora_inicio,
        hora_fin: this.hora_fin,
        id_lugar: Number(this.id_lugar),
        banner_url: this.banner_url.trim(),
        category: this.category,
        totalSpots: Number(this.totalSpots)
      };

      this.eventService.createEvent(createData).subscribe({
        next: (res) => {
          this.isSubmitting = false;
          this.cdr.markForCheck();
          this.saved.emit(res.event);
        },
        error: (err) => {
          this.isSubmitting = false;
          this.errorMessage = err.error?.error || 'Error al publicar el evento.';
          this.cdr.markForCheck();
        }
      });
    }
  }
}
