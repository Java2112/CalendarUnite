import { Component, Output, EventEmitter, signal, ChangeDetectorRef } from '@angular/core';
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

        <!-- Alerta de Error si falla el Login (Sin emojis, con icono SVG limpio) -->
        @if (errorMessage()) {
          <div class="error-banner">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <circle cx="12" cy="12" r="10"/>
              <line x1="12" y1="8" x2="12" y2="12"/>
              <line x1="12" y1="16" x2="12.01" y2="16"/>
            </svg>
            <span>{{ errorMessage() }}</span>
          </div>
        }

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

          <!-- Botón submit reactivo con Signals -->
          <button type="submit" class="submit-btn" [disabled]="isLoading()">
            @if (!isLoading()) {
              <span>Ingresar al Sistema</span>
            } @else {
              <span class="spinner">Verificando...</span>
            }
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
      background: rgba(10, 35, 66, 0.7);
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
      color: #555555;
      cursor: pointer;
      line-height: 1;
      padding: 4px;
      border-radius: 50%;
      transition: all 0.2s;
    }
    .close-btn:hover {
      color: #003366;
      background: #f1f5f9;
    }

    .login-header {
      text-align: center;
      margin-bottom: 24px;
    }

    .login-icon-badge {
      width: 52px;
      height: 52px;
      background: #e6eef5;
      color: #003366;
      border-radius: 14px;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      margin-bottom: 12px;
    }

    .login-title {
      font-size: 22px;
      font-weight: 700;
      color: #003366;
      margin: 0 0 6px 0;
    }

    .login-subtitle {
      font-size: 13px;
      color: #555555;
      margin: 0;
    }

    .error-banner {
      background: #fee2e2;
      border: 1px solid #f87171;
      color: #991b1b;
      padding: 10px 14px;
      border-radius: 8px;
      font-size: 13px;
      margin-bottom: 18px;
      display: flex;
      align-items: center;
      gap: 8px;
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
      font-weight: 600;
      color: #333333;
    }

    .form-input {
      padding: 10px 14px;
      border: 1.5px solid #d1d5db;
      border-radius: 8px;
      font-size: 14px;
      transition: all 0.2s;
    }

    .form-input:focus {
      outline: none;
      border-color: #003366;
      box-shadow: 0 0 0 3px rgba(0, 51, 102, 0.15);
    }

    .submit-btn {
      margin-top: 8px;
      padding: 12px;
      background: #003366;
      color: #ffffff;
      border: none;
      border-radius: 8px;
      font-size: 14px;
      font-weight: 600;
      cursor: pointer;
      transition: background 0.2s;
    }

    .submit-btn:hover {
      background: #0A2342;
    }

    .submit-btn:disabled {
      background: #94a3b8;
      cursor: not-allowed;
    }

    .login-footer {
      margin-top: 20px;
      text-align: center;
      font-size: 12px;
      color: #64748b;
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
  errorMessage = signal<string | null>(null);
  isLoading = signal<boolean>(false);

  constructor(
    private authService: AuthService,
    private cdr: ChangeDetectorRef
  ) {}

  onSubmitForm(): void {
    if (!this.email || !this.password) {
      this.errorMessage.set('Por favor ingresa tu correo y contraseña.');
      this.cdr.markForCheck();
      return;
    }
    
    this.isLoading.set(true);
    this.errorMessage.set(null);
    this.cdr.markForCheck();

    this.authService.login({ email: this.email, password: this.password }).subscribe({
      next: (res) => {
        this.isLoading.set(false);
        this.cdr.markForCheck();
        if (res && res.user) {
          this.authService.closeLoginModal();
          this.close.emit();
        } else {
          this.errorMessage.set('No se pudo iniciar sesión. Verifica tus credenciales.');
          this.cdr.markForCheck();
        }
      },
      error: (err) => {
        this.isLoading.set(false);
        if (err.status === 401) {
          this.errorMessage.set(err.error?.error || 'Credenciales inválidas. Verifica tu correo y contraseña.');
        } else if (err.status === 403) {
          this.errorMessage.set(err.error?.error || 'Tu cuenta se encuentra inactiva. Contacta al Administrador.');
        } else {
          this.errorMessage.set('No se pudo conectar con el servidor Backend. Verifica que esté encendido.');
        }
        this.cdr.markForCheck();
      }
    });
  }

  onClose(): void {
    this.authService.closeLoginModal();
    this.close.emit();
  }
}
