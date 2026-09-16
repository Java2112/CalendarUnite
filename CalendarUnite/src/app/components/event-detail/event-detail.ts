import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { EventService } from '../../services/event.service';
import { EventItem } from '../../models/event.model';

@Component({
  selector: 'app-event-detail',
  standalone: true,
  imports: [CommonModule, FormsModule], // Importamos CommonModule para directivas y FormsModule para los inputs
  template: `
    <!-- Fondo oscuro transparente (backdrop); al hacer clic afuera emite el evento 'close' -->
    <div class="modal-backdrop" (click)="close.emit()">
      <!-- Contenedor del modal; stopPropagation evita que dar clic dentro lo cierre -->
      <div class="modal-content" (click)="$event.stopPropagation()">
        
        <!-- Botón superior 'X' para cerrar la ventana -->
        <button (click)="close.emit()" class="modal-close-btn" title="Cerrar modal">&times;</button>

        <!-- Encabezado con la imagen principal del evento e insignias (modalidad y categoría) -->
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

          <!-- Grilla con la información técnica: Organizador, Fecha/Hora, Lugar y Cupos -->
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
                <!-- Si quedan 3 cupos o menos, le aplica la clase de alerta roja -->
                <strong [class.text-danger]="event.availableSpots <= 3">
                  {{ event.availableSpots }} cupos disponibles de {{ event.totalSpots }}
                </strong>
              </div>
            </div>
          </div>

          <!-- Caja con el texto explicativo o descripción completa del evento -->
          <div class="description-box">
            <h3>Especificaciones de la Actividad</h3>
            <p>{{ event.description }}</p>
          </div>

          <!-- Sección del formulario de registro -->
          <div class="registration-section">
            <div class="form-title">
              <h3>Formulario de Inscripción Estudiantil</h3>
              <p>Ingresa tus datos de contacto para formalizar tu registro en esta actividad:</p>
            </div>

            <!-- Alerta verde de éxito cuando el servidor confirma el registro -->
            @if (successMessage) {
              <div class="alert-success">
                <div>
                  <h4>Inscripción Confirmada</h4>
                  <p>{{ successMessage }}</p>
                </div>
              </div>
            }

            <!-- Si aún no hay mensaje de éxito, mostramos el formulario o errores -->
            @if (!successMessage) {
              <!-- Alerta roja de error si falla la validación o el backend responde con error -->
              @if (errorMessage) {
                <div class="alert-danger">
                  {{ errorMessage }}
                </div>
              }

              <!-- Formulario de inscripción; ngSubmit ejecuta submitRegistration() al enviar -->
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
                  <!-- Botón de envío; se deshabilita si se está enviando o si no quedan cupos -->
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
  // Recibe la información del evento desde el componente padre
  @Input() event!: EventItem;
  // Notifica al componente padre cuando el usuario decide cerrar la ventana
  @Output() close = new EventEmitter<void>();

  // Objeto enlazado a los campos del formulario con [(ngModel)]
  regData = {
    nombre: '',
    correo: '',
    telefono: ''
  };

  // Variables de control de estado del formulario y mensajes de respuesta
  isSubmitting = false;
  successMessage = '';
  errorMessage = '';

  // Inyectamos el servicio HTTP que conecta con la API del backend
  constructor(public eventService: EventService) {}

  // Al abrir el modal, reiniciamos los mensajes
  ngOnInit(): void {
    this.errorMessage = '';
    this.successMessage = '';
  }

  // Método ejecutado al enviar el formulario
  submitRegistration(): void {
    // Validamos en el frontend que no haya campos vacíos
    if (!this.regData.nombre || !this.regData.correo || !this.regData.telefono) {
      this.errorMessage = 'Por favor ingrese su nombre completo, correo institucional y número de teléfono.';
      return;
    }

    this.isSubmitting = true;
    this.errorMessage = '';

    // Llamamos al servicio enviando el ID del evento y los datos del estudiante
    this.eventService.registerForEvent(this.event.id, this.regData).subscribe({
      next: (res) => {
        this.isSubmitting = false;
        this.successMessage = res.message; // Mostramos el mensaje exitoso del backend
        this.event.availableSpots = res.updatedAvailableSpots; // Actualizamos los cupos restantes en la vista
      },
      error: (err) => {
        this.isSubmitting = false;
        // Mostramos el mensaje de error devuelto por la API
        this.errorMessage = err.error?.error || 'Ocurrió un error al procesar el registro.';
      }
    });
  }
}