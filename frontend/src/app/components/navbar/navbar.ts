import { Component, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule],
  template: `
    <!-- Encabezado principal de la barra de navegación superior -->
    <header class="navbar-header">
      <div class="navbar-container">
        
        <!-- Sección izquierda: Logotipo y títulos de la aplicación -->
        <div class="navbar-brand">
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
              <img [src]="user.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=100&q=80'" [alt]="user.name" class="user-avatar" />
              <div class="user-info">
                <span class="user-name">{{ user.name }}</span>
                <span class="role-tag" [ngClass]="user.role.toLowerCase()">
                  {{ getRoleLabel(user.role) }}
                </span>
              </div>
            </div>

            <button class="logout-btn" (click)="authService.logout()" title="Cerrar sesión">
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
      border-bottom: 1px solid #e2e8f0;
      padding: 12px 24px;
      position: sticky;
      top: 0;
      z-index: 100;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
    }

    .navbar-container {
      max-width: 1200px;
      margin: 0 auto;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .navbar-brand {
      display: flex;
      align-items: center;
      gap: 12px;
    }

    .logo-icon {
      width: 40px;
      height: 40px;
      background: #2563eb;
      color: #ffffff;
      border-radius: 10px;
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: 0 4px 6px -1px rgba(37, 99, 235, 0.2);
    }

    .brand-text {
      display: flex;
      flex-direction: column;
    }

    .brand-name {
      font-weight: 800;
      font-size: 18px;
      color: #0f172a;
      line-height: 1.1;
      letter-spacing: -0.3px;
    }

    .brand-sub {
      font-size: 11px;
      color: #64748b;
      font-weight: 500;
    }

    .navbar-actions {
      display: flex;
      align-items: center;
      gap: 14px;
    }

    .public-badge {
      display: flex;
      align-items: center;
      gap: 8px;
      background: #f1f5f9;
      color: #475569;
      font-size: 12px;
      padding: 6px 12px;
      border-radius: 20px;
      font-weight: 500;
    }

    .pulse-dot {
      width: 8px;
      height: 8px;
      background: #10b981;
      border-radius: 50%;
      box-shadow: 0 0 0 0 rgba(16, 185, 129, 0.7);
      animation: pulse 2s infinite;
    }

    .login-trigger-btn {
      display: flex;
      align-items: center;
      gap: 8px;
      background: #2563eb;
      color: #ffffff;
      border: none;
      padding: 8px 16px;
      border-radius: 8px;
      font-size: 13px;
      font-weight: 600;
      cursor: pointer;
      transition: background 0.2s, transform 0.1s;
    }
    .login-trigger-btn:hover {
      background: #1d4ed8;
      transform: translateY(-1px);
    }

    .user-profile-badge {
      display: flex;
      align-items: center;
      gap: 10px;
      background: #f8fafc;
      border: 1px solid #e2e8f0;
      padding: 4px 12px 4px 6px;
      border-radius: 30px;
    }

    .user-avatar {
      width: 34px;
      height: 34px;
      border-radius: 50%;
      object-fit: cover;
    }

    .user-info {
      display: flex;
      flex-direction: column;
    }

    .user-name {
      font-size: 12px;
      font-weight: 700;
      color: #1e293b;
      line-height: 1.2;
    }

    .role-tag {
      font-size: 10px;
      font-weight: 700;
      padding: 1px 6px;
      border-radius: 4px;
      display: inline-block;
      width: fit-content;
      text-transform: uppercase;
      letter-spacing: 0.3px;
    }

    .role-tag.admin {
      background: #fae8ff;
      color: #86198f;
    }

    .role-tag.bienestar {
      background: #dcfce7;
      color: #166534;
    }

    .role-tag.lider {
      background: #fef3c7;
      color: #92400e;
    }

    .logout-btn {
      display: flex;
      align-items: center;
      gap: 6px;
      background: #f1f5f9;
      color: #64748b;
      border: 1px solid #cbd5e1;
      padding: 7px 12px;
      border-radius: 8px;
      font-size: 12px;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.2s;
    }

    .logout-btn:hover {
      background: #fee2e2;
      color: #dc2626;
      border-color: #fecaca;
    }

    @keyframes pulse {
      0% { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(16, 185, 129, 0.7); }
      70% { transform: scale(1); box-shadow: 0 0 0 6px rgba(16, 185, 129, 0); }
      100% { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(16, 185, 129, 0); }
    }

    @media (max-width: 640px) {
      .hide-mobile { display: none; }
    }
  `]
})
export class NavbarComponent {
  @Output() openLogin = new EventEmitter<void>();

  constructor(public authService: AuthService) {}

  onOpenLogin(): void {
    this.authService.openLoginModal();
    this.openLogin.emit();
  }

  getRoleLabel(role: string): string {
    switch (role) {
      case 'Admin': return '⚡ Admin';
      case 'Bienestar': return '🏥 Bienestar';
      case 'Lider': return '🎓 Líder';
      default: return role;
    }
  }
}