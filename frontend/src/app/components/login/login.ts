import { Component, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <!-- Modal Backdrop -->
    <div class="modal-backdrop" (click)="onClose()">
      
      <!-- Contenedor del Modal -->
      <div class="modal-container login-modal" (click)="$event.stopPropagation()">
        
        <!-- Botón de Cerrar Modal -->
        <button class="close-btn" (click)="onClose()" title="Cerrar modal">&times;</button>

        <!-- Cabecera del Modal -->
        <div class="login-header">
          <div class="login-icon-badge">
            <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"/>
              <polyline points="10 17 15 12 10 7"/>
              <line x1="15" y1="12" x2="3" y2="12"/>
            </svg>
          </div>
          <h2 class="login-title">Acceso al Sistema</h2>
          <p class="login-subtitle">Ingresa tus credenciales institucionales para iniciar sesión</p>
        </div>

        <!-- Alerta de Error si falla el Login -->
        <div *ngIf="errorMessage" class="error-banner">
          <span>⚠️ {{ errorMessage }}</span>
        </div>

        <!-- Formulario de Inicio de Sesión -->
        <form (ngSubmit)="onSubmitForm()" class="login-form">
          <div class="form-group">
            <label for="email">Correo Institucional</label>
            <input 
              type="email" 
              id="email" 
              [(ngModel)]="email" 
              name="email" 
              placeholder="ejemplo@unite.edu.co" 
              required
              class="form-input" />
          </div>

          <div class="form-group">
            <label for="password">Contraseña</label>
            <input 
              type="password" 
              id="password" 
              [(ngModel)]="password" 
              name="password" 
              placeholder="••••••••" 
              required
              class="form-input" />
          </div>

          <!-- Botón submit -->
          <button type="submit" class="submit-btn" [disabled]="isLoading">
            <span *ngIf="!isLoading">Ingresar al Sistema</span>
            <span *ngIf="isLoading" class="spinner">Verificando...</span>
          </button>
        </form>

        <div class="login-footer">
          <p>¿Problemas para acceder? Contacta a Soporte de Bienestar Universitario.</p>
        </div>

      </div>
    </div>
  `,
  styles: [`
    .modal-backdrop {
      position: fixed;
      top: 0;
      left: 0;
      width: 100vw;
      height: 100vh;
      background: rgba(15, 23, 42, 0.75);
      backdrop-filter: blur(4px);
      display: flex;
      justify-content: center;
      align-items: center;
      z-index: 1000;
      animation: fadeIn 0.2s ease-out;
    }

    .login-modal {
      background: #ffffff;
      width: 100%;
      max-width: 420px;
      border-radius: 16px;
      padding: 28px;
      box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
      position: relative;
      animation: slideUp 0.25s ease-out;
    }

    .close-btn {
      position: absolute;
      top: 18px;
      right: 20px;
      background: none;
      border: none;
      font-size: 24px;
      color: #64748b;
      cursor: pointer;
      line-height: 1;
      padding: 4px;
      border-radius: 50%;
      transition: all 0.2s;
    }
    .close-btn:hover {
      color: #0f172a;
      background: #f1f5f9;
    }

    .login-header {
      text-align: center;
      margin-bottom: 24px;
    }

    .login-icon-badge {
      width: 52px;
      height: 52px;
      background: #eff6ff;
      color: #2563eb;
      border-radius: 14px;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      margin-bottom: 12px;
    }

    .login-title {
      font-size: 22px;
      font-weight: 700;
      color: #0f172a;
      margin: 0 0 6px 0;
    }

    .login-subtitle {
      font-size: 13px;
      color: #64748b;
      margin: 0;
    }

    .error-banner {
      background: #fef2f2;
      border: 1px solid #fecaca;
      color: #dc2626;
      padding: 10px 14px;
      border-radius: 8px;
      font-size: 13px;
      margin-bottom: 18px;
    }

    .login-form {
      display: flex;
      flex-direction: column;
      gap: 14px;
    }

    .form-group {
      display: flex;
      flex-direction: column;
      gap: 6px;
    }

    .form-group label {
      font-size: 13px;
      font-weight: 500;
      color: #334155;
    }

    .form-input {
      padding: 10px 14px;
      border: 1px solid #cbd5e1;
      border-radius: 8px;
      font-size: 14px;
      transition: all 0.2s;
    }

    .form-input:focus {
      outline: none;
      border-color: #2563eb;
      box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.15);
    }

    .submit-btn {
      margin-top: 8px;
      padding: 12px;
      background: #2563eb;
      color: #ffffff;
      border: none;
      border-radius: 8px;
      font-size: 14px;
      font-weight: 600;
      cursor: pointer;
      transition: background 0.2s;
    }

    .submit-btn:hover {
      background: #1d4ed8;
    }

    .submit-btn:disabled {
      background: #94a3b8;
      cursor: not-allowed;
    }

    .login-footer {
      margin-top: 20px;
      text-align: center;
      font-size: 11px;
      color: #94a3b8;
    }

    @keyframes fadeIn {
      from { opacity: 0; }
      to { opacity: 1; }
    }

    @keyframes slideUp {
      from { opacity: 0; transform: translateY(12px); }
      to { opacity: 1; transform: translateY(0); }
    }
  `]
})
export class LoginComponent {
  @Output() close = new EventEmitter<void>();

  email = '';
  password = '';
  errorMessage = '';
  isLoading = false;

  constructor(private authService: AuthService) {}

  onSubmitForm(): void {
    if (!this.email || !this.password) {
      this.errorMessage = 'Por favor ingresa tu correo y contraseña.';
      return;
    }
    
    this.isLoading = true;
    this.errorMessage = '';

    this.authService.login({ email: this.email, password: this.password }).subscribe({
      next: (res) => {
        this.isLoading = false;
        if (res && res.user) {
          this.authService.closeLoginModal();
          this.close.emit();
        } else {
          this.errorMessage = 'No se pudo iniciar sesión. Verifica tus credenciales.';
        }
      },
      error: (err) => {
        this.isLoading = false;
        if (err.status === 401) {
          this.errorMessage = 'Credenciales inválidas. Verifica tu correo y contraseña.';
        } else {
          this.errorMessage = 'No se pudo conectar con el servidor Backend. Verifica que esté encendido.';
        }
      }
    });
  }

  onClose(): void {
    this.authService.closeLoginModal();
    this.close.emit();
  }
}
