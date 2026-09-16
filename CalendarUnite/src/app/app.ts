import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from './components/navbar/navbar';
import { CalendarComponent } from './components/calendar/calendar';
import { EventDetailComponent } from './components/event-detail/event-detail';
import { EventItem } from './models/event.model';

@Component({
  selector: 'app-root',      // Etiqueta raíz de la aplicación (<app-root></app-root>)
  standalone: true,          // Componente independiente (Angular 14+)
  imports: [
    CommonModule,
    NavbarComponent,         // Barra de navegación superior
    CalendarComponent,       // Vista del calendario y lista de eventos
    EventDetailComponent     // Ventana modal con el detalle del evento e inscripción
  ],
  templateUrl: './app.html',  // Ruta a la plantilla HTML principal
  styleUrl: './app.css'       // Ruta a los estilos CSS del componente principal
})
export class App {
  // Almacena el evento seleccionado por el usuario; si es 'null', el modal permanece oculto
  selectedEvent: EventItem | null = null;

  // Método que recibe el evento emitido desde CalendarComponent al hacer clic en una tarjeta
  onSelectEvent(event: EventItem): void {
    this.selectedEvent = event; // Abre el modal asignando los datos del evento
  }

  // Método ejecutado cuando el usuario hace clic en cerrar ('X' o backdrop) dentro del modal
  closeEventModal(): void {
    this.selectedEvent = null; // Cierra el modal limpiando la variable
  }
}