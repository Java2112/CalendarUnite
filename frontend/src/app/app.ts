// Importa el decorador Component para definir componentes en Angular
import { Component } from '@angular/core';
// Importa CommonModule con directivas fundamentales de Angular
import { CommonModule } from '@angular/common';
// Importa el componente de la barra de navegación superior
import { NavbarComponent } from './components/navbar/navbar';
// Importa el componente del cronograma y calendario de actividades
import { CalendarComponent } from './components/calendar/calendar';
// Importa el componente modal de visualización detallada del evento
import { EventDetailComponent } from './components/event-detail/event-detail';
// Importa el componente modal para el inicio de sesión
import { LoginComponent } from './components/login/login';
// Importa el componente del panel de administración y gestión unificada
import { UnifiedManagementComponent } from './components/unified-management/unified-management';
// Importa la interfaz del modelo de datos de eventos
import { EventItem } from './models/event.model';
// Importa el servicio de autenticación y estado de sesión
import { AuthService } from './services/auth.service';

// Decorador que configura el componente raíz de la aplicación
@Component({
  // Selector de la etiqueta HTML en index.html
  selector: 'app-root',
  // Configura el componente como independiente sin necesidad de NgModule
  standalone: true,
  // Lista de componentes y módulos requeridos en su plantilla
  imports: [
    CommonModule,
    NavbarComponent,
    CalendarComponent,
    UnifiedManagementComponent,
    EventDetailComponent,
    LoginComponent
  ],
  // Ruta a la plantilla HTML del componente raíz
  templateUrl: './app.html',
  // Ruta a la hoja de estilos CSS del componente
  styleUrl: './app.css'
})
// Clase controladora principal de la aplicación
export class App {
  // Vista activa actual en la aplicación ('calendar' para público o 'management' para gestión)
  activeView: 'calendar' | 'management' = 'calendar';

  // Año actual dinámico para el footer institucional
  readonly currentYear = new Date().getFullYear();

  // Almacena el evento seleccionado por el usuario para ver en el modal
  selectedEvent: EventItem | null = null;

  // Inyecta el servicio de autenticación accesible públicamente en la plantilla
  constructor(public authService: AuthService) {}

  // Maneja el cambio de vista entre Cronograma Público y Panel de Gestión
  onViewChange(view: 'calendar' | 'management'): void {
    // Actualiza la propiedad con la vista seleccionada
    this.activeView = view;
  }

  // Método ejecutado al seleccionar un evento en CalendarComponent
  onSelectEvent(event: EventItem): void {
    // Almacena el evento elegido para desplegar el modal de detalles
    this.selectedEvent = event;
  }

  // Cierra el modal de detalle del evento
  closeEventModal(): void {
    // Limpia la selección de evento dejándolo en nulo
    this.selectedEvent = null;
  }

  // Abre el modal de Login solicitándolo al servicio de autenticación
  openLoginModal(): void {
    // Notifica al servicio que abra la ventana modal de login
    this.authService.openLoginModal();
  }

  // Cierra el modal de Login solicitándolo al servicio de autenticación
  closeLoginModal(): void {
    // Notifica al servicio que cierre la ventana modal de login
    this.authService.closeLoginModal();
  }
}