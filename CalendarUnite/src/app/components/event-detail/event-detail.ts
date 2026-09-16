import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { EventService } from '../../services/event.service';
import { EventItem } from '../../models/event.model';

@Component({
  selector: 'app-event-detail',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="modal-backdrop" (click)="close.emit()">
      <div class="modal-content" (click)="$event.stopPropagation()">
        
        <button (click)="close.emit()" class="modal-close-btn" title="Cerrar modal">&times;</button>

        <div class="modal-header">
          <div class="event-hero-image" [style.backgroundImage]="'url(' + event.imageUrl + ')'">
            <div class="image-overlay">
              <span class="badge-modality" [ngClass]="'mod-' + event.modality.toLowerCase()">
                {{ event.modality }}
              </span>
              <span class="badge-category">{{ event.category }}</span>
            </div>
          </div>
        </div>

        <div class="modal-body">
          <h2 class="modal-title">{{ event.title }}</h2>

          <div class="event-meta-grid">
            <div class="meta-item">
              <div class="meta-text">
                <label>Organizador / Área</label>
                <strong>{{ event.organizer }}</strong>
              </div>
            </div>

            <div class="meta-item">
              <div class="meta-text">
                <label>Fecha y Horario</label>
                <strong>{{ event.date }} ({{ event.time }})</strong>
              </div>
            </div>

            <div class="meta-item">
              <div class="meta-text">
                <label>Lugar / Modalidad</label>
                <strong>{{ event.location }}</strong>
              </div>
            </div>

            <div class="meta-item">
              <div class="meta-text">
                <label>Disponibilidad</label>
                <strong [class.text-danger]="event.availableSpots <= 3">
                  {{ event.availableSpots }} cupos disponibles de {{ event.totalSpots }}
                </strong>
              </div>
            </div>
          </div>

          <div class="description-box">
            <h3>Especificaciones de la Actividad</h3>
            <p>{{ event.description }}</p>
          </div>

          <div class="registration-section">
            <div class="form-title">
              <h3>Formulario de Inscripción Estudiantil</h3>
              <p>Ingresa tus datos de contacto para formalizar tu registro en esta actividad:</p>
            </div>

            @if (successMessage) {
              <div class="alert-success">
                <div>
                  <h4>Inscripción Confirmada</h4>
                  <p>{{ successMessage }}</p>
                </div>
              </div>
            }

            @if (!successMessage) {
              @if (errorMessage) {
                <div class="alert-danger">
                  {{ errorMessage }}
                </div>
              }

              <form (ngSubmit)="submitRegistration()" class="register-form">
                <div class="form-group">
                  <label for="nombre">Nombre Completo *</label>
                  <input 
                    type="text" 
                    id="nombre" 
                    [(ngModel)]="regData.nombre" 
                    name="nombre" 
                    required 
                    placeholder="Ingrese su nombre completo" />
                </div>

                <div class="form-row">
                  <div class="form-group">
                    <label for="correo">Correo Institucional *</label>
                    <input 
                      type="email" 
                      id="correo" 
                      [(ngModel)]="regData.correo" 
                      name="correo" 
                      required 
                      placeholder="usuario@universidad.edu.co" />
                  </div>

                  <div class="form-group">
                    <label for="telefono">Número de Teléfono *</label>
                    <input 
                      type="tel" 
                      id="telefono" 
                      [(ngModel)]="regData.telefono" 
                      name="telefono" 
                      required 
                      placeholder="Número telefónico de contacto" />
                  </div>
                </div>

                <div class="form-actions">
                  <button 
                    type="submit" 
                    [disabled]="isSubmitting || event.availableSpots <= 0" 
                    class="btn-submit-register">
                    @if (!isSubmitting) {
                      <span>Confirmar Registro</span>
                    } @else {
                      <span>Procesando inscripción...</span>
                    }
                  </button>
                </div>
              </form>
            }

          </div>

        </div>

      </div>
    </div>
  `
})
export class EventDetailComponent implements OnInit {
  @Input() event!: EventItem;
  @Output() close = new EventEmitter<void>();

  regData = {
    nombre: '',
    correo: '',
    telefono: ''
  };

  isSubmitting = false;
  successMessage = '';
  errorMessage = '';

  constructor(public eventService: EventService) {}

  ngOnInit(): void {
    this.errorMessage = '';
    this.successMessage = '';
  }

  submitRegistration(): void {
    if (!this.regData.nombre || !this.regData.correo || !this.regData.telefono) {
      this.errorMessage = 'Por favor ingrese su nombre completo, correo institucional y número de teléfono.';
      return;
    }

    this.isSubmitting = true;
    this.errorMessage = '';

    this.eventService.registerForEvent(this.event.id, this.regData).subscribe({
      next: (res) => {
        this.isSubmitting = false;
        this.successMessage = res.message;
        this.event.availableSpots = res.updatedAvailableSpots;
      },
      error: (err) => {
        this.isSubmitting = false;
        this.errorMessage = err.error?.error || 'Ocurrió un error al procesar el registro.';
      }
    });
  }
}
