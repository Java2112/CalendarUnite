import { Component, EventEmitter, Input, OnInit, Output, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { User, UserRole, CreateUserRequest, UpdateUserRequest } from '../../models/user.model';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-user-form',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="cu-modal-backdrop" (click)="onClose()">
      <div class="cu-modal-card" (click)="$event.stopPropagation()">
        
        <!-- Header -->
        <div class="cu-modal-header">
          <h2>{{ isEditing ? 'Editar Usuario' : 'Registrar Nuevo Usuario' }}</h2>
          <button class="btn-cu-icon" (click)="onClose()" title="Cerrar modal">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
          </button>
        </div>

        <!-- Formulario completo -->
        <form (ngSubmit)="onSubmit()" style="display:flex; flex-direction:column; flex:1; overflow:hidden; margin:0;">
          <!-- Body con Scroll -->
          <div class="cu-modal-body" style="flex:1; overflow-y:auto; padding:24px;">
            @if (errorMessage) {
              <div class="error-banner" style="background:#fee2e2; border:1px solid #f87171; color:#991b1b; padding:10px 14px; border-radius:8px; margin-bottom:16px; font-size:14px; display:flex; align-items:center; gap:8px;">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <circle cx="12" cy="12" r="10"/>
                  <line x1="12" y1="8" x2="12" y2="12"/>
                  <line x1="12" y1="16" x2="12.01" y2="16"/>
                </svg>
                <span>{{ errorMessage }}</span>
              </div>
            }

            <!-- Nombres y Apellidos -->
            <div class="form-grid-2" style="margin-bottom: 16px;">
              <div class="form-group">
                <label style="display:block; font-weight:600; font-size:14px; margin-bottom:6px; color:var(--text-dark);">
                  Nombre *
                </label>
                <input
                  type="text"
                  [(ngModel)]="nombre"
                  name="nombre"
                  required
                  placeholder="Ej. Andrés"
                  class="form-input"
                  style="width:100%; padding:10px 14px; border:1.5px solid var(--border-color); border-radius:6px; font-size:15px;"
                />
              </div>

              <div class="form-group">
                <label style="display:block; font-weight:600; font-size:14px; margin-bottom:6px; color:var(--text-dark);">
                  Apellido *
                </label>
                <input
                  type="text"
                  [(ngModel)]="apellido"
                  name="apellido"
                  required
                  placeholder="Ej. Gómez"
                  class="form-input"
                  style="width:100%; padding:10px 14px; border:1.5px solid var(--border-color); border-radius:6px; font-size:15px;"
                />
              </div>
            </div>

            <!-- Correo y Teléfono -->
            <div class="form-grid-2" style="margin-bottom: 16px;">
              <div class="form-group">
                <label style="display:block; font-weight:600; font-size:14px; margin-bottom:6px; color:var(--text-dark);">
                  Correo Electrónico Institucional *
                </label>
                <input
                  type="email"
                  [(ngModel)]="correo"
                  name="correo"
                  required
                  placeholder="ejemplo@unite.edu.co"
                  class="form-input"
                  style="width:100%; padding:10px 14px; border:1.5px solid var(--border-color); border-radius:6px; font-size:15px;"
                />
              </div>

              <div class="form-group">
                <label style="display:block; font-weight:600; font-size:14px; margin-bottom:6px; color:var(--text-dark);">
                  Teléfono de Contacto
                </label>
                <input
                  type="text"
                  [(ngModel)]="telefono"
                  name="telefono"
                  placeholder="Ej. 3101234567"
                  class="form-input"
                  style="width:100%; padding:10px 14px; border:1.5px solid var(--border-color); border-radius:6px; font-size:15px;"
                />
              </div>
            </div>

            <!-- Rol y Contraseña -->
            <div class="form-grid-2" style="margin-bottom: 16px;">
              <div class="form-group">
                <label style="display:block; font-weight:600; font-size:14px; margin-bottom:6px; color:var(--text-dark);">
                  Rol Institucional (Enum tipo_rol) *
                </label>
                <select
                  [(ngModel)]="rol"
                  name="rol"
                  required
                  class="form-input"
                  style="width:100%; padding:10px 14px; border:1.5px solid var(--border-color); border-radius:6px; font-size:15px; background:white;"
                >
                  <option value="Lider">Líder Estudiantil</option>
                  <option value="Bienestar">Bienestar Universitario</option>
                  <option value="Admin">Administrador General</option>
                </select>
              </div>

              <div class="form-group">
                <label style="display:block; font-weight:600; font-size:14px; margin-bottom:6px; color:var(--text-dark);">
                  {{ isEditing ? 'Nueva Contraseña (Opcional)' : 'Contraseña de Acceso *' }}
                </label>
                <input
                  type="password"
                  [(ngModel)]="password"
                  name="password"
                  [required]="!isEditing"
                  placeholder="••••••••"
                  class="form-input"
                  style="width:100%; padding:10px 14px; border:1.5px solid var(--border-color); border-radius:6px; font-size:15px;"
                />
              </div>
            </div>

            <!-- Estado Activo / Inactivo -->
            <div class="form-group" style="margin-bottom: 24px;">
              <label style="display:flex; align-items:center; gap:8px; cursor:pointer; font-weight:600; font-size:14px; color:var(--text-dark);">
                <input
                  type="checkbox"
                  [(ngModel)]="estado"
                  name="estado"
                  style="width:18px; height:18px; accent-color:var(--primary-blue);"
                />
                <span>Usuario Activo (Permite inicio de sesión en el sistema)</span>
              </label>
            </div>
          </div>

          <!-- Footer fijo con Botones -->
          <div class="cu-modal-footer">
            <button type="button" (click)="onClose()" class="btn-cu-outline">
              Cancelar
            </button>
            <button type="submit" [disabled]="isSubmitting" class="btn-cu-primary">
              {{ isSubmitting ? 'Guardando...' : (isEditing ? 'Actualizar Usuario' : 'Crear Usuario') }}
            </button>
          </div>
        </form>

      </div>
    </div>
  `
})
export class UserFormComponent implements OnInit {
  @Input() userToEdit: User | null = null;
  @Output() close = new EventEmitter<void>();
  @Output() saved = new EventEmitter<User>();

  nombre: string = '';
  apellido: string = '';
  correo: string = '';
  password: string = '';
  rol: UserRole = 'Lider';
  telefono: string = '';
  estado: boolean = true;

  isSubmitting: boolean = false;
  errorMessage: string | null = null;

  get isEditing(): boolean {
    return this.userToEdit !== null;
  }

  constructor(
    private authService: AuthService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    if (this.userToEdit) {
      this.nombre = this.userToEdit.nombre || this.userToEdit.name.split(' ')[0] || '';
      this.apellido = this.userToEdit.apellido || this.userToEdit.name.split(' ').slice(1).join(' ') || '';
      this.correo = this.userToEdit.correo || this.userToEdit.email || '';
      this.rol = this.userToEdit.rol || this.userToEdit.role || 'Lider';
      this.telefono = this.userToEdit.telefono || '';
      this.estado = this.userToEdit.estado !== undefined ? this.userToEdit.estado : true;
    }
  }

  onClose(): void {
    this.close.emit();
  }

  onSubmit(): void {
    if (!this.nombre.trim() || !this.apellido.trim() || !this.correo.trim()) {
      this.errorMessage = 'Nombre, apellido y correo son campos obligatorios.';
      return;
    }

    this.isSubmitting = true;
    this.errorMessage = null;

    if (this.isEditing && this.userToEdit) {
      const updateData: UpdateUserRequest = {
        nombre: this.nombre.trim(),
        apellido: this.apellido.trim(),
        correo: this.correo.trim(),
        rol: this.rol,
        telefono: this.telefono.trim(),
        estado: this.estado
      };

      if (this.password && this.password.trim() !== '') {
        updateData.password = this.password.trim();
      }

      const userId = this.userToEdit.id_usuario || Number(this.userToEdit.id);
      this.authService.updateUser(userId, updateData).subscribe({
        next: (res) => {
          this.isSubmitting = false;
          this.cdr.markForCheck();
          this.saved.emit(res.user);
        },
        error: (err) => {
          this.isSubmitting = false;
          this.errorMessage = err.error?.error || 'Error al actualizar usuario.';
          this.cdr.markForCheck();
        }
      });
    } else {
      const createData: CreateUserRequest = {
        nombre: this.nombre.trim(),
        apellido: this.apellido.trim(),
        correo: this.correo.trim(),
        password: this.password.trim() || 'Unite2026*',
        rol: this.rol,
        telefono: this.telefono.trim(),
        estado: this.estado
      };

      this.authService.createUser(createData).subscribe({
        next: (res) => {
          this.isSubmitting = false;
          this.cdr.markForCheck();
          this.saved.emit(res.user);
        },
        error: (err) => {
          this.isSubmitting = false;
          this.errorMessage = err.error?.error || 'Error al registrar usuario.';
          this.cdr.markForCheck();
        }
      });
    }
  }
}
