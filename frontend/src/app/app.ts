import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from './components/navbar/navbar';
import { CalendarComponent } from './components/calendar/calendar';
import { ResourcesComponent } from './components/resources/resources';
import { EventDetailComponent } from './components/event-detail/event-detail';
import { LoginComponent } from './components/login/login';
import { UnifiedManagementComponent } from './components/unified-management/unified-management';
import { EventItem } from './models/event.model';
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
    ResourcesComponent,
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
export class App implements OnInit {
  // Vista activa actual en la aplicación ('calendar', 'resources' o 'management')
  activeView: 'calendar' | 'resources' | 'management' = 'calendar';

  // Año actual dinámico para el footer institucional
  readonly currentYear = new Date().getFullYear();

  // Almacena el evento seleccionado por el usuario para ver en el modal
  selectedEvent: EventItem | null = null;

  // Inyecta el servicio de autenticación accesible públicamente en la plantilla
  constructor(public authService: AuthService) {}

  ngOnInit(): void {
    // Sincroniza la vista con la URL del navegador si el usuario navega a /recursos
    const path = window.location.pathname;
    if (path.includes('recursos') || path.includes('resources')) {
      this.activeView = 'resources';
    } else if (path.includes('cronograma')) {
      this.activeView = 'calendar';
    }
  }

  // Maneja el cambio de vista entre Cronograma Público, Recursos Públicos y Panel de Gestión
  onViewChange(view: 'calendar' | 'resources' | 'management'): void {
    // Actualiza la propiedad con la vista seleccionada
    this.activeView = view;
    
    // Actualiza sutilmente la ruta en la barra de direcciones del navegador
    const newPath = view === 'resources' ? '/recursos' : (view === 'calendar' ? '/cronograma' : '/gestion');
    window.history.pushState({}, '', newPath);
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