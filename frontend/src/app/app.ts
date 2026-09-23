import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from './components/navbar/navbar';
import { CalendarComponent } from './components/calendar/calendar';
import { EventDetailComponent } from './components/event-detail/event-detail';
import { LoginComponent } from './components/login/login';
import { UnifiedManagementComponent } from './components/unified-management/unified-management';
import { EventItem } from './models/event.model';
import { AuthService } from './services/auth.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    NavbarComponent,
    CalendarComponent,
    UnifiedManagementComponent,
    EventDetailComponent,
    LoginComponent
  ],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  // Vista activa actual en la aplicación
  activeView: 'calendar' | 'management' = 'calendar';

  // Almacena el evento seleccionado por el usuario para ver en el modal
  selectedEvent: EventItem | null = null;

  constructor(public authService: AuthService) {}

  // Cambio de vista entre Cronograma Público y Panel de Gestión
  onViewChange(view: 'calendar' | 'management'): void {
    this.activeView = view;
  }

  // Método ejecutado al seleccionar un evento en CalendarComponent
  onSelectEvent(event: EventItem): void {
    this.selectedEvent = event;
  }

  // Cierra el modal de detalle del evento
  closeEventModal(): void {
    this.selectedEvent = null;
  }

  // Abre el modal de Login
  openLoginModal(): void {
    this.authService.openLoginModal();
  }

  // Cierra el modal de Login
  closeLoginModal(): void {
    this.authService.closeLoginModal();
  }
}