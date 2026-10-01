import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { EventService } from '../../services/event.service';
import { EventItem } from '../../models/event.model';

@Component({
  selector: 'app-event-detail',
  standalone: true,
  imports: [CommonModule, FormsModule], // Importamos CommonModule para directivas y FormsModule para los inputs
  templateUrl: './event-detail.html',
  styleUrl: './event-detail.css'
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