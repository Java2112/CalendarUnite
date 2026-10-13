// Importa las dependencias necesarias del núcleo de Angular
import { Component, OnInit } from '@angular/core';
// Importa CommonModule para directivas ngIf, ngFor, ngClass
import { CommonModule } from '@angular/common';
// Importa FormsModule para enlazado bidireccional [(ngModel)]
import { FormsModule } from '@angular/forms';
// Importa el servicio de psicología
import { PsychologyService } from '../../services/psychology.service';
// Importa las interfaces del modelo de psicología
import {
  PsychologyMeeting,
  PsychologyBookingRequest,
  PsychologistProfile,
  PsychologyModality
} from '../../models/psychology.model';

// Componente público de Atención y Agendamiento de Psicología para estudiantes
@Component({
  // Selector HTML de la etiqueta
  selector: 'app-psychology',
  // Configurado como componente independiente (standalone)
  standalone: true,
  // Módulos requeridos en la plantilla
  imports: [CommonModule, FormsModule],
  // Ruta al archivo de plantilla HTML
  templateUrl: './psychology.html',
  // Ruta a la hoja de estilos CSS independiente
  styleUrl: './psychology.css'
})
export class PsychologyComponent implements OnInit {
  // Campos del formulario de solicitud de cita
  studentName: string = '';
  studentEmail: string = '';
  studentPhone: string = '';
  studentProgram: string = '';
  reason: string = 'Manejo de Estrés y Ansiedad ante Evaluaciones';
  customReason: string = '';
  date: string = '';
  selectedSlot: string = '09:00 - 10:00';
  modality: PsychologyModality = 'Presencial';
  selectedProfessional: string = '';

  // Lista de franjas horarias disponibles para atención
  availableSlots: string[] = [
    '08:00 - 09:00',
    '09:00 - 10:00',
    '10:00 - 11:00',
    '11:00 - 12:00',
    '14:00 - 15:00',
    '15:00 - 16:00',
    '16:00 - 17:00'
  ];

  // Motivos frecuentes de consulta en Bienestar Universitario
  commonReasons: string[] = [
    'Manejo de Estrés y Ansiedad ante Evaluaciones',
    'Acompañamiento y Primeros Auxilios Emocionales',
    'Orientación Vocacional y Adaptación Universitaria',
    'Dificultades en Concentración o Rendimiento Académico',
    'Equilibrio entre Trabajo Dual y Clases',
    'Otro motivo personalizado'
  ];

  // Estado de envío del formulario
  isSubmitting: boolean = false;
  // Mensaje de error en la validación
  errorMessage: string = '';
  // Estado de apertura del modal de confirmación
  isSuccessModalOpen: boolean = false;
  // Cita recién agendada confirmada
  confirmedBooking: PsychologyMeeting | null = null;

  // Fecha mínima permitida en el selector (hoy)
  minDate: string = '';

  // Inyecta el servicio de psicología
  constructor(public psychologyService: PsychologyService) {}

  ngOnInit(): void {
    // Configura la fecha mínima para hoy en formato YYYY-MM-DD
    const today = new Date();
    this.minDate = today.toISOString().split('T')[0];

    // Establece por defecto la fecha de mañana si es día hábil
    const tomorrow = new Date();
    tomorrow.setDate(today.getDate() + 1);
    this.date = tomorrow.toISOString().split('T')[0];

    // Carga los profesionales actualizados de la base de datos
    this.psychologyService.loadProfessionals().subscribe({
      next: (pros) => {
        if (pros && pros.length > 0 && !this.selectedProfessional) {
          this.selectedProfessional = pros[0].name;
        }
      }
    });

    // Asigna el primer profesional disponible de la señal
    const pros = this.psychologyService.professionals();
    if (pros && pros.length > 0) {
      this.selectedProfessional = pros[0].name;
    }
  }

  // Permite seleccionar una franja horaria haciendo clic
  selectSlot(slot: string): void {
    this.selectedSlot = slot;
  }

  // Procesa el envío del formulario de solicitud de cita
  onSubmitBooking(): void {
    this.errorMessage = '';

    // Validaciones de campos obligatorios
    if (!this.studentName.trim()) {
      this.errorMessage = 'Por favor ingresa tu nombre completo.';
      return;
    }
    if (!this.studentEmail.trim() || !this.studentEmail.includes('@')) {
      this.errorMessage = 'Por favor ingresa un correo electrónico institucional válido.';
      return;
    }
    if (!this.date) {
      this.errorMessage = 'Por favor selecciona la fecha de la cita.';
      return;
    }
    if (!this.selectedSlot) {
      this.errorMessage = 'Por favor selecciona una franja horaria.';
      return;
    }

    // Determina el motivo final
    const finalReason = this.reason === 'Otro motivo personalizado'
      ? (this.customReason.trim() || 'Consulta psicológica general')
      : this.reason;

    // Extrae hora de inicio y fin desde la franja seleccionada
    const [startHour, endHour] = this.selectedSlot.split(' - ');

    // Construye la petición de agendamiento
    const requestData: PsychologyBookingRequest = {
      studentName: this.studentName.trim(),
      studentEmail: this.studentEmail.trim(),
      studentPhone: this.studentPhone.trim(),
      studentProgram: this.studentProgram.trim(),
      reason: finalReason,
      date: this.date,
      startHour: startHour.trim(),
      endHour: endHour.trim(),
      modality: this.modality,
      professionalName: this.selectedProfessional || (this.psychologyService.professionals()[0]?.name ?? 'Bienestar Universitario')
    };

    this.isSubmitting = true;

    // Llama al servicio para guardar la cita
    this.psychologyService.bookMeeting(requestData).subscribe({
      next: (res) => {
        this.isSubmitting = false;
        this.confirmedBooking = res.data;
        this.isSuccessModalOpen = true;
        this.resetForm();
      },
      error: (err) => {
        this.isSubmitting = false;
        this.errorMessage = 'Ocurrió un error al procesar tu solicitud. Por favor intenta de nuevo.';
      }
    });
  }

  // Cierra el modal de confirmación
  closeSuccessModal(): void {
    this.isSuccessModalOpen = false;
    this.confirmedBooking = null;
  }

  // Restablece los campos del formulario
  private resetForm(): void {
    this.studentName = '';
    this.studentEmail = '';
    this.studentPhone = '';
    this.studentProgram = '';
    this.reason = this.commonReasons[0];
    this.customReason = '';
    this.selectedSlot = '09:00 - 10:00';
    this.modality = 'Presencial';
  }
}
