import { Component, Output, EventEmitter, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';
import { UserRole } from '../../models/user.model';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule],
  template: `
    <!-- Encabezado principal de la barra de navegación superior -->
    <header class="navbar-header">
      <div class="navbar-container">
        
        <!-- Sección izquierda: Logotipo y títulos de la aplicación -->
        <div class="navbar-brand" (click)="setView('calendar')" style="cursor: pointer;">
          <!-- Icono visual del calendario en formato SVG -->
          <div class="logo-icon">
            <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <rect width="18" height="18" x="3" y="4" rx="2" ry="2"/>
              <line x1="16" x2="16" y1="2" y2="6"/>
              <line x1="8" x2="8" y1="2" y2="6"/>
              <line x1="3" x2="21" y1="10" y2="10"/>
              <path d="M8 14h.01"/><path d="M12 14h.01"/><path d="M16 14h.01"/>
              <path d="M8 18h.01"/><path d="M12 18h.01"/>
            </svg>
          </div>
          
          <!-- Textos con el nombre del proyecto y subtítulo -->
          <div class="brand-text">
            <span class="brand-name">CalendarUnite</span>
            <span class="brand-sub">Bienestar Universitario</span>
          </div>
        </div>

        <!-- Sección central: Navegación de Vistas -->
        <nav class="nav-links">
          <button
            class="nav-tab-btn"
            [class.active]="currentView === 'calendar'"
            (click)="setView('calendar')"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect width="18" height="18" x="3" y="4" rx="2" ry="2"/><line x1="16" x2="16" y1="2" y2="6"/><line x1="8" x2="8" y1="2" y2="6"/><line x1="3" x2="21" y1="10" y2="10"/></svg>
            <span>Cronograma Público</span>
          </button>

          @if (authService.isLoggedIn()) {
            <button
              class="nav-tab-btn"
              [class.active]="currentView === 'management'"
              (click)="setView('management')"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
              <span>Gestión Unificada</span>
            </button>
          }
        </nav>

        <!-- Sección derecha: Usuario autenticado / Botón de Iniciar Sesión -->
        <div class="navbar-actions">
          
          <!-- SI EL USUARIO NO HA INICIADO SESIÓN -->
          <ng-container *ngIf="!authService.isLoggedIn()">
            <div class="public-badge hide-mobile">
              <span class="pulse-dot"></span>
              <span>Portal de Consulta</span>
            </div>
            
            <button class="login-trigger-btn" (click)="onOpenLogin()">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"/>
                <polyline points="10 17 15 12 10 7"/>
                <line x1="15" y1="12" x2="3" y2="12"/>
              </svg>
              <span>Iniciar Sesión</span>
            </button>
          </ng-container>

          <!-- SI EL USUARIO YA ESTÁ AUTENTICADO -->
          <ng-container *ngIf="authService.currentUser() as user">
            <div class="user-profile-badge">
              <div class="user-avatar-icon" [title]="user.name">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/>
                  <circle cx="12" cy="7" r="4"/>
                </svg>
              </div>
              <div class="user-info">
                <span class="user-name">{{ user.name }}</span>
                <span class="role-tag" [ngClass]="(user.role || user.rol || '').toLowerCase()">
                  {{ getRoleLabel(user.role || user.rol) }}
                </span>
              </div>
            </div>

            <button class="logout-btn" (click)="onLogout()" title="Cerrar sesión">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
                <polyline points="16 17 21 12 16 7"/>
                <line x1="21" y1="12" x2="9" y2="12"/>
              </svg>
              <span class="hide-mobile">Salir</span>
            </button>
          </ng-container>

        </div>

      </div>
    </header>
  `,
  styles: [`
    .navbar-header {
      background: #ffffff;
      border-bottom: 2px solid var(--primary-blue);
      padding: 10px 24px;
      position: sticky;
      top: 0;
      z-index: 100;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.06);
    }

    .navbar-container {
      max-width: 1240px;
      margin: 0 auto;
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: 16px;
    }

    .navbar-brand {
      display: flex;
      align-items: center;
      gap: 12px;
      text-decoration: none;
    }

    .logo-icon {
      background: var(--primary-blue);
      color: white;
      padding: 8px;
      border-radius: 8px;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .brand-text {
      display: flex;
      flex-direction: column;
    }

    .brand-name {
      font-size: 1.25rem;
      font-weight: 800;
      color: var(--primary-blue);
      letter-spacing: -0.02em;
    }

    .brand-sub {
      font-size: 0.72rem;
      font-weight: 700;
      color: var(--accent-red);
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }

    .nav-links {
      display: flex;
      gap: 6px;
      align-items: center;
    }

    .nav-tab-btn {
      background: transparent;
      border: 1.5px solid transparent;
      padding: 8px 16px;
      border-radius: 6px;
      font-size: 14px;
      font-weight: 600;
      color: var(--text-dark);
      cursor: pointer;
      display: inline-flex;
      align-items: center;
      gap: 6px;
      transition: all 0.25s ease;
    }

    .nav-tab-btn:hover {
      background: var(--primary-blue-light);
      color: var(--primary-blue);
    }

    .nav-tab-btn.active {
      background: var(--primary-blue);
      color: #ffffff;
      border-color: var(--primary-blue);
    }

    .navbar-actions {
      display: flex;
      align-items: center;
      gap: 12px;
    }

    .public-badge {
      display: flex;
      align-items: center;
      gap: 6px;
      background: #f1f5f9;
      padding: 6px 12px;
      border-radius: 20px;
      font-size: 12px;
      font-weight: 600;
      color: #475569;
    }

    .pulse-dot {
      width: 8px;
      height: 8px;
      background: #10b981;
      border-radius: 50%;
      box-shadow: 0 0 0 2px rgba(16, 185, 129, 0.2);
    }

    .login-trigger-btn {
      background: var(--primary-blue);
      color: white;
      border: 2px solid var(--primary-blue);
      padding: 8px 18px;
      border-radius: 6px;
      font-size: 14px;
      font-weight: 600;
      cursor: pointer;
      display: flex;
      align-items: center;
      gap: 6px;
      transition: all 0.3s ease;
    }

    .login-trigger-btn:hover {
      background: transparent;
      color: var(--primary-blue);
    }

    .user-profile-badge {
      display: flex;
      align-items: center;
      gap: 8px;
      background: #f8fafc;
      padding: 4px 12px 4px 4px;
      border-radius: 30px;
      border: 1px solid var(--border-color);
    }

    .user-avatar-icon {
      width: 32px;
      height: 32px;
      border-radius: 50%;
      background: #e6eef5;
      color: var(--primary-blue, #003366);
      display: flex;
      align-items: center;
      justify-content: center;
      border: 1px solid #cbd5e1;
      flex-shrink: 0;
    }

    .user-info {
      display: flex;
      flex-direction: column;
    }

    .user-name {
      font-size: 13px;
      font-weight: 700;
      color: var(--text-dark);
      line-height: 1.2;
    }

    .role-tag {
      font-size: 11px;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.04em;
    }

    .role-tag.admin { color: var(--accent-red); }
    .role-tag.bienestar { color: var(--primary-blue); }
    .role-tag.lider { color: #b45309; }

    .logout-btn {
      background: transparent;
      border: 1.5px solid var(--border-color);
      color: var(--text-muted);
      padding: 6px 12px;
      border-radius: 6px;
      font-size: 13px;
      font-weight: 600;
      cursor: pointer;
      display: flex;
      align-items: center;
      gap: 6px;
      transition: all 0.2s ease;
    }

    .logout-btn:hover {
      background: #fee2e2;
      border-color: #f87171;
      color: #991b1b;
    }

    @media (max-width: 768px) {
      .hide-mobile { display: none; }
      .nav-tab-btn span { display: none; }
      .nav-tab-btn { padding: 8px 10px; }
    }
  `]
})
export class NavbarComponent {
  @Input() currentView: 'calendar' | 'management' = 'calendar';
  @Output() openLogin = new EventEmitter<void>();
  @Output() viewChange = new EventEmitter<'calendar' | 'management'>();

  constructor(public authService: AuthService) {}

  onOpenLogin(): void {
    this.openLogin.emit();
  }

  setView(view: 'calendar' | 'management'): void {
    this.currentView = view;
    this.viewChange.emit(view);
  }

  onLogout(): void {
    this.authService.logout();
    this.setView('calendar');
  }

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