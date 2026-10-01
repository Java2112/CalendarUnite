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
  templateUrl: './event-form.html',
  styleUrl: './event-form.css'
})
// Componente modal para crear o editar actividades
export class EventFormComponent implements OnInit {
  // Evento a editar recibido desde el componente padre (o null para crear nuevo)
  @Input() eventToEdit: EventItem | null = null;
  // Evento emitido al cerrar el modal
  @Output() close = new EventEmitter<void>();
  // Evento emitido cuando la actividad se guarda exitosamente
  @Output() saved = new EventEmitter<EventItem>();

  // Campos del formulario
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

  // Catálogo de lugares cargado desde el backend
  places: Place[] = [];
  // Estado de envío del formulario
  isSubmitting: boolean = false;
  // Mensaje de error para mostrar en la alerta
  errorMessage: string | null = null;

  // Propiedad computada que indica si estamos en modo edición
  get isEditing(): boolean {
    return this.eventToEdit !== null;
  }

  // Constructor con servicios requeridos
  constructor(
    private eventService: EventService,
    private cdr: ChangeDetectorRef
  ) {}

  // Inicializa el formulario cargando lugares y rellenando datos si es edición
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

    // Si es edición, inicializa los campos con los valores del evento
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
      // Si es nuevo, asigna fecha para mañana por defecto
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      this.fecha_inicio = tomorrow.toISOString().split('T')[0];
      this.banner_url = 'https://images.unsplash.com/photo-1523580494863-6f3031224c94?auto=format&fit=crop&w=600&q=80';
    }
  }

  // Agrega un nuevo campo de enlace virtual
  addVirtualLink(): void {
    this.link_virtual.push('');
  }

  // Elimina un enlace virtual por índice
  removeVirtualLink(index: number): void {
    this.link_virtual.splice(index, 1);
  }

  // Asigna imagen de respaldo si la URL falla
  onImageError(): void {
    this.banner_url = 'https://images.unsplash.com/photo-1523580494863-6f3031224c94?auto=format&fit=crop&w=600&q=80';
  }

  // Cierra la ventana modal
  onClose(): void {
    this.close.emit();
  }

  // Envía el formulario para crear o actualizar el evento
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
