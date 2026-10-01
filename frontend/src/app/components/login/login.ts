import { Component, Output, EventEmitter, signal, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class LoginComponent {
  // Evento emitido al cerrar el modal de inicio de sesión
  @Output() close = new EventEmitter<void>();

  // Campos del formulario vinculados con ngModel
  email = '';
  password = '';

  // Estado reactivo (Signals) para mostrar u ocultar la contraseña con el ojito
  showPassword = signal<boolean>(false);

  // Estado reactivo (Signals) para mensajes de error y loader
  errorMessage = signal<string | null>(null);
  isLoading = signal<boolean>(false);

  constructor(
    private authService: AuthService,
    private cdr: ChangeDetectorRef
  ) {}

  // Alterna la visibilidad de la contraseña (texto vs contraseña)
  togglePasswordVisibility(): void {
    this.showPassword.update(val => !val);
  }

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
