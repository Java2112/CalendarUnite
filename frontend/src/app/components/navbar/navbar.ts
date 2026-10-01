import { Component, Output, EventEmitter, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';
import { UserRole } from '../../models/user.model';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css'
})
// Componente de la barra de navegación superior institucional
export class NavbarComponent {
  // Propiedad de entrada que indica la vista actualmente activa
  @Input() currentView: 'calendar' | 'resources' | 'management' = 'calendar';
  // Evento emitido para abrir el modal de inicio de sesión
  @Output() openLogin = new EventEmitter<void>();
  // Evento emitido al cambiar de vista
  @Output() viewChange = new EventEmitter<'calendar' | 'resources' | 'management'>();

  // Inyecta el servicio de autenticación públicamente para su uso en plantilla
  constructor(public authService: AuthService) {}

  // Dispara el evento para desplegar el modal de login
  onOpenLogin(): void {
    this.openLogin.emit();
  }

  // Cambia la vista activa y emite el evento al componente padre
  setView(view: 'calendar' | 'resources' | 'management'): void {
    this.currentView = view;
    this.viewChange.emit(view);
  }

  // Cierra la sesión activa y retorna al cronograma público
  onLogout(): void {
    this.authService.logout();
    this.setView('calendar');
  }

  // Traduce el identificador del rol a una etiqueta legible
  getRoleLabel(role?: string | null): string {
    if (!role) return '';
    switch (role.toLowerCase()) {
      case 'admin': return 'Administrador';
      case 'bienestar': return 'Bienestar';
      case 'lider': return 'Líder';
      default: return role;
    }
  }
}